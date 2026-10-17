use serde::{Deserialize, Serialize};
use std::process::Command;
use windows::core::PCWSTR;
use windows::Win32::Foundation::ERROR_SUCCESS;
use windows::Win32::System::Registry::{
    RegCloseKey, RegCreateKeyExW, RegEnumValueW, RegOpenKeyExW, RegQueryValueExW, RegSetValueExW,
    HKEY, HKEY_CURRENT_USER, KEY_READ, KEY_WRITE, REG_BINARY, REG_DWORD, REG_SZ, REG_OPEN_CREATE_OPTIONS,
};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct HsrGraphicsSettings {
    #[serde(rename = "FPS", default = "default_fps")]
    pub fps: u32,
    #[serde(rename = "EnableVSync", default)]
    pub enable_vsync: bool,
    #[serde(rename = "RenderScale", default = "default_render_scale")]
    pub render_scale: f32,
    #[serde(rename = "ResolutionQuality", default = "default_quality")]
    pub resolution_quality: u32,
    #[serde(rename = "ShadowQuality", default = "default_quality")]
    pub shadow_quality: u32,
    #[serde(rename = "LightQuality", default = "default_quality")]
    pub light_quality: u32,
    #[serde(rename = "CharacterQuality", default = "default_quality")]
    pub character_quality: u32,
    #[serde(rename = "EnvDetailQuality", default = "default_quality")]
    pub env_detail_quality: u32,
    #[serde(rename = "ReflectionQuality", default = "default_quality")]
    pub reflection_quality: u32,
    #[serde(rename = "SFXQuality", default = "default_quality")]
    pub sfx_quality: u32,
    #[serde(rename = "BloomQuality", default = "default_quality")]
    pub bloom_quality: u32,
    #[serde(rename = "AAMode", default)]
    pub aa_mode: u32, // 0: Off, 1: TAA, 2: FXAA
    #[serde(rename = "DlssQuality", default)]
    pub dlss_quality: u32, // 0: Off, 1: Ultra Perf, 2: Perf, 3: Balanced, 4: Quality, 5: DLAA
}

fn default_fps() -> u32 {
    60
}
fn default_render_scale() -> f32 {
    1.0
}
fn default_quality() -> u32 {
    3
}

use windows::Win32::Graphics::Gdi::{EnumDisplaySettingsW, DEVMODEW, ENUM_DISPLAY_SETTINGS_MODE};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScreenResolution {
    pub width: u32,
    pub height: u32,
}

pub fn get_screen_resolutions() -> Vec<ScreenResolution> {
    let mut results = Vec::new();
    let mut devmode = DEVMODEW::default();
    devmode.dmSize = std::mem::size_of::<DEVMODEW>() as u16;

    let mut i = 0u32;
    unsafe {
        while EnumDisplaySettingsW(None, ENUM_DISPLAY_SETTINGS_MODE(i), &mut devmode).as_bool() {
            let w = devmode.dmPelsWidth;
            let h = devmode.dmPelsHeight;
            if w >= 1024 && h >= 600 {
                if !results.iter().any(|r: &ScreenResolution| r.width == w && r.height == h) {
                    results.push(ScreenResolution { width: w, height: h });
                }
            }
            i += 1;
        }
    }

    results.sort_by(|a, b| b.width.cmp(&a.width).then_with(|| b.height.cmp(&a.height)));
    results
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct GameGraphicsConfig {
    pub width: u32,
    pub height: u32,
    pub fullscreen_mode: u32, // 1: Exclusive/Full, 3: Windowed, 0: Auto
    pub borderless: bool,
    pub custom_args: String,
    pub hsr_graphics: Option<HsrGraphicsSettings>,
}

fn to_wide(s: &str) -> Vec<u16> {
    s.encode_utf16().chain(std::iter::once(0)).collect()
}

fn get_game_registry_key(game_biz_or_name: &str) -> Option<&'static str> {
    let lower = game_biz_or_name.to_lowercase();
    if lower.contains("hkrpg") || lower.contains("star rail") || lower.contains("starrail") {
        if lower.contains("cn") {
            Some(r"Software\miHoYo\崩坏：星穹铁道")
        } else {
            Some(r"Software\Cognosphere\Star Rail")
        }
    } else if lower.contains("hk4e") || lower.contains("genshin") || lower.contains("yuanshen") {
        if lower.contains("cn") {
            Some(r"Software\miHoYo\原神")
        } else {
            Some(r"Software\miHoYo\Genshin Impact")
        }
    } else if lower.contains("nap") || lower.contains("zzz") || lower.contains("zenless") {
        Some(r"Software\miHoYo\ZenlessZoneZero")
    } else if lower.contains("bh3") || lower.contains("honkai impact") || lower.contains("honkai3") {
        Some(r"Software\miHoYo\Honkai Impact 3rd")
    } else if lower.contains("endfield") || lower.contains("beyond") || lower.contains("arknights") {
        Some(r"Software\Gryphline\Endfield")
    } else {
        None
    }
}

