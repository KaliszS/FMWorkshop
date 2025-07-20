<script lang="ts">
  let {options = [], value = $bindable(), placeholder = ""}: {
    options?: string[]; value: string; placeholder?: string
  } = $props();
</script>

<select 
  class="input" 
  bind:value={value} 
>
  <option value="">{placeholder}</option>
  {#each options as option}
    <option value={option}>{option}</option>
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