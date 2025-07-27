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
    modFile: string; // install action
    gameFolder: string;
    restoreFolder: string; // uninstall action
}