const SCREENMANAGER_RES_WIDTH: &str = "Screenmanager Resolution Width_h182942802";
const SCREENMANAGER_RES_HEIGHT: &str = "Screenmanager Resolution Height_h2627697771";
const SCREENMANAGER_FULLSCREEN_MODE: &str = "Screenmanager Fullscreen mode_h3630240806";
const SCREENMANAGER_IS_FULLSCREEN_MODE: &str = "Screenmanager Is Fullscreen mode_h3981298716";
const SCREENMANAGER_RES_USE_NATIVE: &str = "Screenmanager Resolution Use Native_h1405027254";
const GRAPHICS_PC_RESOLUTION: &str = "GraphicsSettings_PCResolution_h431323223";
const GRAPHICS_MODEL: &str = "GraphicsSettings_Model_h2986158309";
const GENERAL_DATA_V2_SCREEN: &str = "GENERAL_DATA_V2_ScreenSettingData_h1916288658";

pub fn read_game_graphics(game_biz: &str) -> Result<GameGraphicsConfig, String> {
    let mut config = GameGraphicsConfig {
        width: 1920,
        height: 1080,
        fullscreen_mode: 1,
        borderless: false,
        custom_args: String::new(),
        hsr_graphics: None,
    };

    let sub_key = match get_game_registry_key(game_biz) {
        Some(k) => k,
        None => return Ok(config),
    };

    let wide_key = to_wide(sub_key);
    let mut hkey: HKEY = HKEY::default();

    unsafe {
        let status = RegOpenKeyExW(
            HKEY_CURRENT_USER,
            PCWSTR(wide_key.as_ptr()),
            Some(0),
            KEY_READ,
            &mut hkey,
        );
        if status != ERROR_SUCCESS {
            return Ok(config); // Key doesn't exist yet, return default
        }

        let lower_biz = game_biz.to_lowercase();
        let is_hsr = lower_biz.contains("hkrpg") || lower_biz.contains("starrail") || lower_biz.contains("star rail");
        let is_bh3 = lower_biz.contains("bh3") || lower_biz.contains("honkai impact") || lower_biz.contains("honkai3");

        // 1. First priority: Check dedicated JSON PCResolution (Starward method)
        let json_key = if is_hsr {
            Some(GRAPHICS_PC_RESOLUTION)
        } else if is_bh3 {
            Some(GENERAL_DATA_V2_SCREEN)
        } else {
            None
        };

        if let Some(jk) = json_key {
            let mut data_len = 0u32;
            if RegQueryValueExW(
                hkey,
                PCWSTR(to_wide(jk).as_ptr()),
                None,
                None,
                None,
                Some(&mut data_len),
            ) == ERROR_SUCCESS && data_len > 0 {
                let mut buf = vec![0u8; data_len as usize];
                if RegQueryValueExW(
                    hkey,
                    PCWSTR(to_wide(jk).as_ptr()),
                    None,
                    None,
                    Some(buf.as_mut_ptr()),
                    Some(&mut data_len),
                ) == ERROR_SUCCESS {
                    while let Some(&0) = buf.last() {
                        buf.pop();
                    }
                    if let Ok(json_str) = String::from_utf8(buf) {
                        #[derive(serde::Deserialize)]
                        struct PcResModel {
                            width: Option<u32>,
                            height: Option<u32>,
                            #[serde(rename = "isFullScreen")]
                            is_full_screen: Option<bool>,
                        }
                        if let Ok(res_model) = serde_json::from_str::<PcResModel>(&json_str) {
                            if let Some(w) = res_model.width {
                                if w > 0 { config.width = w; }
                            }
                            if let Some(h) = res_model.height {
                                if h > 0 { config.height = h; }
                            }
                            if let Some(fs) = res_model.is_full_screen {
                                config.fullscreen_mode = if fs { 1 } else { 3 };
                                config.borderless = !fs;
                            }
                        }
                    }
                }
            }
        }

        // 2. Read standard registry values
        let mut index = 0u32;
        let mut name_buf = [0u16; 256];
        let mut type_code = 0u32;

        loop {
            let mut name_len = name_buf.len() as u32;
            let res = RegEnumValueW(
                hkey,
                index,
                Some(windows::core::PWSTR(name_buf.as_mut_ptr())),
                &mut name_len,
                None,
                Some(&mut type_code),
                None,
                None,
            );

            if res != ERROR_SUCCESS {
                break;
            }

            let val_name = String::from_utf16_lossy(&name_buf[..name_len as usize]);

            // Skip any Default keys (e.g. Screenmanager Resolution Width Default)
            if val_name.contains("Default") {
                index += 1;
                continue;
            }

            if val_name.starts_with("Screenmanager Resolution Width") && config.width == 1920 {
                let mut data = 0u32;
                let mut data_len = 4u32;
                if RegQueryValueExW(
                    hkey,
                    PCWSTR(to_wide(&val_name).as_ptr()),
                    None,
                    None,
                    Some(&mut data as *mut u32 as *mut u8),
                    Some(&mut data_len),
                ) == ERROR_SUCCESS && data > 0
                {
                    config.width = data;
                }
            } else if val_name.starts_with("Screenmanager Resolution Height") && config.height == 1080 {
                let mut data = 0u32;
                let mut data_len = 4u32;
                if RegQueryValueExW(
                    hkey,
                    PCWSTR(to_wide(&val_name).as_ptr()),
                    None,
                    None,
                    Some(&mut data as *mut u32 as *mut u8),
                    Some(&mut data_len),
                ) == ERROR_SUCCESS && data > 0
                {
                    config.height = data;
                }
            } else if val_name.starts_with("Screenmanager Fullscreen mode") {
                let mut data = 0u32;
                let mut data_len = 4u32;
                if RegQueryValueExW(
                    hkey,
                    PCWSTR(to_wide(&val_name).as_ptr()),
                    None,
                    None,
                    Some(&mut data as *mut u32 as *mut u8),
                    Some(&mut data_len),
                ) == ERROR_SUCCESS
                {
                    config.fullscreen_mode = data;
                    config.borderless = data == 3;
                }
            } else if val_name.starts_with("Screenmanager Is Fullscreen mode") && config.fullscreen_mode == 1 {
                let mut data = 0u32;
                let mut data_len = 4u32;
                if RegQueryValueExW(
                    hkey,
                    PCWSTR(to_wide(&val_name).as_ptr()),
                    None,
                    None,
                    Some(&mut data as *mut u32 as *mut u8),
                    Some(&mut data_len),
                ) == ERROR_SUCCESS
                {
                    config.fullscreen_mode = if data == 1 { 1 } else { 3 };
                    config.borderless = data == 0;
                }
            } else if val_name.starts_with("GraphicsSettings_Model") {
                let mut data_len = 0u32;
                if RegQueryValueExW(
                    hkey,
                    PCWSTR(to_wide(&val_name).as_ptr()),
                    None,
                    None,
                    None,
                    Some(&mut data_len),
                ) == ERROR_SUCCESS
                    && data_len > 0
                {
                    let mut buf = vec![0u8; data_len as usize];
                    if RegQueryValueExW(
                        hkey,
                        PCWSTR(to_wide(&val_name).as_ptr()),
                        None,
                        None,
                        Some(buf.as_mut_ptr()),
                        Some(&mut data_len),
                    ) == ERROR_SUCCESS
                    {
                        while let Some(&0) = buf.last() {
                            buf.pop();
                        }
                        if let Ok(json_str) = String::from_utf8(buf) {
                            if let Ok(parsed) = serde_json::from_str::<HsrGraphicsSettings>(&json_str) {
                                config.hsr_graphics = Some(parsed);
                            }
                        }
                    }
                }
            }

            index += 1;
        }

        let _ = RegCloseKey(hkey);
    }

    Ok(config)
}

