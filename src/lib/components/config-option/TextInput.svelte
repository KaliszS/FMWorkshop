<script lang="ts">
  let {value = $bindable(), placeholder = ""}: {
    value: string, placeholder?: string
  } = $props();
</script>

<input 
  type="text" 
  class="input" 
  placeholder={placeholder}
  bind:value={value} 
/> 

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