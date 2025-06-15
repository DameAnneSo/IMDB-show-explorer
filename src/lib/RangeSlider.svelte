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
    showValue = true
  } = $props();

  const handleInput = (event) => {
    value = parseInt(event.target.value);
    if (onchange) {
      onchange({ detail: { value } });
    }
  };

  const dispatchChangeEvent = (newValue) => {
    const event = new CustomEvent('change', { 
      detail: { value: newValue }
    });
    if (sliderElement) {
      sliderElement.dispatchEvent(event);
    }
  };

  let sliderElement;

  // Watch for value changes and dispatch events
  $effect(() => {
    dispatchChangeEvent(value);
  });
</script>

<div class="w-full">
  {#if label}
    <label class="block text-sm font-medium text-gray-700 mb-2" for={id}>
      {label}
      {#if showValue}
        <span class="ml-2 text-blue-600 font-semibold">{value}</span>
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
      {id}
      oninput={handleInput}
      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
    />
    
    <!-- Min/max labels -->
    <div class="flex justify-between text-xs text-gray-500 mt-1">
      <span>{min}</span>
      <span>{max}</span>
    </div>
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
  }

  .slider::-webkit-slider-thumb:hover {
    background: #2563eb;
    transform: scale(1.1);
  }

  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .slider::-moz-range-thumb:hover {
    background: #2563eb;
    transform: scale(1.1);
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
</style>
