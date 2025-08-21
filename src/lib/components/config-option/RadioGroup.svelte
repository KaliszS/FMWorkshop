<script lang="ts">
  let {label, options = [], value = $bindable(), descriptions = []}: {
    label: string; 
    options?: Array<string | { label: string; path: string }>; 
    value: String;
    descriptions?: string[];
  } = $props();

  function handleRadioClick(optionValue: string) {
    if (value === optionValue) {
      // If clicking on already selected option, deselect it
      value = "";
    } else {
      // Otherwise select the new option
      value = optionValue;
    }
  }
</script>

<div class="radio-group">
  {#each options as option, index}
    {@const optionValue = typeof option === 'string' ? option : option.label}
    {@const isSelected = value === optionValue}
    {@const description = descriptions[index] || ""}
    
    <label class="radio-option" class:selected={isSelected}>
      <input 
        type="radio" 
        name={label.toLowerCase().replace(/\s+/g, '-')}
        value={optionValue}
        checked={isSelected}
        onchange={() => handleRadioClick(optionValue)}
      />
      <span class="radio-custom"></span>
      <span class="radio-label">{optionValue}</span>
      {#if description}
        <div class="tooltip-container">
          <span class="tooltip-icon">ⓘ</span>
          <div class="tooltip">{description}</div>
        </div>
      {/if}
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
    padding: 0.25rem;
    border-radius: 0.375rem;
    transition: background-color 0.2s ease;
    position: relative;
  }
  .radio-option:hover {
    background-color: #f8f9fa;
  }
  .radio-option.selected {
    background-color: #e8f0fe;
    border: 0.0625rem solid #667eea;
  }
  .radio-option input[type="radio"] {
    display: none;
  }
  .radio-custom {
    width: 1rem;
    height: 1rem;
    border: 0.125rem solid #ddd;
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
    width: 0.375rem;
    height: 0.375rem;
    background-color: white;
    border-radius: 50%;
  }
  .radio-label {
    font-size: 0.875rem;
    color: #333;
  }
  .tooltip-icon {
    color: #667eea;
    font-size: 0.75rem;
    cursor: help;
    margin-left: 0.25rem;
  }
  
  .tooltip-container {
    position: relative;
    display: inline-block;
  }
  
  .tooltip {
    visibility: hidden;
    width: 20rem;
    background-color: #333;
    color: #fff;
    text-align: left;
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    position: absolute;
    z-index: 1000;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.875rem;
    line-height: 1.4;
    box-shadow: 0 0.125rem 0.5rem rgba(0,0,0,0.3);
    white-space: normal;
  }
  
  .tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -0.25rem;
    border-width: 0.25rem;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }
  
  .tooltip-container:hover .tooltip {
    visibility: visible;
  }
  @media (prefers-color-scheme: dark) {
    .radio-option:hover {
      background-color: #333;
    }
    .radio-option.selected {
      background-color: #2a2a2a;
      border-color: #2a2a2a;
    }
    .radio-label {
      color: #f6f6f6;
    }
    .tooltip {
      background-color: #f6f6f6;
      color: #333;
    }
    .tooltip::after {
      border-color: #f6f6f6 transparent transparent transparent;
    }
  }
</style> 