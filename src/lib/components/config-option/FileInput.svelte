<script lang="ts">
  let {label, value, onValueChange}: {
    label: string; value: string; onValueChange: (value: string) => void
  } = $props();

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      onValueChange(target.files[0].name);
    }
  }
</script>

<div class="file-input-container">
  <input 
    type="file" 
    class="file-input" 
    accept=".zip"
    onchange={handleFileChange}
    id="file-input-{label.toLowerCase().replace(/\s+/g, '-')}"
  />
  <label for="file-input-{label.toLowerCase().replace(/\s+/g, '-')}" class="file-label">
    <span class="file-icon">📁</span>
    <span class="file-text">
      {value ? value : 'Choose ZIP file'}
    </span>
  </label>
</div> 

<style>
  .file-input-container {
    position: relative;
  }
  .file-input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
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
    .file-label {
      background-color: #2a2a2a;
      border-color: #444;
      color: #f6f6f6;
    }
    .file-text {
      color: #ccc;
    }
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