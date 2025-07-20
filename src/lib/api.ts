import { open } from '@tauri-apps/plugin-dialog';

export async function loadFile(dir: boolean): Promise<string | null> {
    const path = await open({ multiple: false, directory: dir });
    if (typeof path === "string") {
      return path;
    }
    return null;
  }