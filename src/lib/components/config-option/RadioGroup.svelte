<script lang="ts">
  let {label, options = [], value = $bindable()}: {
    label: string; options?: Array<string | { label: string; path: string }>; value: String
  } = $props();
</script>

<div class="radio-group">
  {#each options as option}
    <label class="radio-option">
      <input 
        type="radio" 
        name={label.toLowerCase().replace(/\s+/g, '-')}
        bind:group={value}
        value={typeof option === 'string' ? option : option.label}
        checked={value === (typeof option === 'string' ? option : option.label)}
      />
      <span class="radio-custom"></span>
      <span class="radio-label">{typeof option === 'string' ? option : option.label}</span>
    </label>
  {/each}
</div>

<style>
  .radio-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .radio-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background-color 0.2s ease;
  }
  .radio-option:hover {
    background-color: #f8f9fa;
  }
  .radio-option input[type="radio"] {
    display: none;
  }
  .radio-custom {
    width: 16px;
    height: 16px;
    border: 2px solid #ddd;
    border-radius: 50%;
    position: relative;
    transition: all 0.2s ease;
  }
  .radio-option input[type="radio"]:checked + .radio-custom {
    border-color: #667eea;
    background-color: #667eea;
  }
  .radio-option input[type="radio"]:checked + .radio-custom::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background-color: white;
    border-radius: 50%;
  }
  .radio-label {
    font-size: 0.9rem;
    color: #333;
  }
  @media (prefers-color-scheme: dark) {
    .radio-option:hover {
      background-color: #333;
    }
    .radio-label {
      color: #f6f6f6;
    }
  }
</style> 