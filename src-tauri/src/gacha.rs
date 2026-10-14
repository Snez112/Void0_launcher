use crate::db::{self, StarwardGachaItem};
use serde::Deserialize;
use std::fs;
use std::path::{Path, PathBuf};
use std::time::Duration;

#[derive(Debug, Deserialize)]
struct HoyoGachaResponse {
    retcode: i32,
    message: String,
    data: Option<HoyoGachaData>,
}

#[derive(Debug, Deserialize)]
struct HoyoGachaData {
    list: Option<Vec<HoyoRawRecord>>,
}

#[derive(Debug, Deserialize)]
#[allow(dead_code)]
struct HoyoRawRecord {
    id: String,
    uid: String,
    #[serde(default)]
    gacha_type: String,
    #[serde(default)]
    item_id: Option<String>,
    #[serde(default)]
    count: Option<String>,
    time: String,
    name: String,
    #[serde(default)]
    lang: Option<String>,
    item_type: String,
    rank_type: String,
    #[serde(default)]
    gacha_id: Option<String>,
}

#[derive(Debug, Deserialize)]
struct ConfigListResponse {
    data: Option<ConfigListData>,
}

#[derive(Debug, Deserialize)]
struct ConfigListData {
    gacha_type_list: Option<Vec<ConfigTypeItem>>,
}

#[derive(Debug, Deserialize)]
struct ConfigTypeItem {
    id: String,
}

pub fn find_gacha_url_in_cache(game_biz: &str, exe_path: &str) -> Option<String> {
    let mut search_dirs = Vec::new();

    // 1. Check next to game exe: <game_dir>/webCaches
    if !exe_path.is_empty() {
        if let Some(parent) = Path::new(exe_path).parent() {
            search_dirs.push(parent.join("webCaches"));
        }
    }

    // 2. Check %USERPROFILE%/AppData/LocalLow
    if let Ok(user_profile) = std::env::var("USERPROFILE") {
        let locallow = PathBuf::from(user_profile).join("AppData").join("LocalLow");
        if game_biz.contains("nap") || game_biz.contains("zzz") {
            search_dirs.push(locallow.join("miHoYo").join("ZenlessZoneZero").join("webCaches"));
        } else if game_biz.contains("hk4e") || game_biz.contains("genshin") {
            search_dirs.push(locallow.join("miHoYo").join("Genshin Impact").join("webCaches"));
        } else if game_biz.contains("hkrpg") || game_biz.contains("starrail") {
            search_dirs.push(locallow.join("Cognosphere").join("StarRail").join("webCaches"));
        }
    }

    for base in search_dirs {
        if !base.exists() {
            continue;
        }
        if let Some(url) = scan_dir_for_gacha_url(&base) {
            return Some(url);
        }
    }
    None
}

fn scan_dir_for_gacha_url(dir: &Path) -> Option<String> {
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                if let Some(found) = scan_dir_for_gacha_url(&path) {
                    return Some(found);
                }
            } else if path.file_name().map(|n| n == "data_2").unwrap_or(false) {
                if let Ok(bytes) = fs::read(&path) {
                    if let Some(url) = extract_url_from_bytes(&bytes) {
                        return Some(url);
                    }
                }
            }
        }
    }
    None
}

fn extract_url_from_bytes(bytes: &[u8]) -> Option<String> {
    // Search for "getGachaLog" in the cache file
    let needle = b"getGachaLog?";
    if let Some(pos) = bytes.windows(needle.len()).rposition(|w| w == needle) {
        let start = bytes[..pos]
            .windows(8)
            .rposition(|w| w == b"https://")
            .unwrap_or(pos);

        let end = bytes[start..]
            .iter()
            .position(|&b| b == 0 || b == b' ' || b == b'"' || b == b'\r' || b == b'\n')
            .map(|offset| start + offset)
            .unwrap_or(bytes.len());

        let url_str = String::from_utf8_lossy(&bytes[start..end]).to_string();
        if url_str.contains("authkey=") {
            return Some(url_str);
        }
    }
    None
}

