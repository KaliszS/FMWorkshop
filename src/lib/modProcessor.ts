import { transfer, isDir } from "tauri-plugin-fs-pro-api";
import { invoke } from "@tauri-apps/api/core";
import type { ModProcessingOptions } from '$lib/types';

export async function handleModProcessing(options: ModProcessingOptions): Promise<void> {
    try {
        console.log("Processing with:", options);

        if (options.action === "Install Mod") {
            await installMod(options);
        } else if (options.action === "Uninstall Mod") {
            await uninstallMod(options);
        } else {
            throw new Error(`Unknown action: ${options.action}`);
        }
    } catch (error) {
        console.error("Error processing mod:", error);
        throw error; // Re-throw to let the component handle it
    }
}

async function installMod(options: ModProcessingOptions): Promise<void> {
    const { modFile, gameFolder, edition, retroRegensFolder } = options;

    if (!modFile) {
        throw new Error("Mod file is required for install operation");
    }

    const gameModDir = `${modFile}/Football Manager ${edition}`;
    const retroRegensDir = `${modFile}/retro_regens`;

    if (!(await isDir(gameModDir))) {
        throw new Error(`Game mod directory not found: ${gameModDir}`);
    }

    if (await isDir(gameFolder)) {
        console.log("Game folder exists:", gameFolder);
        
        await createBackup(gameFolder, edition);
        await replaceGameFolder(gameFolder);
    } else {
        throw new Error(`Game folder does not exist: ${gameFolder}`);
    }

    await transfer(gameModDir, gameFolder);
    console.log("Game mod files transferred successfully!");


    if (await isDir(retroRegensDir)) {
        await processRetroRegens(retroRegensDir, retroRegensFolder);
    }
}

async function uninstallMod(options: ModProcessingOptions): Promise<void> {
    const { gameFolder, edition, restoreFolder, retroRegensFolder } = options;
    
    if (!restoreFolder) {
        throw new Error("Restore folder is required for uninstall operation");
    }

    // Handle game folder uninstall
    if (await isDir(restoreFolder)) {
        await restoreFromBackup(gameFolder, edition, restoreFolder);
    } else {
        throw new Error("Restore folder is required for uninstall operation");
    }

    // Clean up retro regens .edt files
    await cleanupRetroRegens(retroRegensFolder);
}

async function processRetroRegens(retroRegensDir: string, retroRegensFolder: string): Promise<void> {
    console.log("Processing retro regens files...");
    
    // Read directory to find .edt files
    const files = await invoke("read_dir", { path: retroRegensDir }) as string[];
    const edtFiles = files.filter(file => file.endsWith('.edt'));
    
    if (edtFiles.length === 0) {
        console.log("No .edt files found in retro regens directory");
        return;
    }

    // Process each .edt file
    for (const edtFile of edtFiles) {
        const sourcePath = `${retroRegensDir}/${edtFile}`;
        const fileName = edtFile.replace('.edt', '');
        
        // Extract the number from filename (e.g., "2400" from "2400.edt")
        const number = fileName;
        
        // Replace the number in the retro regens folder path
        let targetPath = retroRegensFolder;
        if (targetPath.includes('2400')) {
            targetPath = targetPath.replace('2400', number);
        }
        
        // Ensure target directory exists
        await invoke("create_directory", { path: targetPath });
        
        // Copy and rename the file
        const targetFilePath = `${targetPath}/support_staff.edt`;
        await invoke("copy_file", { fromPath: sourcePath, toPath: targetFilePath });
        
        console.log(`Processed ${edtFile} -> ${targetFilePath}`);
    }
    
    console.log("Retro regens processing completed!");
}

async function cleanupRetroRegens(retroRegensFolder: string): Promise<void> {
    console.log("Cleaning up retro regens files...");
    
    try {
        const files = await invoke("read_dir", { path: retroRegensFolder }) as string[];
        const edtFiles = files.filter(file => file.endsWith('.edt'));
        
        for (const edtFile of edtFiles) {
            const filePath = `${retroRegensFolder}/${edtFile}`;
            await invoke("remove_file", { path: filePath });
            console.log(`Removed ${edtFile}`);
        }
        
        console.log("Retro regens cleanup completed!");
    } catch (error) {
        console.log("No retro regens files to clean up or error occurred:", error);
    }
}

async function createBackup(gameFolder: string, edition: string): Promise<string> {
    const backupFolder = await getBackupFolderName(gameFolder, edition);
    console.log("Creating backup folder:", backupFolder);

    await invoke("rename_directory", { oldPath: gameFolder, newPath: backupFolder });
    console.log("Original folder renamed to backup");

    return backupFolder;
}

async function replaceGameFolder(gameFolder: string): Promise<void> {
    await invoke("create_directory", { path: gameFolder });
    console.log("New game folder created");
}

async function restoreFromBackup(gameFolder: string, edition: string, restoreFolder: string): Promise<void> {
    const backupFolder = await getBackupFolderName(gameFolder, edition);

    if (await isDir(backupFolder)) {
        console.log("Backup folder found:", backupFolder);

        if (await isDir(gameFolder)) {
            await transfer(gameFolder, restoreFolder);
            console.log("Mod contents transferred to restore folder: ", restoreFolder);

            await invoke("remove_directory", { path: gameFolder });
            console.log("Current mod folder removed");
        }

        await invoke("create_directory", { path: gameFolder });
        console.log("New game folder created");

        await transfer(backupFolder, gameFolder);
        console.log("Backup contents transferred to game folder");

        await invoke("remove_directory", { path: backupFolder });
        console.log("Backup folder removed");
    } else {
        console.log("No backup folder found, cannot uninstall");
    }
}

async function getBackupFolderName(gameFolder: string, edition: string): Promise<string> {
    return gameFolder.replace(edition, `${edition}_backup`);
}