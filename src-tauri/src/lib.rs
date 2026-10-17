pub mod db;
pub mod discord;
pub mod gacha;
pub mod game_settings;

use std::path::PathBuf;
use std::process::Command;

pub fn resolve_game_exe(target_path: &str, game_biz: &str) -> Result<PathBuf, String> {
    let path = PathBuf::from(target_path);
    if path.is_file() {
        if path.exists() {
            return Ok(path);
        }
        return Err(format!("File không tồn tại: {}", target_path));
    }

    if !path.is_dir() {
        return Err(format!("Đường dẫn không hợp lệ hoặc không tồn tại: {}", target_path));
    }

    // 1. Check config.ini if it specifies game_name
    let config_ini = path.join("config.ini");
    if config_ini.exists() {
        if let Ok(content) = std::fs::read_to_string(&config_ini) {
            for line in content.lines() {
                let trimmed = line.trim();
                if let Some(val) = trimmed.strip_prefix("game_name=") {
                    let exe_name = val.trim();
                    let cand = path.join(exe_name);
                    if cand.exists() {
                        return Ok(cand);
                    }
                }
            }
        }
    }

    // 2. Known exe names by game
    let lower_biz = game_biz.to_lowercase();
    let candidates: Vec<&str> = if lower_biz.contains("endfield") || lower_biz.contains("beyond") {
        vec!["Endfield.exe"]
    } else if lower_biz.contains("hkrpg") || lower_biz.contains("star rail") || lower_biz.contains("starrail") {
        vec!["StarRail.exe"]
    } else if lower_biz.contains("hk4e") || lower_biz.contains("genshin") || lower_biz.contains("yuanshen") {
        vec!["GenshinImpact.exe", "YuanShen.exe"]
    } else if lower_biz.contains("nap") || lower_biz.contains("zzz") || lower_biz.contains("zenless") {
        vec!["ZenlessZoneZero.exe"]
    } else if lower_biz.contains("bh3") || lower_biz.contains("honkai") {
        vec!["BH3.exe"]
    } else {
        vec!["Endfield.exe", "StarRail.exe", "GenshinImpact.exe", "ZenlessZoneZero.exe", "BH3.exe"]
    };

    for cand_name in candidates {
        let cand = path.join(cand_name);
        if cand.exists() {
            return Ok(cand);
        }
    }

    // 3. Fallback: inspect directory for any game .exe
    if let Ok(entries) = std::fs::read_dir(&path) {
        for entry in entries.flatten() {
            let p = entry.path();
            if p.is_file() && p.extension().map_or(false, |ext| ext.eq_ignore_ascii_case("exe")) {
                let file_name = p.file_name().unwrap_or_default().to_string_lossy().to_lowercase();
                if !file_name.contains("unitycrash")
                    && !file_name.contains("unins")
                    && !file_name.contains("patch")
                    && !file_name.contains("update")
                    && !file_name.contains("cef")
                    && !file_name.contains("vcredist")
                {
                    return Ok(p);
                }
            }
        }
    }

    Err(format!("Không tìm thấy file chạy game (.exe) trong thư mục: {}", target_path))
}

