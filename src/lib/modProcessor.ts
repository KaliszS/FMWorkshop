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
    const { modFile, gameFolder, edition, retroRegensFolder, regensType } = options;

    if (!modFile) {
        throw new Error("Mod file is required for install operation");
    }

    const modFileUnpackedGameRoot = `${modFile}/Football Manager ${edition}`;

    if (!(await isDir(modFileUnpackedGameRoot))) {
        throw new Error(`Not found game directory in unpacked modification to install: ${modFileUnpackedGameRoot}`);
    }

    if (await isDir(gameFolder)) {
        console.log("Game location to install mod exists:", gameFolder);
        
        await createBackup(gameFolder, edition);
        await replaceGameFolder(gameFolder);
    } else {
        throw new Error(`Game location to install mod not exist: ${gameFolder}`);
    }

    await transfer(modFileUnpackedGameRoot, gameFolder);
    console.log("Game mod files transferred successfully!");

    if (regensType && retroRegensFolder) {
        await processRegensFile(modFile, regensType, retroRegensFolder);
    } else {
        console.log("No regens type selected or retro regens folder specified, skipping regens installation");
    }
}

async function uninstallMod(options: ModProcessingOptions): Promise<void> {
    const { gameFolder, edition, restoreFolder, retroRegensFolder } = options;
    
    if (!restoreFolder) {
        throw new Error("Restore folder is required for uninstall operation");
    }

    if (await isDir(restoreFolder)) {
        await restoreFromBackup(gameFolder, edition, restoreFolder);
    } else {
        throw new Error("Restore folder is required for uninstall operation");
    }

    if (retroRegensFolder) {
        await cleanupRegensFile(retroRegensFolder);
    }
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

async function processRegensFile(modFile: string, regensType: string, retroRegensFolder: string): Promise<void> {
    console.log(`Processing regens file with type: ${regensType}`);
    
    try {
        const regensFile = await matchRegenFile(modFile, regensType);
        const extractedGameVersion = await extractGameVersion(regensType, regensFile);
        
        retroRegensFolder = await updateRetroRegensFolder(retroRegensFolder, extractedGameVersion);
        
        const sourcePath = `${modFile}/${regensFile}`;
        const targetFilePath = `${retroRegensFolder}/support_staff.edt`;
        
        await invoke("copy_file", { fromPath: sourcePath, toPath: targetFilePath });
        console.log(`Regens file copied: ${sourcePath} -> ${targetFilePath}`);
        
    } catch (error) {
        console.error("Error processing regens file:", error);
        throw error;
    }
}

async function matchRegenFile(modFile: string, regensType: string): Promise<string> {
    const files: string[] = await invoke("read_dir", { path: modFile });
        
    const regensFiles: string[] = files.filter(file => 
        file.endsWith('.edt') && 
        file.includes(regensType)
    );
    console.log(`Matching regens files: ${regensFiles}`);

    if (regensFiles.length === 0) {
        throw new Error(`No regens files found for type: ${regensType})`);
    }
    if (regensFiles.length > 1) {
        throw new Error(`Multiple regens files found for type: ${regensType})`);
    }

    return regensFiles[0];
}

async function extractGameVersion(regensType: string, regensFile: string): Promise<string> {
    // Pattern: "*_${regensType}_${gameVersion}.edt"
    const pattern = new RegExp(`.*_${regensType}_(\\d{4})\\.edt$`);
    const match = regensFile.match(pattern);
    console.log(`Extracted game version: ${match ? match[1] : ""}`);

    return match ? match[1] : "";
}

async function updateRetroRegensFolder(retroRegensFolder: string, extractedGameVersion: string): Promise<string> {
    retroRegensFolder = retroRegensFolder.replace(/\${gameVersion}/g, extractedGameVersion);
    console.log(`Updated retro regens folder path: ${retroRegensFolder}`);
    return retroRegensFolder;
}

async function cleanupRegensFile(retroRegensFolder: string): Promise<void> {
    console.log("Cleaning up regens file...");
    
    try {
        if (!(await isDir(retroRegensFolder))) {
            console.log("Retro regens folder does not exist, nothing to clean up");
            return;
        }
        
        const targetFilePath = `${retroRegensFolder}/support_staff.edt`;
        await invoke("remove_file", { path: targetFilePath });
        console.log("Regens file removed successfully");
        
    } catch (error) {
        console.log("No regens file to clean up or error occurred:", error);
    }
}

async function createBackup(gameFolder: string, edition: string): Promise<void> {
    const backupFolder = await getBackupFolderName(gameFolder, edition);
    console.log("Renaming game folder to backup folder:", backupFolder);
    await invoke("rename_directory", { oldPath: gameFolder, newPath: backupFolder });
}

async function replaceGameFolder(gameFolder: string): Promise<void> {
    await invoke("create_directory", { path: gameFolder });
    console.log("New game folder created");
}

async function getBackupFolderName(gameFolder: string, edition: string): Promise<string> {
    return gameFolder.replace(edition, `${edition}_backup`);
}