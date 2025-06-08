<script>
  const dispatchChangeEvent = (selectedValues) => {
    const event = new CustomEvent('change', { 
      detail: { selected: selectedValues }
    });
    containerElement.dispatchEvent(event);
  }

  let { 
    options = [], 
    placeholder = 'Select items...',
    maxHeight = '250px',
    disabled = false,
    selectedValues = $bindable([]),
    onchange = undefined,
    id = undefined,
    showClearButton = true // Clear button visibility
  } = $props();
  
  // Internal state
  let isOpen = $state(false);
  let inputValue = $state('');
  let inputElement;
  let containerElement;
  let filteredOptions = $derived(
    options.filter(opt => {
      // Don't show already selected options
      if (selectedValues.includes(opt)) return false;
      
      // Filter by input text if there is any
      if (inputValue) {
        return opt.toLowerCase().includes(inputValue.toLowerCase());
      }
      
      // When dropdown is open with no input, show all unselected options
      return isOpen;
    })
  );
  
  // Handle clicking outside to close dropdown
  const handleClickOutside = (event) => {
    if (containerElement && !containerElement.contains(event.target)) {
      isOpen = false;
    }
  }
  
  // Set up click outside listener with cleanup
  $effect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  });

  const toggleDropdown = () => {
    if (!disabled) {
      isOpen = !isOpen;
      if (isOpen) {
        // Focus the input when opening dropdown
        setTimeout(() => inputElement?.focus(), 0);
      }
    }
  }

  const selectOption = (option) => {
    if (!selectedValues.includes(option)) {
      selectedValues = [...selectedValues, option];
      inputValue = '';
      // Keep dropdown open after selection
      isOpen = true;
      // Dispatch custom event
      dispatchChangeEvent(selectedValues);
      if (onchange) {
        onchange({ detail: { selected: selectedValues } });
      }
      // Focus input after selection to continue typing
      setTimeout(() => inputElement?.focus(), 0);
    }
  }
  
  const removeOption = (option) => {
    selectedValues = selectedValues.filter(item => item !== option);
    // Dispatch custom event
    dispatchChangeEvent(selectedValues);
    if (onchange) {
      onchange({ detail: { selected: selectedValues } });
    }
  }

  const clearAll = () => {
    selectedValues = [];
    inputValue = '';
    // Dispatch custom event
    dispatchChangeEvent(selectedValues);
    if (onchange) {
      onchange({ detail: { selected: selectedValues } });
    }
  }

  const handleKeydown = (event) => {
    if (event.key === 'Enter' && inputValue && filteredOptions.length > 0) {
      selectOption(filteredOptions[0]);
      event.preventDefault();
    } else if (event.key === 'Escape') {
      isOpen = false;
    } else if (event.key === 'Backspace' && !inputValue && selectedValues.length > 0) {
      removeOption(selectedValues[selectedValues.length - 1]);
    } else {
      // For all other keys, ensure the dropdown is open while typing
      if (!isOpen && event.key.length === 1) {
        isOpen = true;
      }
    }
  }
  
  // Add keyboard support for container
  const handleContainerKeydown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleDropdown();
      event.preventDefault();
    }
  }
  
  // Also open dropdown when input gets focus
  const handleFocus = () => {
    if (!isOpen) {
      isOpen = true;
    }
  }
</script>

<div 
  class="relative w-full" 
  bind:this={containerElement}
  {id}
>
  <div 
    class="flex flex-wrap items-center min-h-10 w-full px-3 py-2 border rounded-md bg-white {isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'} {disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-text'}"
    onclick={toggleDropdown}
    onkeydown={handleContainerKeydown}
    role="combobox"
    aria-expanded={isOpen}
    aria-haspopup="listbox"
    aria-owns="options-listbox"
    aria-controls="options-listbox"
    tabindex={disabled ? -1 : 0}
  >
    {#each selectedValues as item (item)}
      <div class="flex items-center bg-blue-100 text-blue-800 rounded-md px-2 py-1 m-1 text-sm">
        <span>{item}</span>
        <button 
          type="button"
          class="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
          onclick={(e) => { e.stopPropagation(); removeOption(item); }}
          aria-label={`Remove ${item}`}
          disabled={disabled}
        >
          &times;
        </button>
      </div>
    {/each}
    
    <div class="flex items-center flex-grow">
      <input 
        type="text"
        bind:this={inputElement}
        bind:value={inputValue}
        onkeydown={handleKeydown}
        onfocus={handleFocus}
        placeholder={selectedValues.length === 0 ? placeholder : ''}
        class="flex-grow outline-none px-1 py-1 min-w-[50px] bg-transparent {disabled ? 'cursor-not-allowed' : ''}"
        disabled={disabled}
        aria-autocomplete="list"
      />
      
      {#if showClearButton && selectedValues.length > 0 && !disabled}
        <button
          type="button"
          class="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none flex-shrink-0"
          onclick={(e) => { e.stopPropagation(); clearAll(); }}
          aria-label="Clear all selections"
          title="Clear all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      {/if}
    </div>
  </div>
  
  {#if isOpen && filteredOptions.length > 0}
    <div 
      id="options-listbox"
      class="absolute z-10 w-full mt-1 max-h-[{maxHeight}] overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg"
      role="listbox"
    >
      {#each filteredOptions as option (option)}
        <div 
          class="px-4 py-2 hover:bg-blue-50 cursor-pointer"
          onclick={(e) => { e.stopPropagation(); selectOption(option); }}
          onkeydown={(e) => e.key === 'Enter' && selectOption(option)}
          role="option"
          aria-selected="false"
          tabindex="0"
        >
          {option}
        </div>
      {/each}
    </div>
  {/if}
</div>
