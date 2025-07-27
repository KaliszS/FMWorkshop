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
    const { modFile, gameFolder, edition } = options;

    if (!modFile) {
        throw new Error("Mod file is required for install operation");
    }

    if (await isDir(gameFolder)) {
        console.log("Game folder exists:", gameFolder);
        
        await createBackup(gameFolder, edition);
        await replaceGameFolder(gameFolder);
    } else {
        throw new Error(`Game folder does not exist: ${gameFolder}`);
    }

    await transfer(modFile, gameFolder);
    console.log("Mod transferred successfully!");
}

async function uninstallMod(options: ModProcessingOptions): Promise<void> {
    const { gameFolder, edition, restoreFolder } = options;
    
    if (await isDir(restoreFolder)) {
        await restoreFromBackup(gameFolder, edition, restoreFolder);
    } else {
        throw new Error("Restore folder is required for uninstall operation");
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