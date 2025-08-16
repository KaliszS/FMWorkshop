<script lang="ts">
  import RadioGroup from './config-option/RadioGroup.svelte';
  import SelectInput from './config-option/SelectInput.svelte';
  import TextInput from './config-option/TextInput.svelte';
  import FileInput from './config-option/FileInput.svelte';
  import FolderInput from './config-option/FolderInput.svelte';
  import { ConfigOptionType } from '$lib/types';

  let {
    label,
    required,
    hint,
    type,
    options = [],
    placeholder = "",
    value = $bindable(),
    error = "",
    pathMapping = [],
    onCustomPath = undefined,
  }: {
    label: string;
    required: boolean;
    hint: string;
    type: ConfigOptionType;
    options?: string[];
    placeholder?: string;
    value: string;
    error?: string;
    pathMapping?: Array<{ label: string; path: string }>;
    onCustomPath?: (path: string) => void;
  } = $props();

  // Generate a unique id for the input
  const id = `config-option-${label.toLowerCase().replace(/\s+/g, '-')}`;
</script>

<div class="config-option">
  <label class="label" for={id}>
    {label}
    {#if required}
      <span class="required">*</span>
    {/if}
  </label>
  
  {#if hint}
    <p class="hint">{hint}</p>
  {/if}

  <div class="field-container">
    {#if error}
      <span class="error-icon-wrapper" aria-label="Error: {error}">
        <span class="error-icon">&#9888;</span>
        <span class="error-tooltip">{error}</span>
      </span>
    {/if}
    
    <div class="input-wrapper">
      {#if type === ConfigOptionType.Radio}
        <RadioGroup {label} {options} bind:value={value} />
      {:else if type === ConfigOptionType.Select}
        <SelectInput {options} bind:value={value} {placeholder} />
      {:else if type === ConfigOptionType.Input}
        <TextInput bind:value={value} {placeholder}/>
      {:else if type === ConfigOptionType.File}
        <FileInput bind:value={value}/>
      {:else if type === ConfigOptionType.Folder}
        <FolderInput bind:value={value} {placeholder} label={label} {options} {pathMapping} {onCustomPath} />
      {/if}
    </div>
  </div>
</div>

<style>
  .config-option {
    margin-bottom: 1rem;
    position: relative;
  }
  .label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
    font-size: 0.9rem;
  }
  .required {
    color: #e74c3c;
  }
  .hint {
    font-size: 0.8rem;
    color: #666;
    margin: 0.25rem 0 0.5rem 0;
    font-style: italic;
  }
  .field-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .input-wrapper {
    flex: 1;
    min-width: 0;
  }
  .error-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    position: relative;
    cursor: pointer;
    outline: none;
    flex-shrink: 0;
  }
  .error-icon {
    color: #e74c3c;
    font-size: 1.1em;
    user-select: none;
  }
  .error-tooltip {
    display: none;
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    background: #e74c3c;
    color: #fff;
    padding: 0.5em 1em;
    border-radius: 6px;
    font-size: 0.92rem;
    font-weight: 400;
    white-space: pre-line;
    z-index: 10;
    min-width: 180px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    margin-left: 8px;
  }
  .error-tooltip::after {
    content: '';
    position: absolute;
    top: 50%;
    left: -5px;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-right-color: #e74c3c;
  }
  .error-icon-wrapper:hover .error-tooltip,
  .error-icon-wrapper:focus .error-tooltip {
    display: block;
  }
  @media (prefers-color-scheme: dark) {
    .label {
      color: #f6f6f6;
    }
    .hint {
      color: #ccc;
    }
    .error-tooltip {
      background: #c53030;
      color: #fff;
    }
  }
</style> 