<script lang="ts">
  let { message = "", onClose = undefined }: {
    message: string;
    onClose?: () => void;
  } = $props();

  let isVisible = $derived(message && message.trim() !== "");
</script>

{#if isVisible}
  <div class="success-notification" class:show={isVisible}>
    <div class="success-content">
      <div class="success-icon">✅</div>
      <div class="success-message">
        <h3 class="success-title">Success</h3>
        <p class="success-text">{message}</p>
      </div>
      {#if onClose}
        <button class="success-close" onclick={onClose} aria-label="Close success message">
          ×
        </button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .success-notification {
    position: fixed;
    top: 1rem;
    right: 1rem;
    max-width: 25rem;
    background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
    color: white;
    border-radius: 0.75rem;
    box-shadow: 0 0.5rem 1.5rem rgba(81, 207, 102, 0.3);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }

  .success-notification.show {
    transform: translateX(0);
  }

  .success-content {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
  }

  .success-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .success-message {
    flex: 1;
    min-width: 0;
  }

  .success-title {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .success-text {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.4;
    opacity: 0.95;
  }

  .success-close {
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

  .success-close:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    .success-notification {
      top: 0.5rem;
      right: 0.5rem;
      left: 0.5rem;
      max-width: none;
      transform: translateY(-100%);
    }

    .success-notification.show {
      transform: translateY(0);
    }
  }
</style> 