use serde_json::json;
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};
use std::sync::Mutex;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

static NONCE_COUNTER: AtomicU64 = AtomicU64::new(1);

pub fn resolve_client_id(custom_id: Option<&str>, game_name_or_biz: &str) -> String {
    if let Some(id) = custom_id {
        let trimmed = id.trim();
        if !trimmed.is_empty() {
            return trimmed.to_string();
        }
    }

    let lower = game_name_or_biz.to_lowercase();
    if lower.contains("nap") || lower.contains("zzz") || lower.contains("zenless") {
        "1124154024879456276".to_string()
    } else if lower.contains("hkrpg") || lower.contains("star rail") || lower.contains("starrail") {
        "1124153902959431780".to_string()
    } else if lower.contains("hk4e") || lower.contains("genshin") || lower.contains("yuanshen") {
        "1124137436650426509".to_string()
    } else if lower.contains("bh3") || lower.contains("honkai impact") || lower.contains("honkai3") {
        "1124126288370737314".to_string()
    } else if lower.contains("endfield") || lower.contains("beyond") || lower.contains("arknights") {
        "955483486674907138".to_string()
    } else {
        "1138126643592970251".to_string()
    }
}

pub struct DiscordRpc {
    pub client_id: String,
    pipe: File,
}

impl DiscordRpc {
    pub fn connect(client_id: &str) -> Option<Self> {
        for i in 0..10 {
            let path = format!(r"\\.\pipe\discord-ipc-{}", i);
            if let Ok(mut file) = OpenOptions::new().read(true).write(true).open(&path) {
                let handshake = json!({
                    "v": 1,
                    "client_id": client_id
                })
                .to_string();

                let bytes = handshake.as_bytes();
                let op: u32 = 0;
                let len = bytes.len() as u32;

                let mut packet = Vec::with_capacity(8 + bytes.len());
                packet.extend_from_slice(&op.to_le_bytes());
                packet.extend_from_slice(&len.to_le_bytes());
                packet.extend_from_slice(bytes);

                if file.write_all(&packet).is_ok() {
                    let mut header = [0u8; 8];
                    if file.read_exact(&mut header).is_ok() {
                        let resp_len = u32::from_le_bytes([header[4], header[5], header[6], header[7]]) as usize;
                        let mut resp_buf = vec![0u8; resp_len];
                        let _ = file.read_exact(&mut resp_buf);
                        return Some(DiscordRpc {
                            client_id: client_id.to_string(),
                            pipe: file,
                        });
                    }
                }
            }
        }
        None
    }

    pub fn set_activity(
        &mut self,
        details: &str,
        state: &str,
        large_image: Option<&str>,
        large_text: Option<&str>,
        small_image: Option<&str>,
        small_text: Option<&str>,
        start_time: u64,
    ) -> Result<(), String> {
        let nonce = NONCE_COUNTER.fetch_add(1, Ordering::Relaxed);

        let mut activity = json!({
            "details": details,
            "state": state,
            "timestamps": {
                "start": start_time
            }
        });

        let mut assets = json!({});
        let mut has_assets = false;

        if let Some(img) = large_image {
            let trimmed = img.trim();
            if !trimmed.is_empty() {
                assets["large_image"] = json!(trimmed);
                assets["large_text"] = json!(large_text.unwrap_or("Void0 Launcher"));
                has_assets = true;
            }
        }

        if let Some(img) = small_image {
            let trimmed = img.trim();
            if !trimmed.is_empty() {
                assets["small_image"] = json!(trimmed);
                assets["small_text"] = json!(small_text.unwrap_or(details));
                has_assets = true;
            }
        }

        if has_assets {
            activity["assets"] = assets;
        }

        let payload = json!({
            "cmd": "SET_ACTIVITY",
            "args": {
                "pid": std::process::id(),
                "activity": activity
            },
            "nonce": format!("{}", nonce)
        })
        .to_string();

        let bytes = payload.as_bytes();
        let op: u32 = 1;
        let len = bytes.len() as u32;

        let mut packet = Vec::with_capacity(8 + bytes.len());
        packet.extend_from_slice(&op.to_le_bytes());
        packet.extend_from_slice(&len.to_le_bytes());
        packet.extend_from_slice(bytes);

        self.pipe
            .write_all(&packet)
            .map_err(|e| format!("Lỗi gửi activity đến Discord: {}", e))?;

        Ok(())
    }
}

pub struct RpcState {
    rpc: Option<DiscordRpc>,
    start_time: u64,
}

static STATE: Mutex<Option<RpcState>> = Mutex::new(None);

fn get_now() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

pub fn update_presence(
    custom_client_id: Option<String>,
    game_name: &str,
    details: &str,
    state: &str,
    large_image: Option<String>,
    large_text: Option<String>,
    small_image: Option<String>,
    small_text: Option<String>,
) -> Result<(), String> {
    let target_client_id = resolve_client_id(custom_client_id.as_deref(), game_name);
    let mut lock = STATE.lock().map_err(|e| e.to_string())?;

    if lock.is_none() {
        *lock = Some(RpcState {
            rpc: None,
            start_time: get_now(),
        });
    }

    let state_ref = lock.as_mut().unwrap();

    let needs_reconnect = match &state_ref.rpc {
        Some(existing) => existing.client_id != target_client_id,
        None => true,
    };

    if needs_reconnect {
        state_ref.rpc = DiscordRpc::connect(&target_client_id);
    }

    if let Some(client) = state_ref.rpc.as_mut() {
        if client.set_activity(
            details,
            state,
            large_image.as_deref(),
            large_text.as_deref(),
            small_image.as_deref(),
            small_text.as_deref(),
            state_ref.start_time,
        ).is_err() {
            state_ref.rpc = DiscordRpc::connect(&target_client_id);
            if let Some(c) = state_ref.rpc.as_mut() {
                let _ = c.set_activity(
                    details,
                    state,
                    large_image.as_deref(),
                    large_text.as_deref(),
                    small_image.as_deref(),
                    small_text.as_deref(),
                    state_ref.start_time,
                );
            }
        }
    }

    Ok(())
}
