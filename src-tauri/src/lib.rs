pub mod db;
pub mod gacha;

use std::path::Path;
use std::process::Command;
use tauri::Window;

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
fn launch_game(exe_path: String) -> Result<(), String> {
    let path = Path::new(&exe_path);
    if !path.exists() {
        return Err(format!("File không tồn tại: {}", exe_path));
    }

    let parent_dir = path.parent().unwrap_or(Path::new("."));

    Command::new(&exe_path)
        .current_dir(parent_dir)
        .spawn()
        .map_err(|e| format!("Không thể khởi động game: {}", e))?;

    Ok(())
}

#[tauri::command]
fn open_folder(dir_path: String) -> Result<(), String> {
    Command::new("explorer")
        .arg(&dir_path)
        .spawn()
        .map_err(|e| format!("Không thể mở thư mục: {}", e))?;
    Ok(())
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

// Window commands
#[tauri::command]
fn window_minimize(window: Window) -> Result<(), String> {
    window.minimize().map_err(|e| e.to_string())
}

#[tauri::command]
fn window_start_dragging(window: Window) -> Result<(), String> {
    window.start_dragging().map_err(|e| e.to_string())
}

#[tauri::command]
fn window_toggle_maximize(window: Window) -> Result<(), String> {
    if window.is_maximized().unwrap_or(false) {
        window.unmaximize().map_err(|e| e.to_string())
    } else {
        window.maximize().map_err(|e| e.to_string())
    }
}

#[tauri::command]
fn window_close(window: Window) -> Result<(), String> {
    window.close().map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let _ = db::init_db();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            fetch_hoyo_api,
            launch_game,
            open_folder,
            pick_game_file,
            checkin_get_info,
            checkin_execute,
            gacha_detect_cache_url,
            gacha_import_records,
            gacha_get_overview,
            gacha_get_cached_url,
            gacha_get_db_path,
            window_start_dragging,
            window_minimize,
            window_toggle_maximize,
            window_close
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
