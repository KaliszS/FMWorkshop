use unrar::Archive;
use std::env;

#[tauri::command]
fn unpack_rar(archive_path: &str, output_dir: &str) -> Result<(), String> {
    // Change to output directory before extraction
    let current_dir = env::current_dir().map_err(|e| e.to_string())?;
    env::set_current_dir(output_dir).map_err(|e| e.to_string())?;
    
    let mut archive =
        Archive::new(archive_path)
            .open_for_processing()
            .map_err(|e| e.to_string())?;
    while let Some(header) = archive.read_header().map_err(|e| e.to_string())? {
        println!(
            "{} bytes: {}",
            header.entry().unpacked_size,
            header.entry().filename.to_string_lossy(),
        );
        archive = if header.entry().is_file() {
            header.extract().map_err(|e| e.to_string())?
        } else {
            header.skip().map_err(|e| e.to_string())?
        };
    }
    
    // Restore original directory
    env::set_current_dir(current_dir).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_fs_pro::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![unpack_rar])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
