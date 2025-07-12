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
    value,
    onValueChange
  }: {
    label: string;
    required: boolean;
    hint: string;
    type: ConfigOptionType;
    options?: Array<string>;
    placeholder?: string;
    value: string;
    onValueChange: (value: string) => void;
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

  {#if type === ConfigOptionType.Radio}
    <RadioGroup {label} {options} {value} {onValueChange} />
  {:else if type === ConfigOptionType.Select}
    <SelectInput {options} {value} {placeholder} {onValueChange} />
  {:else if type === ConfigOptionType.Input}
    <TextInput {value} {placeholder} {onValueChange} />
  {:else if type === ConfigOptionType.File}
    <FileInput {label} {value} {onValueChange}/>
  {:else if type === ConfigOptionType.Folder}
    <FolderInput {value} {placeholder} {onValueChange} label={label} />
  {/if}
</div>

<style>
  .config-option {
    margin-bottom: 1rem;
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

  @media (prefers-color-scheme: dark) {
    .label {
      color: #f6f6f6;
    }

    .hint {
      color: #ccc;
    }

  }
</style> 