export enum ConfigOptionType {
    Radio = "radio",
    Select = "select",
    Input = "input",
    File = "file",
    Folder = "folder"
}

export interface ModProcessingOptions {
    action: "Install Mod" | "Uninstall Mod";
    edition: string;
    gameVersion: string;
    modFile: string;
    gameFolder: string;
    restoreFolder?: string; // uninstall action
    retroRegensFolder: string; // always required
}

export const getRetroRegensPaths = (edition: string, gameVersion: string) => ({
  "STEAM_WINDOWS": `C:/Program Files (x86)/Steam/steamapps/common/Football Manager ${edition}/data/database/db/${gameVersion}/edt/permanent`,
  "EPIC_GAMES": `/Users/Shared/Epic Games/FootballManager${edition}/database/data/db/${gameVersion}/edt/permanent`,
  "STEAM_MAC": `Library/Application Support/Steam/steamapps/common/Football Manager ${edition}/database/data/db/${gameVersion}/edt/permanent`
});