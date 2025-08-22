export const CONFIG_STRINGS = {
  // Section titles
  SECTION_TITLE: "Configuration",
  
  // Field labels
  ACTION_LABEL: "Action",
  MOD_FILE_LABEL: "Modification Zip File",
  RESTORE_FOLDER_LABEL: "Restore Folder",
  EDITION_LABEL: "Football Manager Edition",
  GAME_FOLDER_LABEL: "Game Folder",
  REGENS_TYPE_LABEL: "Regens Type",
  RETRO_REGENS_FOLDER_LABEL: "Retro Regens Folder",
  
  // Field options
  ACTION_OPTIONS: {
    INSTALL_MOD: "Install Mod",
    UNINSTALL_MOD: "Uninstall Mod"
  },
  
  // Field placeholders
  EDITION_PLACEHOLDER: "e.g. 2024",
  
  // Field hints
  ACTION_HINT: "Choose whether to install or uninstall a mod",
  MOD_FILE_HINT: "Select a downloaded .zip file containing the mod",
  RESTORE_FOLDER_HINT: "Select where to restore the original files",
  EDITION_HINT: "Choose year the game starts",
  GAME_FOLDER_HINT: "Location of the game (Football Manager {edition} folder)",
  REGENS_TYPE_HINT: "Choose regens file type (optional - if not selected, regens mod won't be installed)",
  RETRO_REGENS_FOLDER_HINT: "Location for Retro Regens files (optional)",
  RETRO_REGENS_FOLDER_UNINSTALL_HINT: "Location for Retro Regens files (optional - if not selected, no regens will be uninstalled)",
  
  // Error messages
  ERRORS: {
    SELECT_ACTION: "Select an action",
    ENTER_VALID_YEAR: "Enter a valid 4-digit year (e.g., 2024)",
    SELECT_MOD_FILE: "Select a mod file",
    ENTER_GAME_FOLDER: "Enter the game folder location",
    SELECT_RESTORE_FOLDER: "Select restore folder location"
  },
  
  // Button text
  BUTTONS: {
    PROCESSING: "Processing...",
    INSTALL_MOD: "Install Mod",
    UNINSTALL_MOD: "Uninstall Mod",
    PROCESS: "Process"
  },
  
  // Progress messages
  PROGRESS: {
    STARTING_EXTRACTION: "Starting extraction...",
    EXTRACTION_COMPLETE: "Extraction complete! Transferring files...",
    EXTRACTING_ARCHIVE: "Extracting archive...",
    TRANSFERRING_FILES: "Transferring mod files...",
    FILE_TRANSFER_COMPLETE: "File transfer complete! Finalizing installation...",
    INSTALLATION_COMPLETE: "Installation complete!"
  },
  
  // Success messages
  SUCCESS: {
    INSTALL_COMPLETE: "Install Mod completed successfully!",
    UNINSTALL_COMPLETE: "Uninstall Mod completed successfully!",
    PROGRESS_WINDOW_CLOSED: "Progress window closed. Extraction continues in the background."
  },
  
  // File input
  FILE_INPUT: {
    CHOOSE_FILE: "Choose a ZIP file"
  },
  
  // Folder input
  FOLDER_INPUT: {
    SELECT_FOLDER: "Select folder",
    SELECT_OPTION_OR_BROWSE: "Select an option or browse...",
    BROWSE: "Browse",
    RETRO_REGENS_FOLDER: "Retro Regens Folder"
  },
  
  // Main page
  MAIN_PAGE: {
    APP_TITLE: "FM Workshop",
    APP_DESCRIPTION: "A utility to help you install retro databases for Football Manager games.",
    VERSION: "v0.1.0"
  },
  
  // Progress modal
  PROGRESS_MODAL: {
    TITLE: "Installing Mod",
    LABELS: {
      FILES: "Files:",
      PROGRESS: "Progress:"
    }
  }
} as const;