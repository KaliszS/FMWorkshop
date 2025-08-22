<script lang="ts">
  import ConfigOption from './ConfigOption.svelte';
  import ErrorNotification from './ErrorNotification.svelte';
  import SuccessNotification from './SuccessNotification.svelte';
  import UnpackProgress from './UnpackProgress.svelte';
  import { ConfigOptionType } from '$lib/types';
  import { handleModProcessing } from '$lib/modProcessor';
  import { getUnpackProgress, getFileTransferProgress } from '$lib/api';
  import { getRetroRegensPaths, type PathMapping, mapRegensTypeToValue, REGENS_TYPE_OPTIONS } from '$lib/types';
  import { CONFIG_STRINGS } from '$lib/strings';

  let { action = $bindable(), edition = $bindable(), modFile = $bindable(""), gameFolder = $bindable(), restoreFolder = $bindable(""), retroRegensFolder = $bindable(""), regensType = $bindable("") }: {
    action: "Install Mod" | "Uninstall Mod";
    edition: string;
    modFile: string;
    gameFolder: string;
    restoreFolder: string;
    retroRegensFolder: string;
    regensType: string;
  } = $props();

  let retroRegensPathMapping = $state<PathMapping[]>([]);

  let processingError = $state("");
  let processingSuccess = $state("");
  let isProcessing = $state(false);

  let showUnpackProgress = $state(false);
  let unpackProgress = $state(0);
  let unpackTotal = $state(0);
  let progressInterval: number | null = null;
  
  let isFileTransfer = $state(false);
  let fileTransferProgress = $state(0);
  let fileTransferTotal = $state(0);
  
  let progressStartTime = $state(0);
  const MINIMUM_PROGRESS_DISPLAY_TIME = 2000;

  let retroRegensOptions = $derived(() => {
    if (!edition) return [];
    return getRetroRegensPaths(edition);
  });

  $effect(() => {
    if (retroRegensOptions().length > 0) {
      retroRegensPathMapping = [...retroRegensOptions()];
    }
  });

  function handleRetroRegensCustomPath(customPath: string) {
    if (customPath && !retroRegensPathMapping.find(p => p.path === customPath)) {
      retroRegensPathMapping = [...retroRegensPathMapping, { label: customPath, path: customPath }];
      retroRegensFolder = customPath;
      retroRegensPathMapping = [...retroRegensPathMapping];
    }
  }

  $effect(() => {
    if (!regensType || regensType.trim() === "") {
      retroRegensFolder = "";
    }
  });

  let retroRegensFolderError = $derived(() => {
    return "";
  });

  let actionError = $derived(() => !action ? CONFIG_STRINGS.ERRORS.SELECT_ACTION : "");
  let editionError = $derived(() => !/^\d{4}$/.test(edition) ? CONFIG_STRINGS.ERRORS.ENTER_VALID_YEAR : "");
  let modFileError = $derived(() => {
    if (action !== CONFIG_STRINGS.ACTION_OPTIONS.INSTALL_MOD) return "";
    return (!modFile || modFile.trim() === "") ? CONFIG_STRINGS.ERRORS.SELECT_MOD_FILE : "";
  });
  let gameFolderError = $derived(() => gameFolder.trim() === "" ? CONFIG_STRINGS.ERRORS.ENTER_GAME_FOLDER : "");
  let restoreFolderError = $derived(() => {
    if (action !== CONFIG_STRINGS.ACTION_OPTIONS.UNINSTALL_MOD) return "";
    return (!restoreFolder || restoreFolder.trim() === "") ? CONFIG_STRINGS.ERRORS.SELECT_RESTORE_FOLDER : "";
  });

  const isFormValid = $derived(() => {
    return !actionError() && !editionError() && !modFileError() && !gameFolderError() && !restoreFolderError();
  });

  async function handleProcess() {
    try {
      processingError = "";
      processingSuccess = "";
      isProcessing = true;
      
      if (action === CONFIG_STRINGS.ACTION_OPTIONS.INSTALL_MOD) {
        progressStartTime = Date.now();
        showUnpackProgress = true;
        unpackProgress = 0;
        unpackTotal = 0;
        isFileTransfer = false;
        
        setTimeout(() => {
          startProgressPolling();
        }, 100);
      }
      
      await handleModProcessing({
        action,
        edition,
        modFile,
        gameFolder,
        restoreFolder,
        retroRegensFolder: regensType ? retroRegensFolder : undefined,
        regensType: mapRegensTypeToValue(regensType)
      });
      
      processingSuccess = action === CONFIG_STRINGS.ACTION_OPTIONS.INSTALL_MOD 
        ? CONFIG_STRINGS.SUCCESS.INSTALL_COMPLETE 
        : CONFIG_STRINGS.SUCCESS.UNINSTALL_COMPLETE;
      
    } catch (error) {
      processingError = error instanceof Error ? error.message : String(error);
    } finally {
      if (showUnpackProgress) {
        const elapsedTime = Date.now() - progressStartTime;
        const remainingTime = Math.max(0, MINIMUM_PROGRESS_DISPLAY_TIME - elapsedTime);
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
      }
      
      isProcessing = false;
      showUnpackProgress = false;
      stopProgressPolling();
      isFileTransfer = false;
    }
  }

  function startProgressPolling() {
    if (progressInterval) return;
    
    progressInterval = setInterval(async () => {
      try {
        if (isFileTransfer) {
          const fileProgress = await getFileTransferProgress();
          if (fileProgress.current !== fileTransferProgress || fileProgress.total !== fileTransferTotal) {
            fileTransferProgress = fileProgress.current;
            fileTransferTotal = fileProgress.total;
          }
        } else {
          const progress = await getUnpackProgress(modFile);
          
          if (progress) {
            if (unpackProgress !== progress.progress || unpackTotal !== progress.total) {
              unpackProgress = progress.progress;
              unpackTotal = progress.total;
            }
          } else {
            unpackProgress = unpackTotal;
            isFileTransfer = true;
            fileTransferProgress = 0;
            fileTransferTotal = 1;
          }
        }
      } catch (error) {
        console.error('Progress polling error:', error);
      }
    }, 250);
  }

  function stopProgressPolling() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }

  function clearError() {
    processingError = "";
  }

  function clearSuccess() {
    processingSuccess = "";
  }

  function closeUnpackProgress() {
    showUnpackProgress = false;
    processingSuccess = CONFIG_STRINGS.SUCCESS.PROGRESS_WINDOW_CLOSED;
    setTimeout(() => {
      processingSuccess = "";
    }, 5000);
  }
