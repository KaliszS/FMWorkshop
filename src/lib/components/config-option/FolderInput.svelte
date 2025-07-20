<script lang="ts">
  import { loadFile } from "$lib/api";

  let { value = $bindable(), placeholder = '', label = 'Select folder' }: {
    value: string; placeholder?: string; label?: string
  } = $props();
  
  const inputId = `folder-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  async function selectDirectory() {
    let path = await loadFile(true);
    if (path) {
      value = path;
    }
  }
</script>

<div class="folder-input">
  <label for={inputId} class="visually-hidden">{label}</label>
  <input
    id={inputId}
    type="text"
    class="input"
    placeholder={placeholder}
    bind:value={value}
    readonly
    aria-labelledby={inputId}
  />
  <button type="button" class="browse-btn" onclick={selectDirectory}>Browse</button>
</div>

<style>
  .folder-input {
    display: flex;
    gap: 0.5rem;
  }
  .input {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
    background-color: #fff;
    transition: border-color 0.2s ease;
  }
  .input:focus {
    outline: none;
    border-color: #667eea;
  }
  .folder-input .input {
    flex: 1;
  }
  .browse-btn {
    padding: 0.6rem 1rem;
    background-color: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
  }
  .browse-btn:hover {
    background-color: #5a6fd8;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  @media (prefers-color-scheme: dark) {
    .input {
      background-color: #2a2a2a;
      border-color: #444;
      color: #f6f6f6;
    }
    .input:focus {
      border-color: #667eea;
    }
    .browse-btn {
      background-color: #667eea;
      color: #f6f6f6;
    }
    .browse-btn:hover {
      background-color: #5a6fd8;
    }
  }
</style>