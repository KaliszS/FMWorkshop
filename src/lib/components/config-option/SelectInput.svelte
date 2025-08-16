<script lang="ts">
  let {options = [], value = $bindable(), placeholder = ""}: {
    options?: Array<string | { label: string; path: string }>; value: string; placeholder?: string
  } = $props();
</script>

<select 
  class="input" 
  bind:value={value} 
  onchange={(e) => {
    const target = e.target as HTMLSelectElement;
    const selectedLabel = target.value;
    if (selectedLabel) {
      // Find the corresponding path for this label
      const option = options.find(opt => 
        typeof opt === 'string' ? opt === selectedLabel : opt.label === selectedLabel
      );
      if (option && typeof option === 'object') {
        value = option.path;
      }
    }
  }}
>
  <option value="">{placeholder}</option>
  {#each options as option}
    {#if typeof option === 'string'}
      <option value={option}>{option}</option>
    {:else}
      <option value={option.label}>{option.label}</option>
    {/if}
  {/each}
</select> 

<style>
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
  @media (prefers-color-scheme: dark) {
    .input {
      background-color: #2a2a2a;
      border-color: #444;
      color: #f6f6f6;
    }
    .input:focus {
      border-color: #667eea;
    }
  }
</style>