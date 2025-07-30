use unrar::Archive;
use std::env;
use std::fs;

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

#[tauri::command]
fn create_directory(path: &str) -> Result<(), String> {
    fs::create_dir_all(path).map_err(|e| e.to_string())
}

#[tauri::command]
fn remove_directory(path: &str) -> Result<(), String> {
    fs::remove_dir_all(path).map_err(|e| e.to_string())
}

#[tauri::command]
fn rename_directory(old_path: &str, new_path: &str) -> Result<(), String> {
    fs::rename(old_path, new_path).map_err(|e| e.to_string())
}

#[tauri::command]
fn copy_file(from_path: &str, to_path: &str) -> Result<(), String> {
    fs::copy(from_path, to_path).map(|_| ()).map_err(|e| e.to_string())
}

#[tauri::command]
fn read_dir(path: &str) -> Result<Vec<String>, String> {
    let entries = fs::read_dir(path).map_err(|e| e.to_string())?;
    let mut files = Vec::new();
    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        files.push(entry.file_name().to_string_lossy().to_string());
    }
    Ok(files)
}

#[tauri::command]
fn remove_file(path: &str) -> Result<(), String> {
    fs::remove_file(path).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_fs_pro::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            unpack_rar, 
            create_directory, 
            remove_directory, 
            rename_directory,
            copy_file,
            read_dir,
            remove_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
