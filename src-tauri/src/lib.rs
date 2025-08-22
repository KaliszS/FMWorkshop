use std::sync::{Arc, Mutex};
use std::collections::HashMap;
use std::fs::File;
use ripunzip::{UnzipEngine, UnzipOptions, UnzipProgressReporter};

// Global progress tracking
static PROGRESS_MAP: std::sync::OnceLock<Arc<Mutex<HashMap<String, (u64, u64)>>>> = std::sync::OnceLock::new();
static FILE_TRANSFER_PROGRESS: std::sync::OnceLock<Arc<Mutex<(u64, u64)>>> = std::sync::OnceLock::new();

fn get_progress_map() -> Arc<Mutex<HashMap<String, (u64, u64)>>> {
    PROGRESS_MAP.get_or_init(|| Arc::new(Mutex::new(HashMap::new()))).clone()
}

fn get_file_transfer_progress_map() -> Arc<Mutex<(u64, u64)>> {
    FILE_TRANSFER_PROGRESS.get_or_init(|| Arc::new(Mutex::new((0, 0)))).clone()
}

// Progress reporter for ripunzip
struct ProgressReporter {
    archive_id: String,
}

impl UnzipProgressReporter for ProgressReporter {
    fn total_bytes_expected(&self, expected: u64) {
        if let Ok(mut map) = get_progress_map().lock() {
            map.insert(self.archive_id.clone(), (0, expected));
        }
    }
    
    fn bytes_extracted(&self, count: u64) {
        if let Ok(mut map) = get_progress_map().lock() {
            if let Some((current, total)) = map.get(&self.archive_id).copied() {
                let new_total = current + count;
                map.insert(self.archive_id.clone(), (new_total, total));
            }
        }
    }
}

#[tauri::command]
async fn unpack_zip(archive_path: String, output_dir: String) -> Result<(), String> {
    let archive_id = archive_path.clone();
    let progress_map = get_progress_map();
    
    // Initialize progress
    {
        let mut map = progress_map.lock().map_err(|e| e.to_string())?;
        map.insert(archive_id.clone(), (0, 0));
    }
    
    // Open the zip file
    let file = File::open(&archive_path).map_err(|e| e.to_string())?;
    
    // Create unzip engine
    let engine = UnzipEngine::for_file(file).map_err(|e| e.to_string())?;
    
    // Create options with progress reporter
    let options = UnzipOptions {
        output_directory: Some(output_dir.into()),
        password: None,
        single_threaded: false,
        filename_filter: None,
        progress_reporter: Box::new(ProgressReporter { archive_id: archive_id.clone() }),
    };
    
    // Extract archive (this will call the progress reporter as it works)
    engine.unzip(options).map_err(|e| e.to_string())?;
    
    // Mark as complete
    {
        let mut map = progress_map.lock().map_err(|e| e.to_string())?;
        if let Some((_, total)) = map.get(&archive_id).copied() {
            map.insert(archive_id, (total, total)); // Set to 100%
        }
    }
    
    Ok(())
}

#[tauri::command]
async fn get_unpack_progress(archive_path: String) -> Result<Option<(u64, u64)>, String> {
    let progress_map = get_progress_map();
    let map = progress_map.lock().map_err(|e| e.to_string())?;
    
    if let Some((extracted, total)) = map.get(&archive_path) {
        if *extracted >= *total && *total > 0 {
            // Extraction complete
            Ok(None)
        } else {
            // Still in progress
            Ok(Some((*extracted, *total)))
        }
    } else {
        Ok(None)
    }
}

#[tauri::command]
async fn set_file_transfer_progress(current: u64, total: u64) -> Result<(), String> {
    let progress = get_file_transfer_progress_map();
    let mut map = progress.lock().map_err(|e| e.to_string())?;
    *map = (current, total);
    Ok(())
}

#[tauri::command]
async fn get_file_transfer_progress() -> Result<(u64, u64), String> {
    let progress = get_file_transfer_progress_map();
    let map = progress.lock().map_err(|e| e.to_string())?;
    Ok(*map)
}

// File operations
#[tauri::command]
async fn read_dir(path: String) -> Result<Vec<String>, String> {
    let entries = std::fs::read_dir(path)
        .map_err(|e| e.to_string())?
        .filter_map(|entry| entry.ok())
        .map(|entry| entry.path().to_string_lossy().to_string())
        .collect::<Vec<_>>();
    
    Ok(entries)
}

#[tauri::command]
async fn create_directory(path: String) -> Result<(), String> {
    std::fs::create_dir_all(path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn remove_directory(path: String) -> Result<(), String> {
    std::fs::remove_dir_all(path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn rename_directory(old_path: String, new_path: String) -> Result<(), String> {
    std::fs::rename(old_path, new_path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn copy_file(from_path: String, to_path: String) -> Result<(), String> {
    std::fs::copy(from_path, to_path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn remove_file(path: String) -> Result<(), String> {
    std::fs::remove_file(path).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_fs_pro::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            unpack_zip, 
            get_unpack_progress,
            set_file_transfer_progress,
            get_file_transfer_progress,
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