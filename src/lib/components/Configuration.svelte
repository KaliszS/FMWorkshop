<script lang="ts">
  import ConfigOption from './ConfigOption.svelte';
  import { ConfigOptionType } from '$lib/types';
  import { handleModProcessing } from '$lib/modProcessor';

  let { action = $bindable(), edition = $bindable(), modFile = $bindable(""), gameFolder = $bindable(), restoreFolder = $bindable("") }: {
    action: string;
    edition: string;
    modFile?: string;
    gameFolder: string;
    restoreFolder?: string;
  } = $props();

  let actionError = $derived(() => action === "" ? "Select an action" : "");
  let editionError = $derived(() => !/^\d{4}$/.test(edition) ? "Enter a valid 4-digit year (e.g., 2024)" : "");
  let modFileError = $derived(() => {
    if (action !== "Install Mod") return "";
    return (!modFile || modFile.trim() === "") ? "Select a mod file" : "";
  });
  let gameFolderError = $derived(() => gameFolder.trim() === "" ? "Enter the game folder location" : "");
  let restoreFolderError = $derived(() => {
    if (action !== "Uninstall Mod") return "";
    return (!restoreFolder || restoreFolder.trim() === "") ? "Select restore folder location" : "";
  });

  const isFormValid = $derived(() => {
    return !actionError() && !editionError() && !modFileError() && !gameFolderError() && !restoreFolderError();
  });

  async function handleProcess() {
    try {
      await handleModProcessing({
        action,
        edition,
        modFile,
        gameFolder,
        restoreFolder
      });
    } catch (error) {
      console.error("Error in component:", error);
    }
  }
</script>

<div class="configuration">
  <div class="config-header">
    <h2 class="section-title">Configuration</h2>
  </div>
  
  <div class="config-content">
    <div class="config-section">
      <div class="config-row">
        <ConfigOption
          label="Action"
          type={ConfigOptionType.Radio}
          required={true}
          options={["Install Mod", "Uninstall Mod"]}
          bind:value={action}
          hint="Choose whether to install or uninstall a mod"
        />
        {#if action === "Install Mod"}
          <ConfigOption
            label="Mod File"
            type={ConfigOptionType.File}
            required={true}
            bind:value={modFile}
            hint="Select a .zip file containing the mod"
            error={modFileError()}
          />
        {/if}
        {#if action === "Uninstall Mod"}
          <ConfigOption
            label="Restore Folder"
            type={ConfigOptionType.Folder}
            required={true}
            bind:value={restoreFolder}
            hint="Select where to restore the original files"
            error={restoreFolderError()}
          />
        {/if}
      </div>
      <div class="config-row">
        <ConfigOption
          label="Football Manager Edition"
          type={ConfigOptionType.Input}
          required={true}
          placeholder="e.g. 2024"
          bind:value={edition}
          hint="Choose year the game starts"
          error={editionError()}
        />
        <ConfigOption
          label="Game Folder Location"
          type={ConfigOptionType.Folder}
          required={true}
          placeholder="Documents/Sports Interactive/Football Manager {edition}"
          bind:value={gameFolder}
          hint="Location of your Football Manager installation"
          error={gameFolderError()}
        />
      </div>
    </div>

    <div class="config-actions">
      <button 
        class="process-btn" 
        disabled={!isFormValid()}
        onclick={handleProcess}
      >
        <span class="btn-text">
          {action === "Install Mod" ? "Install Mod" : action === "Uninstall Mod" ? "Uninstall Mod" : "Process"}
        </span>
        <span class="btn-icon">→</span>
      </button>
    </div>
  </div>
</div>

<style>
  .configuration {
    border-radius: 1rem;
    overflow: hidden;
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .config-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: .75rem;
    text-align: center;
  }

  .section-title {
    margin: 0 0 0.25rem 0;
  }

  .config-content {
    padding: 1rem;
  }

  .config-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 1rem;
  }

  .config-actions {
    text-align: center;
    padding-top: 1rem;
  }

  .process-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 2rem;
    font-size: 1.2rem;
    font-weight: 600;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    position: relative;
    overflow: hidden;
  }

  .process-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  .process-btn:disabled {
    opacity: 0.5;
    background: #ccc;
    color: #888;
    cursor: not-allowed;
    box-shadow: none;
    pointer-events: none;
  }

  .btn-icon {
    font-size: 1.1rem;
    transition: transform 0.3s ease;
  }

  .process-btn:hover:not(:disabled) .btn-icon {
    transform: translateX(4px);
  }


  @media (prefers-color-scheme: dark) {
    .configuration {
      background: #2a2a2a;
      border-color: rgba(255, 255, 255, 0.1);
    }
  }
</style> 