</script>

<div class="configuration">
  <div class="config-header">
    <h2 class="section-title">{CONFIG_STRINGS.SECTION_TITLE}</h2>
  </div>
  
  <div class="config-content">
    <div class="config-section">
      <div class="config-row">
        <ConfigOption
          label={CONFIG_STRINGS.ACTION_LABEL}
          type={ConfigOptionType.Radio}
          required={true}
          options={[CONFIG_STRINGS.ACTION_OPTIONS.INSTALL_MOD, CONFIG_STRINGS.ACTION_OPTIONS.UNINSTALL_MOD]}
          bind:value={action}
          hint={CONFIG_STRINGS.ACTION_HINT}
        />
        {#if action === CONFIG_STRINGS.ACTION_OPTIONS.INSTALL_MOD}
          <ConfigOption
            label={CONFIG_STRINGS.MOD_FILE_LABEL}
            type={ConfigOptionType.File}
            required={true}
            bind:value={modFile}
            hint={CONFIG_STRINGS.MOD_FILE_HINT}
            error={modFileError()}
          />
        {/if}
        {#if action === CONFIG_STRINGS.ACTION_OPTIONS.UNINSTALL_MOD}
          <ConfigOption
            label={CONFIG_STRINGS.RESTORE_FOLDER_LABEL}
            type={ConfigOptionType.Folder}
            required={true}
            bind:value={restoreFolder}
            hint={CONFIG_STRINGS.RESTORE_FOLDER_HINT}
            error={restoreFolderError()}
          />
        {/if}
      </div>
      <div class="config-row">
        <ConfigOption
          label={CONFIG_STRINGS.EDITION_LABEL}
          type={ConfigOptionType.Input}
          required={true}
          placeholder={CONFIG_STRINGS.EDITION_PLACEHOLDER}
          bind:value={edition}
          hint={CONFIG_STRINGS.EDITION_HINT}
          error={editionError()}
        />
        <ConfigOption
          label={CONFIG_STRINGS.GAME_FOLDER_LABEL}
          type={ConfigOptionType.Folder}
          required={true}
          bind:value={gameFolder}
          hint={CONFIG_STRINGS.GAME_FOLDER_HINT}
          error={gameFolderError()}
        />
      </div>
      {#if action === CONFIG_STRINGS.ACTION_OPTIONS.INSTALL_MOD && edition && edition.trim() !== "" && !editionError()}
        <div class="config-row">
          <ConfigOption
            label={CONFIG_STRINGS.REGENS_TYPE_LABEL}
            type={ConfigOptionType.Radio}
            required={false}
            options={REGENS_TYPE_OPTIONS.map(opt => opt.display)}
            bind:value={regensType}
            hint={CONFIG_STRINGS.REGENS_TYPE_HINT}
            descriptions={REGENS_TYPE_OPTIONS.map(opt => opt.description)}
          />
          {#if regensType && regensType.trim() !== ""}
            <ConfigOption
              label={CONFIG_STRINGS.RETRO_REGENS_FOLDER_LABEL}
              type={ConfigOptionType.Folder}
              required={false}
              options={retroRegensPathMapping.map(option => option.label)}
              bind:value={retroRegensFolder}
              hint={CONFIG_STRINGS.RETRO_REGENS_FOLDER_HINT}
              pathMapping={retroRegensPathMapping}
              onCustomPath={handleRetroRegensCustomPath}
            />
          {/if}
        </div>
      {/if}
      {#if action === CONFIG_STRINGS.ACTION_OPTIONS.UNINSTALL_MOD && edition && edition.trim() !== "" && !editionError()}
        <div class="config-row">
          <ConfigOption
            label={CONFIG_STRINGS.RETRO_REGENS_FOLDER_LABEL}
            type={ConfigOptionType.Folder}
            required={false}
            options={retroRegensPathMapping.map(option => option.label)}
            bind:value={retroRegensFolder}
            hint={CONFIG_STRINGS.RETRO_REGENS_FOLDER_UNINSTALL_HINT}
            pathMapping={retroRegensPathMapping}
            onCustomPath={handleRetroRegensCustomPath}
          />
        </div>
      {/if}
    </div>

    <div class="config-actions">
      <button 
        class="process-btn" 
        class:processing={isProcessing}
        disabled={!isFormValid() || isProcessing}
        onclick={handleProcess}
      >
        {#if isProcessing}
          <span class="btn-text">{CONFIG_STRINGS.BUTTONS.PROCESSING}</span>
          <span class="btn-icon">→</span>
        {:else}
          <span class="btn-text">
            {action === CONFIG_STRINGS.ACTION_OPTIONS.INSTALL_MOD ? CONFIG_STRINGS.BUTTONS.INSTALL_MOD : action === CONFIG_STRINGS.ACTION_OPTIONS.UNINSTALL_MOD ? CONFIG_STRINGS.BUTTONS.UNINSTALL_MOD : CONFIG_STRINGS.BUTTONS.PROCESS}
          </span>
          <span class="btn-icon">→</span>
        {/if}
      </button>
      
      {#if showUnpackProgress}
        <UnpackProgress
          isVisible={showUnpackProgress}
          progress={unpackProgress}
          total={unpackTotal}
          isFileTransfer={isFileTransfer}
          fileTransferProgress={fileTransferProgress}
          fileTransferTotal={fileTransferTotal}
          onClose={closeUnpackProgress}
        />
      {/if}
    </div>
  </div>
</div>

<ErrorNotification error={processingError} onClose={clearError} />
<SuccessNotification message={processingSuccess} onClose={clearSuccess} />


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
    grid-template-columns: 1fr 1fr;
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

  .process-btn:disabled:not(.processing) {
    opacity: 0.5;
    background: #ccc;
    color: #888;
    cursor: not-allowed;
    box-shadow: none;
    pointer-events: none;
  }

  .process-btn.processing {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    cursor: wait;
    opacity: 0.8;
  }

  .process-btn.processing .btn-icon {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
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