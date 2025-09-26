<script>
  let { 
    min = 0, 
    max = 100, 
    value = $bindable(50),
    step = 1,
    disabled = false,
    id = undefined,
    onchange = undefined,
    label = '',
    showValue = true,
    ariaLabel = undefined,
    ariaLabelledBy = undefined,
    ariaDescribedBy = undefined
  } = $props();

  // Generate unique IDs if not provided
  const uniqueId = id || `range-slider-${Math.random().toString(36).substr(2, 9)}`;
  const descriptionId = `${uniqueId}-description`;
  const valueId = `${uniqueId}-value`;

  // Calculate progress percentage for visual feedback
  const progressPercentage = $derived(
    ((value - min) / (max - min)) * 100
  );

  const handleInput = (event) => {
    const newValue = parseInt(event.target.value);
    value = newValue;
    if (onchange) {
      onchange({ detail: { value: newValue } });
    }
  };

  const handleKeyDown = (event) => {
    let newValue = value;
    const stepSize = step || 1;
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        newValue = Math.max(min, value - stepSize);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        newValue = Math.min(max, value + stepSize);
        break;
      case 'Home':
        event.preventDefault();
        newValue = min;
        break;
      case 'End':
        event.preventDefault();
        newValue = max;
        break;
      case 'PageDown':
        event.preventDefault();
        newValue = Math.max(min, value - stepSize * 10);
        break;
      case 'PageUp':
        event.preventDefault();
        newValue = Math.min(max, value + stepSize * 10);
        break;
      default:
        return; 
    }
    
    if (newValue !== value) {
      value = newValue;
      if (onchange) {
        onchange({ detail: { value: newValue } });
      }
    }
  };

  let sliderElement;

  // Watch for value changes and dispatch events
  $effect(() => {
    if (sliderElement) {
      const event = new CustomEvent('change', { 
        detail: { value }
      });
      sliderElement.dispatchEvent(event);
    }
  });

  // Update CSS custom property for progress visualization
  $effect(() => {
    if (sliderElement) {
      sliderElement.style.setProperty('--progress', `${progressPercentage}%`);
    }
  });
</script>

<div class="w-full">
  {#if label}
    <label 
      class="block text-sm font-medium text-gray-700 mb-2" 
      for={uniqueId}
      id="{uniqueId}-label"
    >
      {label}
      {#if showValue}
        <span 
          class="ml-2 text-blue-600 font-semibold"
          id={valueId}
          aria-live="polite"
        >
          {value}
        </span>
      {/if}
    </label>
  {/if}
  
  <div class="relative">
    <input
      bind:this={sliderElement}
      type="range"
      {min}
      {max}
      {step}
      {value}
      {disabled}
      id={uniqueId}
      oninput={handleInput}
      onkeydown={handleKeyDown}
      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
      aria-label={ariaLabel || (label ? undefined : `Slider with minimum ${min}, maximum ${max}, current value ${value}`)}
      aria-labelledby={ariaLabelledBy || (label ? `${uniqueId}-label` : undefined)}
      aria-describedby={ariaDescribedBy || descriptionId}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext="{value} out of {max}"
      aria-orientation="horizontal"

      tabindex={disabled ? -1 : 0}
    />
    
    <!-- Min/max labels -->
    <div class="flex justify-between text-xs text-gray-500 mt-1">
      <span aria-label="Minimum value">{min}</span>
      <span aria-label="Maximum value">{max}</span>
    </div>
  </div>

  <!-- Screen reader description -->
  <div id={descriptionId} class="sr-only">
    Range slider. Use arrow keys to adjust value. Home and End keys go to minimum and maximum values. Page Up and Page Down keys adjust by larger increments.
  </div>
</div>

<style>
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: background-color 0.2s ease, transform 0.1s ease;
  }

  .slider::-webkit-slider-thumb:hover:not(:disabled) {
    background: #2563eb;
    transform: scale(1.1);
  }

  .slider:focus::-webkit-slider-thumb {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(59, 130, 246, 0.3);
  }

  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: background-color 0.2s ease, transform 0.1s ease;
  }

  .slider::-moz-range-thumb:hover:not(:disabled) {
    background: #2563eb;
    transform: scale(1.1);
  }

  .slider:focus::-moz-range-thumb {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(59, 130, 246, 0.3);
  }

  .slider::-webkit-slider-track {
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(to right, #3b82f6 0%, #3b82f6 var(--progress, 0%), #e5e7eb var(--progress, 0%), #e5e7eb 100%);
  }

  .slider::-moz-range-track {
    height: 8px;
    border-radius: 4px;
    background: #e5e7eb;
  }

  .slider::-moz-range-progress {
    height: 8px;
    border-radius: 4px;
    background: #3b82f6;
  }

  .slider:disabled::-webkit-slider-thumb,
  .slider:disabled::-moz-range-thumb {
    cursor: not-allowed;
    background: #9ca3af;
  }

  .slider:disabled::-webkit-slider-thumb:hover,
  .slider:disabled::-moz-range-thumb:hover {
    transform: none;
    background: #9ca3af;
  }

  /* Screen reader only utility class */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