pub fn save_game_graphics(game_biz: &str, config: &GameGraphicsConfig) -> Result<(), String> {
    let sub_key = match get_game_registry_key(game_biz) {
        Some(k) => k,
        None => return Ok(()),
    };

    let wide_key = to_wide(sub_key);
    let mut hkey: HKEY = HKEY::default();

    unsafe {
        let status = RegCreateKeyExW(
            HKEY_CURRENT_USER,
            PCWSTR(wide_key.as_ptr()),
            Some(0),
            None,
            REG_OPEN_CREATE_OPTIONS(0),
            KEY_READ | KEY_WRITE,
            None,
            &mut hkey,
            None,
        );

        if status != ERROR_SUCCESS {
            return Err(format!("Lỗi mở registry key: {:?}", status));
        }

        let lower = game_biz.to_lowercase();
        let is_hsr = lower.contains("hkrpg") || lower.contains("starrail") || lower.contains("star rail");
        let is_nap = lower.contains("nap") || lower.contains("zenless") || lower.contains("zzz");
        let is_hk4e = lower.contains("hk4e") || lower.contains("genshin") || lower.contains("yuanshen");
        let is_bh3 = lower.contains("bh3") || lower.contains("honkai impact") || lower.contains("honkai3");

        let is_fullscreen = config.fullscreen_mode == 1 && !config.borderless;

        // 1. Set Screenmanager Resolution Width
        let _ = RegSetValueExW(
            hkey,
            PCWSTR(to_wide(SCREENMANAGER_RES_WIDTH).as_ptr()),
            Some(0),
            REG_DWORD,
            Some(std::slice::from_raw_parts(
                &config.width as *const u32 as *const u8,
                4,
            )),
        );

        // 2. Set Screenmanager Resolution Height
        let _ = RegSetValueExW(
            hkey,
            PCWSTR(to_wide(SCREENMANAGER_RES_HEIGHT).as_ptr()),
            Some(0),
            REG_DWORD,
            Some(std::slice::from_raw_parts(
                &config.height as *const u32 as *const u8,
                4,
            )),
        );

        // 3. Set Screenmanager Resolution Use Native = 0 (MUST BE 0 so Unity does not reset to monitor native resolution!)
        let use_native = 0u32;
        let _ = RegSetValueExW(
            hkey,
            PCWSTR(to_wide(SCREENMANAGER_RES_USE_NATIVE).as_ptr()),
            Some(0),
            REG_DWORD,
            Some(std::slice::from_raw_parts(
                &use_native as *const u32 as *const u8,
                4,
            )),
        );

        // 4. Set game-specific fullscreen and JSON keys (exact Starward match)
        if is_hsr {
            // Star Rail uses Screenmanager Fullscreen mode (1 for full, 3 for windowed)
            let mode_val: u32 = if is_fullscreen { 1 } else { 3 };
            let _ = RegSetValueExW(
                hkey,
                PCWSTR(to_wide(SCREENMANAGER_FULLSCREEN_MODE).as_ptr()),
                Some(0),
                REG_DWORD,
                Some(std::slice::from_raw_parts(
                    &mode_val as *const u32 as *const u8,
                    4,
                )),
            );

            // Also keep Screenmanager Is Fullscreen mode in sync
            let is_fs_val: u32 = if is_fullscreen { 1 } else { 0 };
            let _ = RegSetValueExW(
                hkey,
                PCWSTR(to_wide(SCREENMANAGER_IS_FULLSCREEN_MODE).as_ptr()),
                Some(0),
                REG_DWORD,
                Some(std::slice::from_raw_parts(
                    &is_fs_val as *const u32 as *const u8,
                    4,
                )),
            );

            // Set GraphicsSettings_PCResolution JSON
            let pc_res_json = format!(
                "{{\"width\":{},\"height\":{},\"isFullScreen\":{}}}\0",
                config.width,
                config.height,
                if is_fullscreen { "true" } else { "false" }
            );
            let _ = RegSetValueExW(
                hkey,
                PCWSTR(to_wide(GRAPHICS_PC_RESOLUTION).as_ptr()),
                Some(0),
                REG_BINARY,
                Some(pc_res_json.as_bytes()),
            );

            // Save HSR Graphics Model if present
            if let Some(hsr) = &config.hsr_graphics {
                if let Ok(json_bytes) = serde_json::to_vec(hsr) {
                    let mut data_with_null = json_bytes;
                    data_with_null.push(0);
                    let _ = RegSetValueExW(
                        hkey,
                        PCWSTR(to_wide(GRAPHICS_MODEL).as_ptr()),
                        Some(0),
                        REG_BINARY,
                        Some(&data_with_null),
                    );
                }
            }
        } else if is_nap {
            let mode_val: u32 = if is_fullscreen { 1 } else { 3 };
            let _ = RegSetValueExW(
                hkey,
                PCWSTR(to_wide(SCREENMANAGER_FULLSCREEN_MODE).as_ptr()),
                Some(0),
                REG_DWORD,
                Some(std::slice::from_raw_parts(
                    &mode_val as *const u32 as *const u8,
                    4,
                )),
            );
        } else if is_hk4e {
            let is_fs_val: u32 = if is_fullscreen { 1 } else { 0 };
            let _ = RegSetValueExW(
                hkey,
                PCWSTR(to_wide(SCREENMANAGER_IS_FULLSCREEN_MODE).as_ptr()),
                Some(0),
                REG_DWORD,
                Some(std::slice::from_raw_parts(
                    &is_fs_val as *const u32 as *const u8,
                    4,
                )),
            );
        } else if is_bh3 {
            let is_fs_val: u32 = if is_fullscreen { 1 } else { 0 };
            let _ = RegSetValueExW(
                hkey,
                PCWSTR(to_wide(SCREENMANAGER_IS_FULLSCREEN_MODE).as_ptr()),
                Some(0),
                REG_DWORD,
                Some(std::slice::from_raw_parts(
                    &is_fs_val as *const u32 as *const u8,
                    4,
                )),
            );

            let screen_data_json = format!(
                "{{\"width\":{},\"height\":{},\"isFullScreen\":{}}}\0",
                config.width,
                config.height,
                if is_fullscreen { "true" } else { "false" }
            );
            let _ = RegSetValueExW(
                hkey,
                PCWSTR(to_wide(GENERAL_DATA_V2_SCREEN).as_ptr()),
                Some(0),
                REG_BINARY,
                Some(screen_data_json.as_bytes()),
            );
        } else {
            // Generic Unity fallback
            let mode_val: u32 = if is_fullscreen { 1 } else { 3 };
            let _ = RegSetValueExW(
                hkey,
                PCWSTR(to_wide(SCREENMANAGER_FULLSCREEN_MODE).as_ptr()),
                Some(0),
                REG_DWORD,
                Some(std::slice::from_raw_parts(
                    &mode_val as *const u32 as *const u8,
                    4,
                )),
            );
            let is_fs_val: u32 = if is_fullscreen { 1 } else { 0 };
            let _ = RegSetValueExW(
                hkey,
                PCWSTR(to_wide(SCREENMANAGER_IS_FULLSCREEN_MODE).as_ptr()),
                Some(0),
                REG_DWORD,
                Some(std::slice::from_raw_parts(
                    &is_fs_val as *const u32 as *const u8,
                    4,
                )),
            );
        }

        let _ = RegCloseKey(hkey);
    }

    Ok(())
}

