<script lang="ts">
  let { error = "", onClose = undefined }: {
    error: string;
    onClose?: () => void;
  } = $props();

  let isVisible = $derived(error && error.trim() !== "");
</script>

{#if isVisible}
  <div class="error-notification" class:show={isVisible}>
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <div class="error-message">
        <h3 class="error-title">Error</h3>
        <p class="error-text">{error}</p>
      </div>
      {#if onClose}
        <button class="error-close" onclick={onClose} aria-label="Close error">
          ×
        </button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .error-notification {
    position: fixed;
    top: 1rem;
    right: 1rem;
    max-width: 25rem;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    color: white;
    border-radius: 0.75rem;
    box-shadow: 0 0.5rem 1.5rem rgba(255, 107, 107, 0.3);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }

  .error-notification.show {
    transform: translateX(0);
  }

  .error-content {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
  }

  .error-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .error-message {
    flex: 1;
    min-width: 0;
  }

  .error-title {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .error-text {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.4;
    opacity: 0.95;
  }

  .error-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    padding: 0;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s ease;
    flex-shrink: 0;
  }

  .error-close:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    .error-notification {
      top: 0.5rem;
      right: 0.5rem;
      left: 0.5rem;
      max-width: none;
      transform: translateY(-100%);
    }

    .error-notification.show {
      transform: translateY(0);
    }
  }
</style> 