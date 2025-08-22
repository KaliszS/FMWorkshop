<script lang="ts">
  import { loadFile } from "$lib/api";
  import { CONFIG_STRINGS } from "$lib/strings";

  let { 
    value = $bindable(), 
    placeholder = '', 
    label = CONFIG_STRINGS.FOLDER_INPUT.SELECT_FOLDER, 
    options = [],
    pathMapping = [],
    onCustomPath = undefined
  }: {
    value: string; 
    placeholder?: string; 
    label?: string; 
    options?: string[];
    pathMapping?: Array<{ label: string; path: string }>;
    onCustomPath?: (path: string) => void;
  } = $props();
  
  const inputId = `folder-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  async function selectDirectory() {
    let path = await loadFile(true);
    if (path) {
      if (label === CONFIG_STRINGS.FOLDER_INPUT.RETRO_REGENS_FOLDER && onCustomPath) {
        onCustomPath(path);
      } else {
        value = path;
      }
    }
  }

  function handleDropdownChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const selectedLabel = target.value;
    
    if (selectedLabel && label === CONFIG_STRINGS.FOLDER_INPUT.RETRO_REGENS_FOLDER) {
      const mapping = pathMapping.find(m => m.label === selectedLabel);
      if (mapping) {
        value = mapping.path;
      }
    }
  }
  
  let currentSelectedLabel = $derived(() => {
    if (label === CONFIG_STRINGS.FOLDER_INPUT.RETRO_REGENS_FOLDER && value) {
      const mapping = pathMapping.find(m => m.path === value);
      return mapping ? mapping.label : '';
    }
    return '';
  });
</script>

<div class="folder-input">
  <label for={inputId} class="visually-hidden">{label}</label>
  
  <input
    id={inputId}
    type="text"
    class="input {options && options.length > 0 ? 'has-options' : ''}"
    placeholder={placeholder}
    bind:value={value}
    readonly
    aria-labelledby={inputId}
  />
  {#if options && options.length > 0}
    <select 
      class="input dropdown-overlay"
      value={currentSelectedLabel()}
      onchange={handleDropdownChange}
    >
      <option value="">{placeholder || CONFIG_STRINGS.FOLDER_INPUT.SELECT_OPTION_OR_BROWSE}</option>
      {#each options as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  {/if}
  <button type="button" class="browse-btn" onclick={selectDirectory}>{CONFIG_STRINGS.FOLDER_INPUT.BROWSE}</button>
</div>

<style>
  .folder-input {
    display: flex;
    gap: 0.5rem;
    position: relative;
  }
  .input {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
    background-color: #2a2a2a;
    border-color: #444;
    color: #f6f6f6;
    transition: all 0.2s ease;
    cursor: pointer;
    appearance: none;
    background-repeat: no-repeat;
    background-position: right 0.7rem center;
    background-size: 1.2em;
    padding-right: 0.6rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  .input.has-options {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23667eea' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
    padding-right: 2.5rem;
  }
  
  .dropdown-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 80px); /* Leave space for the Browse button */
    height: 100%;
    opacity: 0;
    cursor: pointer;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23667eea' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.7rem center;
    background-size: 1.2em;
    padding-right: 2.5rem;
  }
  .input:hover {
    background-color: #3a3a3a;
    border-color: #667eea;
    box-shadow: 0 2px 6px rgba(102, 126, 234, 0.2);
  }
  .input:focus {
    outline: none;
    border-color: #667eea;
    background-color: #3a3a3a;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  select.input {
    background-color: #2a2a2a;
  }
  select.input:hover {
    background-color: #3a3a3a;
  }
  select.input:focus {
    background-color: #3a3a3a;
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