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
  }: {
    label: string;
    required: boolean;
    hint: string;
    type: ConfigOptionType;
    options?: Array<string>;
    placeholder?: string;
    value: string;
    error?: string;
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

  {#if error}
    <span class="error-icon-wrapper" aria-label="Error: {error}">
      <span class="error-icon">&#9888;</span>
      <span class="error-tooltip">{error}</span>
    </span>
  {/if}

  {#if type === ConfigOptionType.Radio}
    <RadioGroup {label} {options} bind:value={value} />
  {:else if type === ConfigOptionType.Select}
    <SelectInput {options} bind:value={value} {placeholder} />
  {:else if type === ConfigOptionType.Input}
    <TextInput bind:value={value} {placeholder}/>
  {:else if type === ConfigOptionType.File}
    <FileInput bind:value={value}/>
  {:else if type === ConfigOptionType.Folder}
    <FolderInput bind:value={value} {placeholder} label={label} />
  {/if}
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
  .error-icon-wrapper {
    display: inline-block;
    position: relative;
    margin-left: 0.5em;
    vertical-align: middle;
    cursor: pointer;
    outline: none;
  }
  .error-icon {
    color: #e74c3c;
    font-size: 1.1em;
    vertical-align: middle;
    user-select: none;
  }
  .error-tooltip {
    display: none;
    position: absolute;
    left: 120%;
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