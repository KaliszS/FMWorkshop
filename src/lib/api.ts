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

export async function unpackRar(archivePath: string, outputDir?: string): Promise<void> {
    const targetDir = outputDir || getParentDirectory(archivePath);
    await invoke("unpack_rar", { archivePath, outputDir: targetDir });
}