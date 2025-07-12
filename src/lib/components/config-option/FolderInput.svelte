<script lang="ts">
  import { onMount } from 'svelte';
  let { value, placeholder = '', onValueChange, label = 'Select folder' }: {
    value: string; placeholder?: string; onValueChange: (value: string) => void; label?: string
  } = $props();
  
  let fileInputEl: HTMLInputElement | null = null;
  const inputId = `folder-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  let isTauri = false;
  onMount(() => {
    // Tauri injects a global window.__TAURI__
    isTauri = typeof window !== 'undefined' && '__TAURI__' in window;
  });

  async function triggerBrowse() {
    if (isTauri) {
      // Dynamically import to avoid errors in browser
      const { open } = await import('@tauri-apps/plugin-dialog');
      const selected = await open({ directory: true });
      if (typeof selected === 'string') {
        onValueChange(selected);
      }
    } else {
      fileInputEl?.click();
    }
  }

  function handleFolderChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      // Try to get the folder name from the first file's relative path
      const firstFile = target.files[0];
      // @ts-ignore
      const fullPath = firstFile.webkitRelativePath || firstFile.name;
      const folderPath = fullPath.split('/')[0];
      onValueChange(folderPath);
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
    value={value} 
    readonly
    aria-labelledby={inputId}
  />
  <input
    type="file"
    style="display: none;"
    bind:this={fileInputEl}
    webkitdirectory
    onchange={handleFolderChange}
    aria-labelledby={inputId}
  />
  <button type="button" class="browse-btn" onclick={triggerBrowse}>Browse</button>
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