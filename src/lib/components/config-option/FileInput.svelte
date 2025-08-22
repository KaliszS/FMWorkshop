<script lang="ts">
  import { loadFile } from "$lib/api";
  import { CONFIG_STRINGS } from "$lib/strings";

  let {value = $bindable()}: {
    value: string
  } = $props();

  async function selectFile() {
    let path = await loadFile(false);
    if (path) {
      if (path.endsWith('.zip') || path.endsWith('.rar')) {
        value = path;
      } else {
        value = "";
      }
      value = path;
    }
  }
</script>

<div class="file-input-container">
  <button type="button" class="file-label" onclick={selectFile}>
    <span class="file-icon">📁</span>
    <span class="file-text">{value ? value : CONFIG_STRINGS.FILE_INPUT.CHOOSE_FILE}</span>
  </button>
</div>

<style>
  .file-input-container {
    position: relative;
  }
  .file-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    background-color: #fff;
    cursor: pointer;
    transition: border-color 0.2s ease;
    font-size: 0.9rem;
  }
  .file-label:hover {
    border-color: #667eea;
  }
  .file-icon {
    font-size: 1rem;
  }
  .file-text {
    color: #666;
  }
  .file-error {
    color: #e74c3c;
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }
  @media (prefers-color-scheme: dark) {
    .file-label {
      background-color: #2a2a2a;
      border-color: #444;
      color: #f6f6f6;
    }
    .file-text {
      color: #ccc;
    }
  }
</style>