#[tauri::command]
fn get_local_game_version(game_path: String, game_biz: String) -> Result<Option<String>, String> {
    let path = PathBuf::from(&game_path);
    let dir = if path.is_file() {
        path.parent().unwrap_or(&path).to_path_buf()
    } else {
        path
    };

    // 1. Check config.ini in folder
    let config_ini = dir.join("config.ini");
    if config_ini.exists() {
        if let Ok(content) = std::fs::read_to_string(&config_ini) {
            for line in content.lines() {
                let trimmed = line.trim();
                if let Some(val) = trimmed.strip_prefix("game_version=") {
                    let v = val.trim();
                    if !v.is_empty() {
                        return Ok(Some(v.to_string()));
                    }
                }
            }
        }
    }

    // 2. If Endfield, read from Gryphline games.log in AppData\LocalLow
    let lower_biz = game_biz.to_lowercase();
    if lower_biz.contains("endfield") || lower_biz.contains("beyond") {
        if let Some(userprofile) = std::env::var_os("USERPROFILE") {
            let log_dir = PathBuf::from(userprofile).join(r"AppData\LocalLow\Gryphline");
            if log_dir.exists() {
                if let Ok(entries) = std::fs::read_dir(&log_dir) {
                    for entry in entries.flatten() {
                        let candidate_log = entry.path().join(r"logs\games.log");
                        if candidate_log.exists() {
                            if let Ok(content) = std::fs::read_to_string(&candidate_log) {
                                for line in content.lines().rev() {
                                    if let Some(pos) = line.find("strGameVer:") {
                                        let rest = &line[pos + "strGameVer:".len()..];
                                        let ver: String = rest
                                            .chars()
                                            .take_while(|c| c.is_ascii_digit() || *c == '.')
                                            .collect();
                                        if !ver.is_empty() {
                                            return Ok(Some(ver));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // 3. Fallback: Check Unity globalgamemanagers in *_Data folder
    if let Ok(entries) = std::fs::read_dir(&dir) {
        for entry in entries.flatten() {
            let p = entry.path();
            if p.is_dir() && p.file_name().map(|n| n.to_string_lossy().ends_with("_Data")).unwrap_or(false) {
                let ggm = p.join("globalgamemanagers");
                if ggm.exists() {
                    if let Ok(bytes) = std::fs::read(&ggm) {
                        let scan_len = bytes.len().min(32768);
                        let slice = &bytes[..scan_len];
                        for i in 4..slice.len().saturating_sub(5) {
                            let len = u32::from_le_bytes([slice[i-4], slice[i-3], slice[i-2], slice[i-1]]) as usize;
                            if len >= 3 && len <= 16 && i + len <= slice.len() {
                                if let Ok(s) = std::str::from_utf8(&slice[i..i+len]) {
                                    let chars: Vec<char> = s.chars().collect();
                                    if chars.iter().all(|c| c.is_ascii_digit() || *c == '.') && chars.iter().filter(|c| **c == '.').count() >= 2 {
                                        if !s.starts_with("20") {
                                            return Ok(Some(s.to_string()));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    Ok(None)
}

#[tauri::command]
async fn fetch_hoyo_api(url: String) -> Result<String, String> {
    let client = reqwest::Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        .build()
        .map_err(|e| e.to_string())?;

    let res = client
        .get(&url)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let text = res.text().await.map_err(|e| e.to_string())?;
    Ok(text)
}

#[tauri::command]
async fn fetch_http_post(url: String, body: String) -> Result<String, String> {
    let client = reqwest::Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        .build()
        .map_err(|e| e.to_string())?;

    let res = client
        .post(&url)
        .header("Content-Type", "application/json")
        .body(body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let text = res.text().await.map_err(|e| e.to_string())?;
    Ok(text)
}

#[tauri::command]
fn get_official_launcher_path(game_path: String, game_biz: String) -> Result<Option<String>, String> {
    let path = PathBuf::from(&game_path);
    let dir = if path.is_file() {
        path.parent().unwrap_or(&path).to_path_buf()
    } else {
        path
    };

    let mut candidates = vec![
        dir.join("Launcher.exe"),
        dir.join("launcher.exe"),
    ];

    if let Some(p1) = dir.parent() {
        candidates.push(p1.join("Launcher.exe"));
        candidates.push(p1.join("launcher.exe"));
        if let Some(p2) = p1.parent() {
            candidates.push(p2.join("Launcher.exe"));
            candidates.push(p2.join("launcher.exe"));
        }
    }

    let lower_biz = game_biz.to_lowercase();
    if lower_biz.contains("endfield") || lower_biz.contains("beyond") {
        if let Some(p1) = dir.parent() {
            if let Some(p2) = p1.parent() {
                if let Ok(entries) = std::fs::read_dir(p2) {
                    for entry in entries.flatten() {
                        let sub = entry.path();
                        if sub.is_dir() {
                            let games_exe = sub.join("Games.exe");
                            if games_exe.is_file() {
                                candidates.insert(0, games_exe);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    if lower_biz.contains("hkrpg") || lower_biz.contains("hk4e") || lower_biz.contains("nap") || lower_biz.contains("bh3") {
        candidates.push(PathBuf::from(r"C:\Program Files\HoYoPlay\launcher.exe"));
        if let Some(pf) = std::env::var_os("ProgramFiles") {
            candidates.push(PathBuf::from(pf).join(r"HoYoPlay\launcher.exe"));
        }
    }

    for c in candidates {
        if c.is_file() {
            return Ok(Some(c.to_string_lossy().to_string()));
        }
    }

    Ok(None)
}

#[tauri::command]
fn open_official_launcher(game_path: String, game_biz: String) -> Result<bool, String> {
    if let Some(launcher_path) = get_official_launcher_path(game_path, game_biz.clone())? {
        let p = PathBuf::from(&launcher_path);
        let working_dir = p.parent().unwrap_or(&p).to_string_lossy().to_string();

        let mut args: Vec<String> = Vec::new();
        let lower = game_biz.to_lowercase();
        if lower.contains("endfield") || lower.contains("beyond") {
            args.push("--game=cd2d0f009b9c3997c1e4d319ed1a0eae".to_string());
            args.push("--reason=0".to_string());
        }

        match std::process::Command::new(&p).current_dir(&working_dir).args(&args).spawn() {
            Ok(_) => Ok(true),
            Err(e) if e.raw_os_error() == Some(740) => {
                game_settings::launch_elevated(&launcher_path, &args, &working_dir)?;
                Ok(true)
            }
            Err(_) => {
                game_settings::launch_elevated(&launcher_path, &args, &working_dir)?;
                Ok(true)
            }
        }
    } else {
        Ok(false)
    }
}

#[tauri::command]
fn launch_game(exe_path: String, game_biz: Option<String>) -> Result<(), String> {
    let biz = game_biz.unwrap_or_default();
    let lower = biz.to_lowercase();
    let resolved = resolve_game_exe(&exe_path, &biz)?;
    let resolved_str = resolved.to_string_lossy().to_lowercase();

    // 1. Setup GPU preference and Vulkan layer disable fix
    game_settings::setup_game_environment(&resolved.to_string_lossy());

    // 2. Arknights: Endfield requires official Gryphline publisher signature
    // to pass OneChannelLC / U8SDK launch auth verification (code 10100).
    if lower.contains("endfield") || resolved_str.contains("endfield") {
        if let Ok(true) = open_official_launcher(exe_path.clone(), biz.clone()) {
            return Ok(());
        }
    }

    let mut args = Vec::new();
    if lower.contains("endfield") || resolved_str.contains("endfield") {
        args.push("-launcher_lang=en-us".to_string());
        args.push("-launcher_sub_channel=6".to_string());
    }
    game_settings::launch_game_with_config(&resolved.to_string_lossy(), &args)
}

#[tauri::command]
fn open_folder(dir_path: String) -> Result<(), String> {
    let p = PathBuf::from(&dir_path);
    let target = if p.is_file() {
        p.parent().unwrap_or(&p).to_path_buf()
    } else {
        p
    };

    Command::new("explorer")
        .arg(&target)
        .spawn()
        .map_err(|e| format!("Không thể mở thư mục: {}", e))?;
    Ok(())
}

#[tauri::command]
fn is_game_running(game_path: String, game_biz: String) -> Result<bool, String> {
    let resolved = resolve_game_exe(&game_path, &game_biz);
    let target_name = match resolved {
        Ok(p) => p.file_name().unwrap_or_default().to_string_lossy().to_lowercase(),
        Err(_) => {
            let lower = game_biz.to_lowercase();
            if lower.contains("endfield") || lower.contains("beyond") {
                "endfield.exe".to_string()
            } else if lower.contains("hkrpg") || lower.contains("star rail") {
                "starrail.exe".to_string()
            } else if lower.contains("hk4e") || lower.contains("genshin") {
                "genshinimpact.exe".to_string()
            } else if lower.contains("nap") || lower.contains("zzz") {
                "zenlesszonezero.exe".to_string()
            } else if lower.contains("bh3") {
                "bh3.exe".to_string()
            } else {
                return Ok(false);
            }
        }
    };

    use windows::Win32::Foundation::CloseHandle;
    use windows::Win32::System::ProcessStatus::K32EnumProcesses;
    use windows::Win32::System::Threading::{
        OpenProcess, PROCESS_QUERY_INFORMATION, PROCESS_QUERY_LIMITED_INFORMATION,
    };
    use windows::Win32::UI::WindowsAndMessaging::{
        EnumWindows, GetWindowTextLengthW, GetWindowTextW, IsWindowVisible,
    };

    // 1. Check by active Window Title (works for elevated game processes!)
    let title_keywords: Vec<&str> = if target_name.contains("starrail") {
        vec!["honkai: star rail", "star rail", "崩坏：星穹铁道", "崩壊：スターレイル"]
    } else if target_name.contains("endfield") {
        vec!["arknights: endfield", "endfield", "终末地"]
    } else if target_name.contains("genshin") || target_name.contains("yuanshen") {
        vec!["genshin impact", "原神"]
    } else if target_name.contains("zenless") || target_name.contains("zzz") {
        vec!["zenless zone zero", "绝区零"]
    } else if target_name.contains("bh3") {
        vec!["honkai impact 3", "崩坏3"]
    } else {
        vec![]
    };

    if !title_keywords.is_empty() {
        struct WindowSearch {
            keywords: Vec<&'static str>,
            found: bool,
        }

        unsafe extern "system" fn enum_windows_proc(
            hwnd: windows::Win32::Foundation::HWND,
            lparam: windows::Win32::Foundation::LPARAM,
        ) -> windows::core::BOOL {
            unsafe {
                let data = &mut *(lparam.0 as *mut WindowSearch);
                if IsWindowVisible(hwnd).as_bool() {
                    let len = GetWindowTextLengthW(hwnd);
                    if len > 0 {
                        let mut buf = vec![0u16; (len + 1) as usize];
                        let read_len = GetWindowTextW(hwnd, &mut buf);
                        if read_len > 0 {
                            let title = String::from_utf16_lossy(&buf[..read_len as usize]).to_lowercase();
                            for kw in &data.keywords {
                                if title.contains(kw) {
                                    data.found = true;
                                    return windows::core::BOOL::from(false); // Stop enum
                                }
                            }
                        }
                    }
                }
                windows::core::BOOL::from(true)
            }
        }

        let mut search = WindowSearch {
            keywords: title_keywords,
            found: false,
        };

        unsafe {
            let _ = EnumWindows(
                Some(enum_windows_proc),
                windows::Win32::Foundation::LPARAM(&mut search as *mut _ as isize),
            );
        }

        if search.found {
            return Ok(true);
        }
    }

    // 2. Fallback: Check Process Image Name with QueryFullProcessImageNameW
    use windows::Win32::System::Threading::QueryFullProcessImageNameW;

    let mut pids = [0u32; 2048];
    let mut bytes_returned = 0u32;

    unsafe {
        if !K32EnumProcesses(
            pids.as_mut_ptr(),
            (pids.len() * std::mem::size_of::<u32>()) as u32,
            &mut bytes_returned,
        )
        .as_bool()
        {
            return Ok(false);
        }

        let count = (bytes_returned as usize) / std::mem::size_of::<u32>();
        for &pid in &pids[..count] {
            if pid == 0 {
                continue;
            }

            // Try PROCESS_QUERY_LIMITED_INFORMATION first which works across integrity levels
            let handle_res = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, false, pid)
                .or_else(|_| OpenProcess(PROCESS_QUERY_INFORMATION, false, pid));

            if let Ok(handle) = handle_res {
                let mut path_buf = [0u16; 512];
                let mut size = path_buf.len() as u32;

                if QueryFullProcessImageNameW(
                    handle,
                    windows::Win32::System::Threading::PROCESS_NAME_FORMAT(0),
                    windows::core::PWSTR(path_buf.as_mut_ptr()),
                    &mut size,
                )
                .is_ok()
                {
                    let full_path = String::from_utf16_lossy(&path_buf[..size as usize]).to_lowercase();
                    if full_path.ends_with(&target_name) {
                        let _ = CloseHandle(handle);
                        return Ok(true);
                    }
                }
                let _ = CloseHandle(handle);
            }
        }
    }

    Ok(false)
}

#[tauri::command]
async fn pick_game_folder() -> Result<Option<String>, String> {
    let folder = rfd::AsyncFileDialog::new()
        .set_title("Chọn thư mục cài đặt game")
        .pick_folder()
        .await;

    Ok(folder.map(|f| f.path().to_string_lossy().to_string()))
}

#[tauri::command]
async fn pick_game_file() -> Result<Option<String>, String> {
    let file = rfd::AsyncFileDialog::new()
        .add_filter("Game Executable (*.exe)", &["exe"])
        .set_title("Chọn tệp thực thi game (.exe)")
        .pick_file()
        .await;

    Ok(file.map(|f| f.path().to_string_lossy().to_string()))
}

// Checkin
struct CheckinEndpoint {
    act_id: &'static str,
    info_url: &'static str,
    sign_url: &'static str,
}

fn get_checkin_endpoint(biz: &str) -> Option<CheckinEndpoint> {
    if biz.contains("nap") {
        Some(CheckinEndpoint {
            act_id: "e202406031448091",
            info_url: "https://sg-act-nap-api.hoyolab.com/event/luna/zzz/os/info",
            sign_url: "https://sg-act-nap-api.hoyolab.com/event/luna/zzz/os/sign",
        })
    } else if biz.contains("hkrpg") {
        Some(CheckinEndpoint {
            act_id: "e202303301540311",
            info_url: "https://sg-public-api.hoyolab.com/event/luna/os/info",
            sign_url: "https://sg-public-api.hoyolab.com/event/luna/os/sign",
        })
    } else if biz.contains("hk4e") {
        Some(CheckinEndpoint {
            act_id: "e202102251931481",
            info_url: "https://sg-hk4e-api.hoyolab.com/event/sol/info",
            sign_url: "https://sg-hk4e-api.hoyolab.com/event/sol/sign",
        })
    } else if biz.contains("bh3") {
        Some(CheckinEndpoint {
            act_id: "e202110291205111",
            info_url: "https://sg-public-api.hoyolab.com/event/mani/info",
            sign_url: "https://sg-public-api.hoyolab.com/event/mani/sign",
        })
    } else {
        None
    }
}

#[tauri::command]
async fn checkin_get_info(biz: String, cookie: String, lang: String) -> Result<String, String> {
    let ep = get_checkin_endpoint(&biz).ok_or_else(|| "Tựa game không hỗ trợ điểm danh".to_string())?;
    let client = reqwest::Client::builder().build().map_err(|e| e.to_string())?;

    let url = format!("{}?act_id={}&lang={}", ep.info_url, ep.act_id, lang);
    let res = client
        .get(&url)
        .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36")
        .header("Referer", "https://act.hoyolab.com/")
        .header("Origin", "https://act.hoyolab.com")
        .header("Cookie", cookie)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    res.text().await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn checkin_execute(biz: String, cookie: String, lang: String) -> Result<String, String> {
    let ep = get_checkin_endpoint(&biz).ok_or_else(|| "Tựa game không hỗ trợ điểm danh".to_string())?;
    let client = reqwest::Client::builder().build().map_err(|e| e.to_string())?;

    let body = serde_json::json!({
        "act_id": ep.act_id,
        "lang": lang
    });

    let res = client
        .post(ep.sign_url)
        .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36")
        .header("Referer", "https://act.hoyolab.com/")
        .header("Origin", "https://act.hoyolab.com")
        .header("Cookie", cookie)
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    res.text().await.map_err(|e| e.to_string())
}

// Gacha Commands
#[tauri::command]
fn gacha_detect_cache_url(game_biz: String, game_exe: String) -> Result<String, String> {
    gacha::find_gacha_url_in_cache(&game_biz, &game_exe)
        .ok_or_else(|| "Không tìm thấy URL trong bộ nhớ cache. Hãy mở mục 'Lịch Sử / Chi Tiết Roll' trong game trước rồi thử lại!".to_string())
}

#[tauri::command]
async fn gacha_import_records(gacha_url: String, game_biz: String) -> Result<usize, String> {
    gacha::import_gacha_records(&gacha_url, &game_biz).await
}

#[tauri::command]
fn gacha_get_overview(game_biz: String, uid: Option<i64>) -> Result<db::GachaOverview, String> {
    db::get_gacha_overview(&game_biz, uid)
}

#[tauri::command]
fn gacha_get_cached_url(game_biz: String, uid: Option<i64>) -> Result<Option<String>, String> {
    Ok(db::get_gacha_url(&game_biz, uid))
}

#[tauri::command]
fn gacha_get_db_path() -> Result<String, String> {
    Ok(db::get_db_path().to_string_lossy().to_string())
}

// Discord RPC
#[tauri::command]
fn discord_update_presence(
    custom_client_id: Option<String>,
    game_name: String,
    details: String,
    state: String,
    large_image: Option<String>,
    large_text: Option<String>,
    small_image: Option<String>,
    small_text: Option<String>,
) -> Result<(), String> {
    discord::update_presence(
        custom_client_id,
        &game_name,
        &details,
        &state,
        large_image,
        large_text,
        small_image,
        small_text,
    )
}

// Game Settings & Launch commands
#[tauri::command]
fn get_system_resolutions() -> Vec<game_settings::ScreenResolution> {
    game_settings::get_screen_resolutions()
}

#[tauri::command]
fn get_game_graphics_settings(game_biz: String) -> Result<game_settings::GameGraphicsConfig, String> {
    game_settings::read_game_graphics(&game_biz)
}

#[tauri::command]
fn save_game_graphics_settings(game_biz: String, config: game_settings::GameGraphicsConfig) -> Result<(), String> {
    game_settings::save_game_graphics(&game_biz, &config)
}

#[tauri::command]
fn launch_game_advanced(
    exe_path: String,
    config: game_settings::GameGraphicsConfig,
    force_dx12: bool,
    game_biz: Option<String>,
) -> Result<(), String> {
    let biz = game_biz.unwrap_or_default();
    let lower = biz.to_lowercase();
    let resolved = resolve_game_exe(&exe_path, &biz)?;
    let resolved_str = resolved.to_string_lossy().to_lowercase();

    // 1. Setup GPU preference and Vulkan layer disable fix
    game_settings::setup_game_environment(&resolved.to_string_lossy());

    // 2. Arknights: Endfield requires official Gryphline publisher signature
    // to pass OneChannelLC / U8SDK launch auth verification (code 10100).
    if lower.contains("endfield") || resolved_str.contains("endfield") {
        if let Ok(true) = open_official_launcher(exe_path.clone(), biz.clone()) {
            return Ok(());
        }
    }

    let mut args = game_settings::build_launch_arguments(&config, force_dx12);
    if lower.contains("endfield") || resolved_str.contains("endfield") {
        if !args.iter().any(|a| a.contains("launcher_lang")) {
            args.push("-launcher_lang=en-us".to_string());
        }
        if !args.iter().any(|a| a.contains("launcher_sub_channel")) {
            args.push("-launcher_sub_channel=6".to_string());
        }
    }
    game_settings::launch_game_with_config(&resolved.to_string_lossy(), &args)
}

// Window commands
#[tauri::command]
fn window_minimize(app: tauri::AppHandle) -> Result<(), String> {
    use tauri::Manager;
    if let Some(window) = app.get_webview_window("main") {
        window.minimize().map_err(|e| e.to_string())
    } else {
        Err("Không tìm thấy cửa sổ chính".to_string())
    }
}

#[tauri::command]
fn toggle_overlay(app: tauri::AppHandle, target_url: Option<String>) -> Result<bool, String> {
    use tauri::{Manager, Emitter};
    if let Some(window) = app.get_webview_window("overlay") {
        let is_visible = window.is_visible().unwrap_or(false);
        if is_visible {
            window.hide().map_err(|e| e.to_string())?;
            let _ = app.emit("overlay_visibility_changed", false);
            Ok(false)
        } else {
            if let Some(url) = target_url {
                let _ = app.emit("set_overlay_map", url);
            }
            window.show().map_err(|e| e.to_string())?;
            window.set_focus().map_err(|e| e.to_string())?;
            let _ = app.emit("overlay_visibility_changed", true);
            Ok(true)
        }
    } else {
        Err("Không tìm thấy cửa sổ overlay".to_string())
    }
}

#[tauri::command]
fn is_overlay_visible(app: tauri::AppHandle) -> Result<bool, String> {
    use tauri::Manager;
    if let Some(window) = app.get_webview_window("overlay") {
        Ok(window.is_visible().unwrap_or(false))
    } else {
        Ok(false)
    }
}

#[tauri::command]
fn set_overlay_mode(app: tauri::AppHandle, mode: String, size: Option<f64>) -> Result<(), String> {
    use tauri::Manager;
    if let Some(window) = app.get_webview_window("overlay") {
        if mode == "mini" {
            let dim = size.unwrap_or(340.0);
            let _ = window.set_size(tauri::LogicalSize::new(dim, dim));
            if let Ok(curr_size) = window.inner_size() {
                if curr_size.width > 500 {
                    let _ = window.set_position(tauri::LogicalPosition::new(24.0, 24.0));
                }
            }
        } else {
            let _ = window.set_size(tauri::LogicalSize::new(1120.0, 740.0));
            let _ = window.center();
        }
    }
    Ok(())
}

#[tauri::command]
fn set_overlay_click_through(app: tauri::AppHandle, click_through: bool) -> Result<(), String> {
    use tauri::Manager;
    if let Some(window) = app.get_webview_window("overlay") {
        window.set_ignore_cursor_events(click_through).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn window_start_dragging(app: tauri::AppHandle) -> Result<(), String> {
    use tauri::Manager;
    if let Some(window) = app.get_webview_window("main") {
        window.start_dragging().map_err(|e| e.to_string())
    } else {
        Err("Không tìm thấy cửa sổ chính".to_string())
    }
}

#[tauri::command]
fn window_toggle_maximize(app: tauri::AppHandle) -> Result<(), String> {
    use tauri::Manager;
    if let Some(window) = app.get_webview_window("main") {
        if window.is_maximized().unwrap_or(false) {
            window.unmaximize().map_err(|e| e.to_string())
        } else {
            window.maximize().map_err(|e| e.to_string())
        }
    } else {
        Err("Không tìm thấy cửa sổ chính".to_string())
    }
}

#[tauri::command]
fn window_close(app: tauri::AppHandle) -> Result<(), String> {
    use tauri::Manager;
    if let Some(window) = app.get_webview_window("main") {
        window.close().map_err(|e| e.to_string())
    } else {
        Err("Không tìm thấy cửa sổ chính".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let _ = db::init_db();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            #[cfg(desktop)]
            {
                use tauri::Manager;
                if let Some(window) = app.get_webview_window("main") {
                    match tauri::image::Image::from_bytes(include_bytes!("../icons/icon.png")) {
                        Ok(icon) => {
                            if let Err(e) = window.set_icon(icon) {
                                eprintln!("Failed to set window icon: {}", e);
                            } else {
                                println!("Window icon set successfully");
                            }
                        }
                        Err(e) => eprintln!("Failed to decode icon.png: {}", e),
                    }
                }

                // Global hotkey Alt + M for Overlay
                let app_handle = app.handle().clone();
                std::thread::spawn(move || {
                    use windows::Win32::UI::Input::KeyboardAndMouse::{
                        RegisterHotKey, HOT_KEY_MODIFIERS, MOD_ALT, MOD_NOREPEAT,
                    };
                    use windows::Win32::UI::WindowsAndMessaging::{GetMessageW, MSG, WM_HOTKEY};
                    use windows::Win32::Foundation::HWND;

                    unsafe {
                        let _ = RegisterHotKey(
                            Some(HWND(std::ptr::null_mut())),
                            1001,
                            HOT_KEY_MODIFIERS(MOD_ALT.0 | MOD_NOREPEAT.0),
                            0x4D, // 'M'
                        );

                        // Register Alt + S (0x53 = 'S') for Overlay Settings / Mini Switch
                        let _ = RegisterHotKey(
                            Some(HWND(std::ptr::null_mut())),
                            1002,
                            HOT_KEY_MODIFIERS(MOD_ALT.0 | MOD_NOREPEAT.0),
                            0x53, // 'S'
                        );

                        let mut msg = MSG::default();
                        while GetMessageW(&mut msg, None, 0, 0).as_bool() {
                            if msg.message == WM_HOTKEY {
                                if msg.wParam.0 == 1001 {
                                    let _ = toggle_overlay(app_handle.clone(), None);
                                } else if msg.wParam.0 == 1002 {
                                    use tauri::{Manager, Emitter};
                                    if let Some(w) = app_handle.get_webview_window("overlay") {
                                        let _ = w.show();
                                        let _ = w.set_focus();
                                    }
                                    let _ = app_handle.emit("toggle_overlay_settings", ());
                                }
                            }
                        }
                    }
                });
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            fetch_hoyo_api,
            fetch_http_post,
            get_official_launcher_path,
            open_official_launcher,
            launch_game,
            toggle_overlay,
            is_overlay_visible,
            set_overlay_mode,
            set_overlay_click_through,
            open_folder,
            pick_game_file,
            pick_game_folder,
            get_local_game_version,
            is_game_running,
            checkin_get_info,
            checkin_execute,
            gacha_detect_cache_url,
            gacha_import_records,
            gacha_get_overview,
            gacha_get_cached_url,
            gacha_get_db_path,
            discord_update_presence,
            get_game_graphics_settings,
            save_game_graphics_settings,
            get_system_resolutions,
            launch_game_advanced,
            window_start_dragging,
            window_minimize,
            window_toggle_maximize,
            window_close
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
