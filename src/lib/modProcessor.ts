import { transfer, isDir } from "tauri-plugin-fs-pro-api";
import { mkdir, remove } from "@tauri-apps/plugin-fs";

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

/**
 * Installs a mod by backing up existing files and transferring new ones
 */
async function installMod(options: ModProcessingOptions): Promise<void> {
    const { modFile, gameFolder, edition } = options;

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

/**
 * Uninstalls a mod by restoring from backup
 */
async function uninstallMod(options: ModProcessingOptions): Promise<void> {
    const { gameFolder, edition } = options;
    await restoreFromBackup(gameFolder, edition);
    }

/**
 * Creates a backup of the existing game folder
 */
async function createBackup(gameFolder: string, edition: string): Promise<string> {
    const backupFolder = await getBackupFolderName(gameFolder, edition);
    console.log("Creating backup folder:", backupFolder);

    await mkdir(backupFolder, { recursive: true });
    await transfer(gameFolder, backupFolder);
    console.log("Original contents transferred to backup");

    return backupFolder;
}

/**
 * Removes the current game folder and creates a new one
 */
async function replaceGameFolder(gameFolder: string): Promise<void> {
  await remove(gameFolder, { recursive: true });
  console.log("Original folder removed");
  
  await mkdir(gameFolder, { recursive: true });
  console.log("New game folder created");
}

/**
 * Restores the original game folder from backup
 */
async function restoreFromBackup(gameFolder: string, edition: string): Promise<void> {
    const backupFolder = await getBackupFolderName(gameFolder, edition);

    if (await isDir(backupFolder)) {
        console.log("Backup folder found:", backupFolder);

        if (await isDir(gameFolder)) {
            await remove(gameFolder, { recursive: true });
            console.log("Current mod folder removed");
        }

        await mkdir(gameFolder, { recursive: true });

        await transfer(backupFolder, gameFolder);
        console.log("Backup contents transferred back to original location");

        await remove(backupFolder, { recursive: true });
        console.log("Backup folder removed");

        console.log("Original folder restored successfully!");
    } else {
        console.log("No backup folder found, cannot uninstall");
    }
}

async function getBackupFolderName(gameFolder: string, edition: string): Promise<string> {
    return gameFolder.replace(edition, `${edition}_backup`);
}