pub async fn import_gacha_records(
    gacha_url: &str,
    game_biz: &str,
) -> Result<usize, String> {
    let client = reqwest::Client::builder()
        .user_agent("Mozilla/5.0")
        .build()
        .map_err(|e| e.to_string())?;

    let parsed_url = reqwest::Url::parse(gacha_url).map_err(|e| format!("URL không hợp lệ: {}", e))?;
    let mut base_url = parsed_url.clone();
    base_url.set_query(None);

    let config_url = base_url.as_str().replace("getGachaLog", "getConfigList");
    let mut config_req_url = reqwest::Url::parse(&config_url).map_err(|e| e.to_string())?;
    config_req_url.set_query(parsed_url.query());

    let mut banner_types: Vec<i32> = Vec::new();
    if let Ok(res) = client.get(config_req_url).send().await {
        if let Ok(cfg_json) = res.json::<ConfigListResponse>().await {
            if let Some(data) = cfg_json.data {
                if let Some(list) = data.gacha_type_list {
                    for item in list {
                        if let Ok(val) = item.id.parse::<i32>() {
                            banner_types.push(val);
                        }
                    }
                }
            }
        }
    }

    if banner_types.is_empty() {
        if game_biz.contains("nap") || game_biz.contains("zzz") {
            banner_types = vec![1, 2, 3, 5];
        } else if game_biz.contains("hkrpg") || game_biz.contains("starrail") {
            banner_types = vec![1, 2, 11, 12];
        } else {
            banner_types = vec![100, 200, 301, 302];
        }
    }

    let table = db::get_table_name(game_biz);
    let mut total_saved = 0;
    let mut found_uid: Option<i64> = None;

    for g_type in banner_types {
        let mut end_id = "0".to_string();

        loop {
            let mut page_url = parsed_url.clone();
            let mut pairs: Vec<(String, String)> = page_url
                .query_pairs()
                .filter(|(k, _)| k != "gacha_type" && k != "size" && k != "end_id")
                .map(|(k, v)| (k.to_string(), v.to_string()))
                .collect();

            pairs.push(("gacha_type".to_string(), g_type.to_string()));
            pairs.push(("size".to_string(), "20".to_string()));
            pairs.push(("end_id".to_string(), end_id.clone()));

            page_url.query_pairs_mut().clear().extend_pairs(pairs);

            let res = client
                .get(page_url)
                .send()
                .await
                .map_err(|e| format!("Lỗi kết nối gacha API: {}", e))?;

            let hoyo_res = res
                .json::<HoyoGachaResponse>()
                .await
                .map_err(|e| format!("Lỗi phân tích JSON: {}", e))?;

            if hoyo_res.retcode != 0 {
                if hoyo_res.message.contains("authkey valid error") || hoyo_res.retcode == -101 {
                    return Err("Authkey đã hết hạn! Vui lòng mở lại trang Lịch Sử Roll trong game rồi thử lại.".to_string());
                }
                break;
            }

            let records = hoyo_res.data.and_then(|d| d.list).unwrap_or_default();
            if records.is_empty() {
                break;
            }

            let last_id = records.last().map(|r| r.id.clone()).unwrap_or_default();

            let mut db_records: Vec<StarwardGachaItem> = Vec::new();
            for r in records {
                let uid_num: i64 = r.uid.parse().unwrap_or(0);
                if uid_num > 0 && found_uid.is_none() {
                    found_uid = Some(uid_num);
                }
                let id_num: i64 = r.id.parse().unwrap_or(0);
                let item_id_num: i64 = r.item_id.and_then(|i| i.parse().ok()).unwrap_or(0);
                let rank_num: i32 = r.rank_type.parse().unwrap_or(3);
                let count_num: i32 = r.count.and_then(|c| c.parse().ok()).unwrap_or(1);
                let gacha_id_num: Option<i64> = r.gacha_id.and_then(|g| g.parse().ok());

                db_records.push(StarwardGachaItem {
                    uid: uid_num,
                    id: id_num,
                    name: r.name,
                    time: r.time,
                    item_id: item_id_num,
                    item_type: r.item_type,
                    rank_type: rank_num,
                    gacha_type: g_type,
                    gacha_id: gacha_id_num,
                    count: count_num,
                    lang: r.lang,
                    pity: 1,
                    icon: None,
                });
            }

            let count_insert = db::save_starward_records(table, &db_records)?;
            total_saved += count_insert;

            if count_insert < db_records.len() {
                break;
            }

            end_id = last_id;
            std::thread::sleep(Duration::from_millis(300));
        }
    }

    if let Some(uid) = found_uid {
        let _ = db::save_gacha_url(game_biz, uid, gacha_url);
    }

    Ok(total_saved)
}
