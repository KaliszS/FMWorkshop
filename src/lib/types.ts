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
    modFile?: string;
    gameFolder: string;
    restoreFolder?: string; // uninstall action
    retroRegensFolder?: string; // optional, only required when regensType is selected
    regensType?: string; // optional regens file type
}

export interface PathMapping {
    label: string;
    path: string;
}

export const REGENS_TYPE_OPTIONS = [
    {
        display: "Fixed Potential Ability",
        value: "fixed_pa",
        description: "All players get their historical potential ability (PA) values. Messi would get 199 PA, Ronaldo 195 PA, etc."
    },
    {
        display: "Random Potential Ability", 
        value: "random_pa",
        description: "Each player gets a completely random PA value between 1-200. Each save will have different PA distributions."
    },
    {
        display: "Ranged Potential Ability",
        value: "ranges_pa", 
        description: "Players get PA values within realistic ranges (e.g., 170-200 for world-class players, 140-170 for good players, etc.)"
    }
];

export function mapRegensTypeToValue(displayValue: string): string {
    const option = REGENS_TYPE_OPTIONS.find(opt => opt.display === displayValue);
    return option ? option.value : "";
}

// export function getRegensTypeDescription(displayValue: string): string {
//     const option = REGENS_TYPE_OPTIONS.find(opt => opt.display === displayValue);
//     return option ? option.description : "";
// }

export const getRetroRegensPaths = (edition: string): PathMapping[] => [
  {
    label: "Steam Windows",
    path: `C:/Program Files (x86)/Steam/steamapps/common/Football Manager ${edition}/data/database/db/\${gameVersion}/edt/permanent`
  },
  {
    label: "Epic Games", 
    path: `/Users/Shared/Epic Games/FootballManager${edition}/database/data/db/\${gameVersion}/edt/permanent`
  },
  {
    label: "Steam MacOS",
    path: `Library/Application Support/Steam/steamapps/common/Football Manager ${edition}/database/data/db/\${gameVersion}/edt/permanent`
  }
];