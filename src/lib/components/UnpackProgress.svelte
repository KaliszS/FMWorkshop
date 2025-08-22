<script lang="ts">
  import { CONFIG_STRINGS } from '$lib/strings';

  let { isVisible = false, progress = 0, total = 0, isFileTransfer = false, fileTransferProgress = 0, fileTransferTotal = 0, onClose = undefined }: {
    isVisible: boolean;
    progress: number;
    total: number;
    isFileTransfer: boolean;
    fileTransferProgress: number;
    fileTransferTotal: number;
    onClose?: () => void;
  } = $props();

  const progressPercent = $derived(() => {
    if (isFileTransfer) {
      return fileTransferTotal > 0 ? Math.round((fileTransferProgress / fileTransferTotal) * 100) : 0;
    }
    return total > 0 ? Math.round((progress / total) * 100) : 0;
  });
  
  const isLoading = $derived(() => total === 0 && !isFileTransfer);
  
  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
</script>

{#if isVisible}
  <div class="unpack-progress-overlay">
    <div class="unpack-progress-modal">
      <div class="progress-header">
        <h3 class="progress-title">{CONFIG_STRINGS.PROGRESS_MODAL.TITLE}</h3>
      </div>
      
      <div class="progress-content">
        {#if isLoading()}
          <div class="progress-note">
            <p>{CONFIG_STRINGS.PROGRESS.STARTING_EXTRACTION}</p>
          </div>
        {:else if isFileTransfer && fileTransferProgress >= fileTransferTotal && fileTransferTotal > 0}
          <div class="progress-note">
            <p>{CONFIG_STRINGS.PROGRESS.FILE_TRANSFER_COMPLETE}</p>
          </div>
        {:else if isFileTransfer}
          <div class="progress-note">
            <p>{CONFIG_STRINGS.PROGRESS.TRANSFERRING_FILES}</p>
          </div>
        {:else if progressPercent() === 100}
          <div class="progress-note">
            <p>{CONFIG_STRINGS.PROGRESS.EXTRACTION_COMPLETE}</p>
          </div>
        {:else}
          <div class="progress-note">
            <p>{CONFIG_STRINGS.PROGRESS.EXTRACTING_ARCHIVE}</p>
          </div>
        {/if}
        
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {progressPercent()}%"></div>
          </div>
          <div class="progress-text">
            {progressPercent()}%
          </div>
        </div>
        
        <div class="progress-details">
          {#if isFileTransfer}
            <div class="progress-row">
              <span class="label">{CONFIG_STRINGS.PROGRESS_MODAL.LABELS.FILES}</span>
              <span class="value">
                {fileTransferProgress} / {fileTransferTotal}
              </span>
            </div>
          {:else}
            <div class="progress-row">
              <span class="label">{CONFIG_STRINGS.PROGRESS_MODAL.LABELS.PROGRESS}</span>
              <span class="value">
                {formatBytes(progress)} / {formatBytes(total)}
              </span>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .unpack-progress-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    backdrop-filter: blur(4px);
  }

  .unpack-progress-modal {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    max-width: 30rem;
    width: 90%;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-2rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .progress-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
  }

  .progress-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .progress-bar-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .progress-bar {
    flex: 1;
    height: 0.75rem;
    background-color: #e5e7eb;
    border-radius: 0.375rem;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 0.375rem;
    transition: width 0.3s ease;
    min-width: 0.5rem; /* Ensure progress bar is visible even for small values */
  }
  
  .progress-text {
    font-weight: 600;
    color: #667eea;
    min-width: 3rem;
    text-align: right;
  }

  .progress-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .progress-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .label {
    color: #666;
    font-size: 0.875rem;
  }

  .value {
    font-weight: 500;
    color: #333;
    font-size: 0.875rem;
  }

  .progress-note {
    background-color: #f0f9eb;
    border: 1px solid #e1f3d8;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    color: #67c23a;
  }

  .progress-note p {
    margin: 0;
    line-height: 1.4;
  }
  
  @media (prefers-color-scheme: dark) {
    .unpack-progress-modal {
      background: #2a2a2a;
      color: #f6f6f6;
    }

    .progress-title {
      color: #f6f6f6;
    }

    .progress-bar {
      background-color: #444;
    }

    .progress-text {
      color: #90ee90;
    }

    .label {
      color: #ccc;
    }

    .value {
      color: #f6f6f6;
    }

    .progress-note {
      background-color: #3a3a3a;
      border: 1px solid #555;
      color: #90ee90;
    }
  }
</style> 