pub fn build_launch_arguments(config: &GameGraphicsConfig, force_dx12: bool) -> Vec<String> {
    let mut args = Vec::new();

    if config.borderless {
        args.push("-popupwindow".to_string());
    }

    if force_dx12 {
        args.push("-use-d3d12".to_string());
    }

    if !config.custom_args.trim().is_empty() {
        for arg in config.custom_args.split_whitespace() {
            args.push(arg.to_string());
        }
    }

    args
}

pub fn setup_game_environment(exe_path: &str) {
    // 1. In-process environment variable to disable conflicting AMD layer
    unsafe {
        std::env::set_var("DISABLE_LAYER_AMD_SWITCHABLE_GRAPHICS_1", "1");
    }

    // 2. Register HKCU\Environment so elevated child processes inherit it
    unsafe {
        let env_key = to_wide(r"Environment");
        let mut hkey: HKEY = HKEY::default();
        if RegCreateKeyExW(
            HKEY_CURRENT_USER,
            PCWSTR(env_key.as_ptr()),
            Some(0),
            None,
            REG_OPEN_CREATE_OPTIONS(0),
            KEY_READ | KEY_WRITE,
            None,
            &mut hkey,
            None,
        ) == ERROR_SUCCESS {
            let val_name = to_wide("DISABLE_LAYER_AMD_SWITCHABLE_GRAPHICS_1");
            let val_data = to_wide("1");
            let _ = RegSetValueExW(
                hkey,
                PCWSTR(val_name.as_ptr()),
                Some(0),
                REG_SZ,
                Some(std::slice::from_raw_parts(
                    val_data.as_ptr() as *const u8,
                    val_data.len() * 2,
                )),
            );
            let _ = RegCloseKey(hkey);
        }

        // 3. Set Windows Graphics High Performance GPU Preference (GpuPreference=2;)
        let gpu_key = to_wide(r"Software\Microsoft\DirectX\UserGpuPreferences");
        let mut hkey_gpu: HKEY = HKEY::default();
        if RegCreateKeyExW(
            HKEY_CURRENT_USER,
            PCWSTR(gpu_key.as_ptr()),
            Some(0),
            None,
            REG_OPEN_CREATE_OPTIONS(0),
            KEY_READ | KEY_WRITE,
            None,
            &mut hkey_gpu,
            None,
        ) == ERROR_SUCCESS {
            let exe_name = to_wide(exe_path);
            let pref_data = to_wide("GpuPreference=2;");
            let _ = RegSetValueExW(
                hkey_gpu,
                PCWSTR(exe_name.as_ptr()),
                Some(0),
                REG_SZ,
                Some(std::slice::from_raw_parts(
                    pref_data.as_ptr() as *const u8,
                    pref_data.len() * 2,
                )),
            );
            let _ = RegCloseKey(hkey_gpu);
        }
    }
}

