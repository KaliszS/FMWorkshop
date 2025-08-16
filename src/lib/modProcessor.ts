import { transfer, isDir } from "tauri-plugin-fs-pro-api";
import { invoke } from "@tauri-apps/api/core";
import type { ModProcessingOptions } from '$lib/types';

export async function handleModProcessing(options: ModProcessingOptions): Promise<void> {
    try {
        console.log("Processing with:", options);

        if (options.action === "Install Mod") {
            //await installMod(options);
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

    const modFileUnpackedGameRoot = `${modFile}/Football Manager ${edition}`;
    const modFileUnpackedRegensRoot = `${modFile}/`;

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


    if (await isDir(modFileUnpackedRegensRoot)) {
        await processRetroRegens(modFileUnpackedRegensRoot, retroRegensFolder, edition);
    } else {
        console.log("Not found regens directory in unpacked modification to install: ", modFileUnpackedRegensRoot);
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

async function processRetroRegens(retroRegensDir: string, retroRegensFolder: string, edition: string): Promise<void> {
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
        // Validate file pattern: ??_xxxx.edt where xxxx matches edition
        const pattern = /^.._(\d{4})\.edt$/;
        const match = edtFile.match(pattern);
        
        if (!match) {
            throw new Error(`Invalid retro regens file format: ${edtFile}. Expected format: ??_xxxx.edt`);
        }
        
        const fileNumber = match[1]; // Extract the 4-digit number
        const editionLastTwoDigits = edition.substring(2, 4); // Last two digits of edition
        
        // Check if first two digits of file number match last two digits of edition
        if (fileNumber.substring(0, 2) !== editionLastTwoDigits) {
            throw new Error(`File ${edtFile} number ${fileNumber} doesn't match edition ${edition} (expected ${editionLastTwoDigits}xx)`);
        }
        
        const sourcePath = `${retroRegensDir}/${edtFile}`;
        
        // Replace the number in the retro regens folder path
        let targetPath = retroRegensFolder;
        // Only replace if the path contains the edition's last two digits followed by '00'
        const editionSuffix = edition.substring(2,4) + '00';
        if (targetPath.includes(editionSuffix)) {
            targetPath = targetPath.replace(editionSuffix, fileNumber);
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

async function createBackup(gameFolder: string, edition: string): Promise<void> {
    const backupFolder = await getBackupFolderName(gameFolder, edition);
    console.log("Creating backup folder:", backupFolder);
    await invoke("rename_directory", { oldPath: gameFolder, newPath: backupFolder });
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