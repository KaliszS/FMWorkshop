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

export interface PathMapping {
    label: string;
    path: string;
}

export const getRetroRegensPaths = (edition: string, gameVersion: string): PathMapping[] => [
  {
    label: "Steam Windows",
    path: `C:/Program Files (x86)/Steam/steamapps/common/Football Manager ${edition}/data/database/db/${gameVersion}/edt/permanent`
  },
  {
    label: "Epic Games", 
    path: `/Users/Shared/Epic Games/FootballManager${edition}/database/data/db/${gameVersion}/edt/permanent`
  },
  {
    label: "Steam MacOS",
    path: `Library/Application Support/Steam/steamapps/common/Football Manager ${edition}/database/data/db/${gameVersion}/edt/permanent`
  }
];

export const getRetroRegensPathFromLabel = (edition: string, gameVersion: string, label: string): string | undefined => {
  const paths = getRetroRegensPaths(edition, gameVersion);
  const found = paths.find(p => p.label === label);
  return found?.path;
};

export const getRetroRegensLabelFromPath = (edition: string, gameVersion: string, path: string): string | undefined => {
  const paths = getRetroRegensPaths(edition, gameVersion);
  const found = paths.find(p => p.path === path);
  return found?.label;
};