pub fn launch_game_with_config(
    exe_path: &str,
    args: &[String],
) -> Result<(), String> {
    let path = std::path::Path::new(exe_path);
    if !path.exists() {
        return Err(format!("File game không tồn tại: {}", exe_path));
    }

    setup_game_environment(exe_path);

    let workdir = path.parent().unwrap_or(path);

    let mut cmd = Command::new(exe_path);
    cmd.current_dir(workdir);
    cmd.env("DISABLE_LAYER_AMD_SWITCHABLE_GRAPHICS_1", "1");
    for arg in args {
        cmd.arg(arg);
    }

    match cmd.spawn() {
        Ok(_) => Ok(()),
        Err(e) if e.raw_os_error() == Some(740) => {
            // Elevation required: launch via ShellExecuteW with "runas"
            launch_elevated(exe_path, args, &workdir.to_string_lossy())
        }
        Err(e) => Err(format!("Lỗi khởi chạy game: {}", e)),
    }
}

pub fn launch_elevated(exe_path: &str, args: &[String], workdir: &str) -> Result<(), String> {
    use windows::Win32::UI::Shell::ShellExecuteW;
    use windows::Win32::UI::WindowsAndMessaging::SW_SHOWNORMAL;

    let op = to_wide("runas");
    let file = to_wide(exe_path);
    let params_str = args.join(" ");
    let params = to_wide(&params_str);
    let dir = to_wide(workdir);

    unsafe {
        let instance = ShellExecuteW(
            None,
            PCWSTR(op.as_ptr()),
            PCWSTR(file.as_ptr()),
            if params_str.is_empty() { PCWSTR::null() } else { PCWSTR(params.as_ptr()) },
            if workdir.is_empty() { PCWSTR::null() } else { PCWSTR(dir.as_ptr()) },
            SW_SHOWNORMAL,
        );

        if instance.0 as isize <= 32 {
            return Err(format!("Không thể yêu cầu quyền Administrator (Mã lỗi: {})", instance.0 as isize));
        }
    }

    Ok(())
}
