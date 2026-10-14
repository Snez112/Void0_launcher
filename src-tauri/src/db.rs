use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct StarwardGachaItem {
    pub uid: i64,
    pub id: i64,
    pub name: String,
    pub time: String,
    pub item_id: i64,
    pub item_type: String,
    pub rank_type: i32,
    pub gacha_type: i32,
    pub gacha_id: Option<i64>,
    pub count: i32,
    pub lang: Option<String>,
    pub pity: i32,
    pub icon: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UidOption {
    pub uid: i64,
    pub nickname: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FiveStarItem {
    pub name: String,
    pub item_type: String,
    pub time: String,
    pub pity: i32,
    pub gacha_type: i32,
    pub icon: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct BannerStats {
    pub gacha_type: i32,
    pub gacha_name: String,
    pub total_pulls: i32,
    pub current_pity: i32,
    pub five_star_count: i32,
    pub four_star_count: i32,
    pub three_star_count: i32,
    pub ratio_5: f64,
    pub ratio_4: f64,
    pub average_5: f64,
    pub five_stars: Vec<FiveStarItem>,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct GachaOverview {
    pub db_path: String,
    pub total_pulls: i32,
    pub uids: Vec<UidOption>,
    pub selected_uid: Option<i64>,
    pub banners: Vec<BannerStats>,
    pub recent_records: Vec<StarwardGachaItem>,
}

pub fn get_table_name(game_biz: &str) -> &'static str {
    if game_biz.contains("nap") || game_biz.contains("zzz") {
        "ZZZGachaItem"
    } else if game_biz.contains("hkrpg") || game_biz.contains("starrail") {
        "StarRailGachaItem"
    } else {
        "GenshinGachaItem"
    }
}

pub fn get_db_path() -> PathBuf {
    if let Ok(exe) = std::env::current_exe() {
        if let Some(prefix) = exe.components().next() {
            let drive = prefix.as_os_str().to_string_lossy().to_string();
            let mut drive_path = PathBuf::from(format!("{}\\", drive.trim_end_matches('\\')));
            drive_path.push("void0_launcher");
            let _ = std::fs::create_dir_all(&drive_path);
            return drive_path.join("launcher_database.db");
        }
    }
    let fallback = PathBuf::from("void0_launcher");
    let _ = std::fs::create_dir_all(&fallback);
    fallback.join("launcher_database.db")
}

pub fn init_db() -> Result<Connection, String> {
    let path = get_db_path();
    let conn = Connection::open(&path).map_err(|e| format!("Không thể mở database: {}", e))?;

    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS GenshinGachaItem (
            Uid       INTEGER NOT NULL,
            Id        INTEGER NOT NULL,
            Name      TEXT    NOT NULL,
            Time      TEXT    NOT NULL,
            ItemId    INTEGER NOT NULL,
            ItemType  TEXT    NOT NULL,
            RankType  INTEGER NOT NULL,
            GachaType INTEGER NOT NULL,
            Count     INTEGER NOT NULL,
            Lang      TEXT,
            PRIMARY KEY (Uid, Id)
        );
        CREATE TABLE IF NOT EXISTS StarRailGachaItem (
            Uid       INTEGER NOT NULL,
            Id        INTEGER NOT NULL,
            Name      TEXT    NOT NULL,
            Time      TEXT    NOT NULL,
            ItemId    INTEGER NOT NULL,
            ItemType  TEXT    NOT NULL,
            RankType  INTEGER NOT NULL,
            GachaType INTEGER NOT NULL,
            GachaId   INTEGER NOT NULL,
            Count     INTEGER NOT NULL,
            Lang      TEXT,
            PRIMARY KEY (Uid, Id)
        );
        CREATE TABLE IF NOT EXISTS ZZZGachaItem (
            Uid       INTEGER NOT NULL,
            Id        INTEGER NOT NULL,
            Name      TEXT    NOT NULL,
            Time      TEXT    NOT NULL,
            ItemId    INTEGER NOT NULL,
            ItemType  TEXT    NOT NULL,
            RankType  INTEGER NOT NULL,
            GachaType INTEGER NOT NULL,
            Count     INTEGER NOT NULL,
            Lang      TEXT,
            PRIMARY KEY (Uid, Id)
        );
        CREATE TABLE IF NOT EXISTS GachaLogUrl (
            GameBiz TEXT    NOT NULL,
            Uid     INTEGER NOT NULL,
            Url     TEXT    NOT NULL,
            Time    TEXT    NOT NULL,
            PRIMARY KEY (GameBiz, Uid)
        );",
    )
    .map_err(|e| format!("Lỗi tạo schema Starward: {}", e))?;

    Ok(conn)
}

pub fn save_starward_records(
    table: &str,
    records: &[StarwardGachaItem],
) -> Result<usize, String> {
    let mut conn = init_db()?;
    let tx = conn.transaction().map_err(|e| e.to_string())?;
    let mut inserted = 0;

    for r in records {
        let count = if table == "StarRailGachaItem" {
            tx.execute(
                "INSERT OR REPLACE INTO StarRailGachaItem 
                (Uid, Id, Name, Time, ItemId, ItemType, RankType, GachaType, GachaId, Count, Lang)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
                params![
                    r.uid,
                    r.id,
                    r.name,
                    r.time,
                    r.item_id,
                    r.item_type,
                    r.rank_type,
                    r.gacha_type,
                    r.gacha_id.unwrap_or(0),
                    r.count,
                    r.lang
                ],
            )
            .map_err(|e| e.to_string())?
        } else {
            let sql = format!(
                "INSERT OR REPLACE INTO {} 
                (Uid, Id, Name, Time, ItemId, ItemType, RankType, GachaType, Count, Lang)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
                table
            );
            tx.execute(
                &sql,
                params![
                    r.uid,
                    r.id,
                    r.name,
                    r.time,
                    r.item_id,
                    r.item_type,
                    r.rank_type,
                    r.gacha_type,
                    r.count,
                    r.lang
                ],
            )
            .map_err(|e| e.to_string())?
        };
        inserted += count;
    }

    tx.commit().map_err(|e| e.to_string())?;
    Ok(inserted)
}

pub fn save_gacha_url(game_biz: &str, uid: i64, url: &str) -> Result<(), String> {
    let conn = init_db()?;
    let now = chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
    conn.execute(
        "INSERT OR REPLACE INTO GachaLogUrl (GameBiz, Uid, Url, Time) VALUES (?1, ?2, ?3, ?4)",
        params![game_biz, uid, url, now],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn get_gacha_url(game_biz: &str, uid: Option<i64>) -> Option<String> {
    let conn = init_db().ok()?;
    if let Some(uid) = uid {
        conn.query_row(
            "SELECT Url FROM GachaLogUrl WHERE GameBiz = ?1 AND Uid = ?2",
            params![game_biz, uid],
            |r| r.get(0),
        )
        .ok()
    } else {
        conn.query_row(
            "SELECT Url FROM GachaLogUrl WHERE GameBiz = ?1 ORDER BY Time DESC LIMIT 1",
            params![game_biz],
            |r| r.get(0),
        )
        .ok()
    }
}

// Exactly mirror Starward's QueryGachaTypes per game
fn get_starward_query_types(game_biz: &str) -> Vec<i32> {
    if game_biz.contains("nap") || game_biz.contains("zzz") {
        vec![2, 3, 1, 5] // ExclusiveChannel, WEngineChannel, StandardChannel, BangbooChannel
    } else if game_biz.contains("hkrpg") || game_biz.contains("starrail") {
        vec![11, 12, 1, 2, 21, 22] // CharacterEvent, LightConeEvent, Stellar, Departure, CollabChar, CollabLightCone
    } else {
        vec![301, 302, 200, 100, 500] // CharacterEventWish, WeaponEventWish, PermanentWish, NoviceWish, ChronicledWish
    }
}

// Exactly mirror Starward's GetGachaLogItemsByQueryType
fn filter_items_by_query_type(
    game_biz: &str,
    items: &[StarwardGachaItem],
    query_type: i32,
) -> Vec<StarwardGachaItem> {
    if game_biz.contains("hk4e") || game_biz.contains("genshin") {
        if query_type == 301 {
            return items
                .iter()
                .filter(|x| x.gacha_type == 301 || x.gacha_type == 400)
                .cloned()
                .collect();
        }
    }
    items
        .iter()
        .filter(|x| x.gacha_type == query_type)
        .cloned()
        .collect()
}

pub fn get_gacha_overview(
    game_biz: &str,
    target_uid: Option<i64>,
) -> Result<GachaOverview, String> {
    let conn = init_db()?;
    let table = get_table_name(game_biz);
    let db_path = get_db_path().to_string_lossy().to_string();

    let mut uid_stmt = conn
        .prepare(&format!("SELECT DISTINCT Uid FROM {} ORDER BY Uid ASC", table))
        .map_err(|e| e.to_string())?;

    let raw_uids: Vec<i64> = uid_stmt
        .query_map([], |r| r.get(0))
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    // Check if GameRecordRole or GameAccount has nicknames for these Uids
    let mut uids: Vec<UidOption> = Vec::new();
    for u in &raw_uids {
        let nick: Option<String> = conn
            .query_row(
                "SELECT Nickname FROM GameRecordRole WHERE Uid = ?1 LIMIT 1",
                params![u],
                |r| r.get(0),
            )
            .ok()
            .or_else(|| {
                conn.query_row(
                    "SELECT Name FROM GameAccount WHERE Uid = ?1 LIMIT 1",
                    params![u],
                    |r| r.get(0),
                )
                .ok()
            });

        uids.push(UidOption {
            uid: *u,
            nickname: nick,
        });
    }

    // Sort: prioritise 'Void_0' or accounts with nickname, then by most gacha records
    uids.sort_by(|a, b| {
        let is_void_a = a.nickname.as_deref().map(|n| n.to_lowercase().contains("void_0")).unwrap_or(false);
        let is_void_b = b.nickname.as_deref().map(|n| n.to_lowercase().contains("void_0")).unwrap_or(false);
        if is_void_a && !is_void_b {
            std::cmp::Ordering::Less
        } else if !is_void_a && is_void_b {
            std::cmp::Ordering::Greater
        } else {
            b.nickname.is_some().cmp(&a.nickname.is_some())
        }
    });

    let active_uid = target_uid.or_else(|| uids.first().map(|u| u.uid));

    if active_uid.is_none() {
        return Ok(GachaOverview {
            db_path,
            total_pulls: 0,
            uids,
            selected_uid: None,
            banners: vec![],
            recent_records: vec![],
        });
    }

    let uid = active_uid.unwrap();

    // Query all records for this UID ordered by Id ASC, joining icon table if available (exactly like Starward)
    let is_starrail = table == "StarRailGachaItem";
    let is_zzz = game_biz.contains("nap") || game_biz.contains("zzz");
    let _is_genshin = !is_starrail && !is_zzz;

    let query_sql = if is_starrail {
        format!(
            "SELECT item.Uid, item.Id, item.Name, item.Time, item.ItemId, item.ItemType, item.RankType, item.GachaType, item.GachaId, item.Count, item.Lang, info.IconUrl 
            FROM StarRailGachaItem item 
            LEFT JOIN StarRailGachaInfo info ON (item.ItemId = info.ItemId OR item.Name = info.ItemName)
            WHERE item.Uid = ?1 ORDER BY item.Id ASC"
        )
    } else if is_zzz {
        format!(
            "SELECT item.Uid, item.Id, item.Name, item.Time, item.ItemId, item.ItemType, item.RankType, item.GachaType, 0, item.Count, item.Lang, info.Icon 
            FROM ZZZGachaItem item 
            LEFT JOIN ZZZGachaInfo info ON (item.ItemId = info.Id OR item.Name = info.Name)
            WHERE item.Uid = ?1 ORDER BY item.Id ASC"
        )
    } else {
        format!(
            "SELECT item.Uid, item.Id, item.Name, item.Time, item.ItemId, item.ItemType, item.RankType, item.GachaType, 0, item.Count, item.Lang, info.Icon 
            FROM GenshinGachaItem item 
            LEFT JOIN GenshinGachaInfo info ON (item.ItemId = info.Id OR item.Name = info.Name)
            WHERE item.Uid = ?1 ORDER BY item.Id ASC"
        )
    };

    let mut stmt = conn.prepare(&query_sql).map_err(|e| e.to_string())?;
    let all_items: Vec<StarwardGachaItem> = stmt
        .query_map(params![uid], |r| {
            Ok(StarwardGachaItem {
                uid: r.get(0)?,
                id: r.get(1)?,
                name: r.get(2)?,
                time: r.get(3)?,
                item_id: r.get(4)?,
                item_type: r.get(5)?,
                rank_type: r.get(6)?,
                gacha_type: r.get(7)?,
                gacha_id: if is_starrail { Some(r.get(8)?) } else { None },
                count: r.get(9)?,
                lang: r.get(10)?,
                pity: 0,
                icon: r.get(11)?,
            })
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    let is_zzz = game_biz.contains("nap") || game_biz.contains("zzz");
    let target_5_star_rank = if is_zzz { 4 } else { 5 };
    let target_4_star_rank = if is_zzz { 3 } else { 4 };
    let target_3_star_rank = if is_zzz { 2 } else { 3 };

    let query_types = get_starward_query_types(game_biz);
    let mut banners = Vec::new();

    // Starward GachaLogService.GetGachaTypeStats exact algorithm:
    // Process each query_type independently, calculate index, pity, ratios, and average
    let mut updated_items_map: HashMap<i64, StarwardGachaItem> = HashMap::new();

    for query_type in query_types {
        let mut list = filter_items_by_query_type(game_biz, &all_items, query_type);
        if list.is_empty() {
            continue;
        }

        let count = list.len() as i32;
        let mut pity = 0;
        let mut five_stars = Vec::new();
        let mut count_5 = 0;
        let mut count_4 = 0;
        let mut count_3 = 0;

        for item in &mut list {
            pity += 1;
            item.pity = pity;

            if item.rank_type == target_5_star_rank {
                count_5 += 1;
                five_stars.push(FiveStarItem {
                    name: item.name.clone(),
                    item_type: item.item_type.clone(),
                    time: item.time.clone(),
                    pity,
                    gacha_type: item.gacha_type,
                    icon: item.icon.clone(),
                });
                pity = 0;
            } else if item.rank_type == target_4_star_rank {
                count_4 += 1;
            } else if item.rank_type == target_3_star_rank {
                count_3 += 1;
            }

            updated_items_map.insert(item.id, item.clone());
        }

        // Current pity for 5-star (Pity_5 in Starward)
        let pity_5 = if let Some(last) = list.last() {
            if last.rank_type == target_5_star_rank {
                0
            } else {
                last.pity
            }
        } else {
            0
        };

        let ratio_5 = if count > 0 { count_5 as f64 / count as f64 } else { 0.0 };
        let ratio_4 = if count > 0 { count_4 as f64 / count as f64 } else { 0.0 };
        let average_5 = if count_5 > 0 {
            (count - pity_5) as f64 / count_5 as f64
        } else {
            0.0
        };

        five_stars.reverse(); // newest first for display

        banners.push(BannerStats {
            gacha_type: query_type,
            gacha_name: get_banner_name(game_biz, query_type),
            total_pulls: count,
            current_pity: pity_5,
            five_star_count: count_5,
            four_star_count: count_4,
            three_star_count: count_3,
            ratio_5,
            ratio_4,
            average_5,
            five_stars,
        });
    }

    // Merge calculated pity back to recent records (ordered by Id DESC)
    let mut recent: Vec<StarwardGachaItem> = all_items
        .into_iter()
        .map(|item| updated_items_map.remove(&item.id).unwrap_or(item))
        .collect();

    recent.reverse();
    let total_pulls = recent.len() as i32;
    recent.truncate(100);

    Ok(GachaOverview {
        db_path,
        total_pulls,
        uids,
        selected_uid: Some(uid),
        banners,
        recent_records: recent,
    })
}

fn get_banner_name(game_biz: &str, gacha_type: i32) -> String {
    if game_biz.contains("nap") || game_biz.contains("zzz") {
        match gacha_type {
            1 => "Kênh Tiêu Chuẩn (Standard Channel)".to_string(),
            2 => "Kênh Độc Quyền (Exclusive Channel)".to_string(),
            3 => "Kênh Âm Điệu (W-Engine Channel)".to_string(),
            5 => "Kênh Bangboo (Bangboo Channel)".to_string(),
            _ => format!("Kênh ({})", gacha_type),
        }
    } else if game_biz.contains("hkrpg") || game_biz.contains("starrail") {
        match gacha_type {
            1 => "Bước Nhảy Tiêu Chuẩn (Stellar Warp)".to_string(),
            2 => "Bước Nhảy Khởi Hành (Departure Warp)".to_string(),
            11 => "Nhân Vật Sự Kiện (Character Event)".to_string(),
            12 => "Nón Ánh Sáng (Light Cone Event)".to_string(),
            21 => "Bước Nhảy Hợp Tác (Collaboration Warp)".to_string(),
            _ => format!("Bước Nhảy ({})", gacha_type),
        }
    } else {
        match gacha_type {
            100 => "Cầu Nguyện Tân Thủ (Novice Wish)".to_string(),
            200 => "Cầu Nguyện Tiêu Chuẩn (Permanent Wish)".to_string(),
            301 | 400 => "Cầu Nguyện Nhân Vật (Character Wish)".to_string(),
            302 => "Cầu Nguyện Vũ Khí (Weapon Wish)".to_string(),
            500 => "Cầu Nguyện Sử Sách (Chronicled Wish)".to_string(),
            _ => format!("Cầu Nguyện ({})", gacha_type),
        }
    }
}
