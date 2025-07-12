<script lang="ts">
  import ConfigOption from './ConfigOption.svelte';
  import { ConfigOptionType } from '$lib/types';

  let action = $state("");
  let edition = $state("");
  let modFile = $state("");
  let gameFolder = $state("");

  let isFormValid = $derived(() => {
    const isEditionValid = edition.length === 4 && /^\d{4}$/.test(edition);
    const isGameFolderValid = gameFolder.trim() !== "";
    const isActionValid = action !== "";
    const isModFileValid = action === "Install Mod" ? modFile.trim() !== "" : true;
    
    return isEditionValid && isGameFolderValid && isActionValid && isModFileValid;
  });

  function handleActionChange(value: string) {
    action = value;

    if (value === "Uninstall Mod") {
      modFile = "";
    }
  }

  function handleEditionChange(value: string) {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      edition = value;
    }
  }

  function handleModFileChange(value: string) {
    modFile = value;
  }

  function handleGameFolderChange(value: string) {
    gameFolder = value;
  }

  function handleProcess() {
    // TODO: Implement processing logic
    console.log("Processing with:", {
      action,
      edition,
      modFile,
      gameFolder
    });
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
          value={action}
          onValueChange={handleActionChange}
          hint="Choose whether to install or uninstall a mod"
        />
        {#if action === "Install Mod"}
          <ConfigOption
            label="Mod File"
            type={ConfigOptionType.File}
            required={true}
            value={modFile}
            onValueChange={handleModFileChange}
            hint="Select a .zip file containing the mod"
          />
        {/if}
      </div>
      <div class="config-row">
        <ConfigOption
          label="Football Manager Edition"
          type={ConfigOptionType.Input}
          required={true}
          placeholder="2024"
          value={edition}
          onValueChange={handleEditionChange}
          hint="Enter the 4-digit year (e.g., 2024)"
        />
        <ConfigOption
          label="Game Folder Location"
          type={ConfigOptionType.Folder}
          required={true}
          placeholder="Documents/Sports Interactive/Football Manager {edition}"
          value={gameFolder}
          onValueChange={handleGameFolderChange}
          hint="Location of your Football Manager installation"
        />
      </div>
    </div>

    <div class="config-actions">
      <button 
        class="process-btn" 
        disabled={!isFormValid}
        onclick={handleProcess}
      >
        <span class="btn-text">
          {action === "Install Mod" ? "Install Mod" : action === "Uninstall Mod" ? "Uninstall Mod" : "Process"}
        </span>
        <span class="btn-icon">→</span>
      </button>
    </div>

    {#if !isFormValid}
      <div class="validation-info">
        <div class="validation-header">
          <span class="validation-icon">⚠️</span>
          <span class="validation-title">Please complete the following:</span>
        </div>
        <div class="validation-list">
          {#if action === ""}
            <div class="validation-item">Select an action</div>
          {/if}
          {#if edition.length !== 4 || !/^\d{4}$/.test(edition)}
            <div class="validation-item">Enter a valid 4-digit year (e.g., 2024)</div>
          {/if}
          {#if action === "Install Mod" && modFile === ""}
            <div class="validation-item">Select a mod file</div>
          {/if}
          {#if gameFolder.trim() === ""}
            <div class="validation-item">Enter the game folder location</div>
          {/if}
        </div>
      </div>
    {/if}
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

  .btn-icon {
    font-size: 1.1rem;
    transition: transform 0.3s ease;
  }

  .process-btn:hover:not(:disabled) .btn-icon {
    transform: translateX(4px);
  }

  /* .validation-info {
    background: #fff5f5;
    border: 1px solid #fed7d7;
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
  }

  .validation-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .validation-icon {
    font-size: 1rem;
  }

  .validation-title {
    font-weight: 600;
    color: #c53030;
    font-size: 0.9rem;
  }

  .validation-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .validation-item {
    color: #c53030;
    font-size: 0.85rem;
    padding-left: 1rem;
    position: relative;
  }

  .validation-item::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #c53030;
    font-weight: bold;
  } */

  @media (prefers-color-scheme: dark) {
    .configuration {
      background: #2a2a2a;
      border-color: rgba(255, 255, 255, 0.1);
    }

    /* .validation-info {
      background: rgba(197, 48, 48, 0.1);
      border-color: rgba(197, 48, 48, 0.3);
    } */
  }
</style> 