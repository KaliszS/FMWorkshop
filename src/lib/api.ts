import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';

import { getParentDirectory } from "$lib/utils";

export async function loadFile(dir: boolean): Promise<string | null> {
    const path = await open({ multiple: false, directory: dir });
    if (typeof path === "string") {
      return path;
    }
    return null;
  }

export async function unpackZip(archivePath: string, outputDir?: string): Promise<void> {
    const targetDir = outputDir || getParentDirectory(archivePath);
    await invoke("unpack_zip", { archivePath, outputDir: targetDir });
}

export async function getUnpackProgress(archivePath: string): Promise<{ progress: number; total: number } | null> {
    try {
        const result = await invoke("get_unpack_progress", { archivePath });
        if (result && Array.isArray(result) && result.length === 2) {
            return { progress: result[0], total: result[1] };
        }
        return null;
    } catch (error) {
        console.error("Error getting unpack progress:", error);
        return null;
    }
}

export async function setFileTransferProgress(current: number, total: number): Promise<void> {
    await invoke("set_file_transfer_progress", { current, total });
}

export async function getFileTransferProgress(): Promise<{ current: number; total: number }> {
    try {
        const result = await invoke("get_file_transfer_progress");
        if (result && Array.isArray(result) && result.length === 2) {
            return { current: result[0], total: result[1] };
        }
        return { current: 0, total: 0 };
    } catch (error) {
        console.error("Error getting file transfer progress:", error);
        return { current: 0, total: 0 };
    }
}