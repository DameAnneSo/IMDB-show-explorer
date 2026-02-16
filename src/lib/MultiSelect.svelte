<script>
  const dispatchChangeEvent = (selectedValues) => {
    const event = new CustomEvent('change', {
      detail: { selected: selectedValues },
    });
    containerElement.dispatchEvent(event);
  };

  let {
    options = [],
    placeholder = 'Select items...',
    maxHeight = '250px',
    disabled = false,
    selectedValues = $bindable([]),
    onchange = undefined,
    id = undefined,
    showClearButton = true,
    label = '', // For screen readers when no visible label
  } = $props();

  // Internal state
  let isOpen = $state(false);
  let inputValue = $state('');
  let inputElement;
  let containerElement;
  let listboxElement = $state();
  let activeDescendant = $state(null);
  let focusedOptionIndex = $state(-1);
  let focusedOnSelectAll = $state(false);
  let isToggling = false;

  const filteredOptions = $derived(
    options.filter((opt) => {
      // Don't show already selected options
      if (selectedValues.includes(opt)) return false;

      // Filter by input text if there is any
      if (inputValue) {
        return opt.toLowerCase().includes(inputValue.toLowerCase());
      }

      // When dropdown is open with no input, show all unselected options
      return isOpen;
    }),
  );

  // Reset focused option index when filtered options change
  $effect(() => {
    if (filteredOptions.length === 0) {
      focusedOptionIndex = -1;
      focusedOnSelectAll = false;
      activeDescendant = null;
    } else if (focusedOptionIndex >= filteredOptions.length) {
      focusedOptionIndex = filteredOptions.length - 1;
      focusedOnSelectAll = false;
      activeDescendant = `option-${filteredOptions[focusedOptionIndex]}`;
    }
  });

  // Handle clicking outside to close dropdown
  const handleClickOutside = (event) => {
    if (containerElement && !containerElement.contains(event.target)) {
      isOpen = false;
      focusedOptionIndex = -1;
      focusedOnSelectAll = false;
      activeDescendant = null;
    }
  };

  // Set up click outside listener with cleanup
  $effect(() => {
    if (isOpen) {
      // Use setTimeout to delay listener attachment until after the current click event completes
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  });

  const toggleDropdown = (event) => {
    if (!disabled) {
      event?.stopPropagation();
      isToggling = true;
      isOpen = !isOpen;
      if (isOpen) {
        focusedOptionIndex = -1;
        focusedOnSelectAll = false;
        activeDescendant = null;
        // Focus the input when opening dropdown
        setTimeout(() => {
          inputElement?.focus();
          isToggling = false;
        }, 0);
      } else {
        focusedOptionIndex = -1;
        focusedOnSelectAll = false;
        activeDescendant = null;
        setTimeout(() => {
          isToggling = false;
        }, 0);
      }
    }
  };

  const selectOption = (option) => {
    if (!selectedValues.includes(option)) {
      selectedValues = [...selectedValues, option];
      inputValue = '';
      // Keep dropdown open after selection
      isOpen = true;
      focusedOptionIndex = -1;
      focusedOnSelectAll = false;
      activeDescendant = null;
      // Dispatch custom event
      dispatchChangeEvent(selectedValues);
      if (onchange) {
        onchange({ detail: { selected: selectedValues } });
      }
      // Focus input after selection to continue typing
      setTimeout(() => inputElement?.focus(), 0);

      // Announce selection to screen readers
      announceToScreenReader(`${option} selected. ${selectedValues.length} items selected.`);
    }
  };

  const removeOption = (option) => {
    selectedValues = selectedValues.filter((item) => item !== option);
    // Dispatch custom event
    dispatchChangeEvent(selectedValues);
    if (onchange) {
      onchange({ detail: { selected: selectedValues } });
    }

    // Announce removal to screen readers
    announceToScreenReader(`${option} removed. ${selectedValues.length} items selected.`);
  };

  const clearAll = () => {
    const clearedCount = selectedValues.length;
    selectedValues = [];
    inputValue = '';
    focusedOptionIndex = -1;
    focusedOnSelectAll = false;
    activeDescendant = null;
    // Dispatch custom event
    dispatchChangeEvent(selectedValues);
    if (onchange) {
      onchange({ detail: { selected: selectedValues } });
    }

    // Announce to screen readers
    announceToScreenReader(`All ${clearedCount} items cleared.`);
  };

  const selectAll = () => {
    // Select all available options that aren't already selected
    const unselectedOptions = options.filter((opt) => !selectedValues.includes(opt));
    const newSelections = unselectedOptions.length;
    selectedValues = [...selectedValues, ...unselectedOptions];
    inputValue = '';
    focusedOptionIndex = -1;
    focusedOnSelectAll = false;
    activeDescendant = null;
    // Keep dropdown open after selection
    isOpen = true;
    // Dispatch custom event
    dispatchChangeEvent(selectedValues);
    if (onchange) {
      onchange({ detail: { selected: selectedValues } });
    }
    // Focus input after selection
    setTimeout(() => inputElement?.focus(), 0);

    // Announce to screen readers
    announceToScreenReader(
      `${newSelections} items selected. ${selectedValues.length} total items selected.`,
    );
  };

  const handleKeydown = (event) => {
    const hasSelectAll = !inputValue && options.length > selectedValues.length;

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (focusedOnSelectAll && hasSelectAll) {
          selectAll();
        } else if (focusedOptionIndex >= 0 && focusedOptionIndex < filteredOptions.length) {
          selectOption(filteredOptions[focusedOptionIndex]);
        } else if (inputValue && filteredOptions.length > 0) {
          selectOption(filteredOptions[0]);
        } else if (!isOpen) {
          isOpen = true;
        }
        break;

      case 'Escape':
        event.preventDefault();
        isOpen = false;
        focusedOptionIndex = -1;
        focusedOnSelectAll = false;
        activeDescendant = null;
        break;

      case 'ArrowDown':
        event.preventDefault();

        if (!isOpen) {
          isOpen = true;
          if (hasSelectAll) {
            focusedOnSelectAll = true;
            focusedOptionIndex = -1;
            activeDescendant = 'select-all-option';
          } else if (filteredOptions.length > 0) {
            focusedOnSelectAll = false;
            focusedOptionIndex = 0;
            activeDescendant = `option-${filteredOptions[0]}`;
          }
        } else {
          if (focusedOnSelectAll) {
            if (filteredOptions.length > 0) {
              focusedOnSelectAll = false;
              focusedOptionIndex = 0;
              activeDescendant = `option-${filteredOptions[0]}`;
            }
          } else if (focusedOptionIndex === -1) {
            if (hasSelectAll) {
              focusedOnSelectAll = true;
              activeDescendant = 'select-all-option';
            } else if (filteredOptions.length > 0) {
              focusedOnSelectAll = false;
              focusedOptionIndex = 0;
              activeDescendant = `option-${filteredOptions[0]}`;
            }
          } else {
            if (focusedOptionIndex < filteredOptions.length - 1) {
              focusedOptionIndex++;
              activeDescendant = `option-${filteredOptions[focusedOptionIndex]}`;
            }
          }
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          isOpen = true;
          if (filteredOptions.length > 0) {
            focusedOnSelectAll = false;
            focusedOptionIndex = filteredOptions.length - 1;
            activeDescendant = `option-${filteredOptions[focusedOptionIndex]}`;
          } else if (hasSelectAll) {
            focusedOnSelectAll = true;
            focusedOptionIndex = -1;
            activeDescendant = 'select-all-option';
          }
        } else if (focusedOptionIndex === 0) {
          if (hasSelectAll) {
            focusedOnSelectAll = true;
            focusedOptionIndex = -1;
            activeDescendant = 'select-all-option';
          }
        } else if (focusedOptionIndex > 0) {
          focusedOptionIndex--;
          activeDescendant = `option-${filteredOptions[focusedOptionIndex]}`;
        }
        break;

      case 'Home':
        if (isOpen) {
          event.preventDefault();
          if (hasSelectAll) {
            focusedOnSelectAll = true;
            focusedOptionIndex = -1;
            activeDescendant = 'select-all-option';
          } else if (filteredOptions.length > 0) {
            focusedOnSelectAll = false;
            focusedOptionIndex = 0;
            activeDescendant = `option-${filteredOptions[0]}`;
          }
        }
        break;

      case 'End':
        if (isOpen && filteredOptions.length > 0) {
          event.preventDefault();
          focusedOnSelectAll = false;
          focusedOptionIndex = filteredOptions.length - 1;
          activeDescendant = `option-${filteredOptions[focusedOptionIndex]}`;
        }
        break;

      case 'Backspace':
        if (!inputValue && selectedValues.length > 0) {
          event.preventDefault();
          removeOption(selectedValues[selectedValues.length - 1]);
        }
        break;

      default:
        if (!isOpen && event.key.length === 1) {
          isOpen = true;
          focusedOptionIndex = -1;
          focusedOnSelectAll = false;
          activeDescendant = null;
        }
        break;
    }
  };

  // Add keyboard support for container
  const handleContainerKeydown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleDropdown(event);
      event.preventDefault();
    }
  };

  // Also open dropdown when input gets focus (but not if already opening)
  const handleFocus = () => {
    if (!isOpen && !isToggling) {
      isOpen = true;
    }
  };

  // Announce changes to screen readers
  const announceToScreenReader = (message) => {
    // Create a temporary element for screen reader announcements
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    document.body.appendChild(announcement);
    announcement.textContent = message;

    // Clean up after announcement
    setTimeout(() => {
      if (announcement.parentNode) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  };

  // Generate unique IDs for options
  const getOptionId = (option) => `option-${option}`;
  const comboboxId = id || `multiselect-${Math.random().toString(36).substr(2, 9)}`;
  const listboxId = `${comboboxId}-listbox`;

  // Summary text for selected items
  const selectionSummary = $derived(
    selectedValues.length === 0
      ? placeholder
      : `${selectedValues.length} item${selectedValues.length !== 1 ? 's' : ''} selected`,
  );
</script>

<div class="relative w-full" bind:this={containerElement} id={comboboxId}>
  <!-- Hidden label for screen readers if no visible label -->
  {#if label && !id}
    <label class="sr-only" for="{comboboxId}-input">{label}</label>
  {/if}

  <div
    class="flex items-center min-h-10 w-full px-3 py-2 border rounded-md bg-white {isOpen
      ? 'border-primary-500 ring-2 ring-primary-100'
      : 'border-neutral-300'} {disabled ? 'bg-neutral-100 cursor-not-allowed' : 'cursor-text'}"
    onclick={(e) => toggleDropdown(e)}
    onkeydown={handleContainerKeydown}
    role="combobox"
    aria-expanded={isOpen}
    aria-haspopup="listbox"
    aria-owns={listboxId}
    aria-controls={listboxId}
    aria-activedescendant={activeDescendant}
    aria-label={label || `MultiSelect with ${selectedValues.length} items selected`}
    tabindex={disabled ? -1 : 0}
  >
    <div class="flex items-center flex-grow min-w-0">
      <input
        type="text"
        id="{comboboxId}-input"
        bind:this={inputElement}
        bind:value={inputValue}
        onkeydown={handleKeydown}
        onfocus={handleFocus}
        onclick={(e) => e.stopPropagation()}
        placeholder={selectionSummary}
        class="flex-grow outline-none px-1 py-1 min-w-[50px] bg-transparent {disabled
          ? 'cursor-not-allowed'
          : ''} placeholder-neutral-500"
        {disabled}
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeDescendant}
        aria-describedby="{comboboxId}-help"
        role="combobox"
      />

      {#if showClearButton && selectedValues.length > 0 && !disabled}
        <button
          type="button"
          class="ml-2 text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded flex-shrink-0"
          onclick={(e) => {
            e.stopPropagation();
            clearAll();
          }}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              clearAll();
            }
          }}
          aria-label="Clear all selections"
          title="Clear all"
          tabindex={0}
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      {/if}
    </div>

    <!-- Dropdown indicator -->
    <div class="ml-2 flex-shrink-0">
      <svg
        class="w-4 h-4 text-neutral-400 transition-transform {isOpen ? 'rotate-180' : ''}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </div>
  </div>

  <!-- Hidden help text for screen readers -->
  <div id="{comboboxId}-help" class="sr-only">
    Use arrow keys to navigate options, Enter to select, Escape to close, Backspace to remove last
    selection.
  </div>

  {#if isOpen && (filteredOptions.length > 0 || options.length > selectedValues.length)}
    <div
      id={listboxId}
      bind:this={listboxElement}
      class="absolute z-10 w-full mt-1 max-h-[{maxHeight}] overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg"
      role="listbox"
      aria-label="Available options"
      aria-multiselectable="true"
    >
      <!-- Select All option - only show if there are unselected options and no search filter -->
      {#if !inputValue && options.length > selectedValues.length}
        <div
          id="select-all-option"
          class="px-4 py-2 hover:bg-primary-100 cursor-pointer border-b border-neutral-200 font-medium text-primary-700 bg-primary-50 focus:bg-primary-100 focus:outline-none {focusedOnSelectAll
            ? 'bg-primary-100'
            : ''}"
          onclick={(e) => {
            e.stopPropagation();
            selectAll();
          }}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              selectAll();
            }
          }}
          role="option"
          aria-selected="false"
          aria-label={`Select all remaining ${options.length - selectedValues.length} options`}
          tabindex="-1"
        >
          <span aria-hidden="true">✓</span> Select All ({options.length - selectedValues.length} remaining)
        </div>
      {/if}

      {#each filteredOptions as option, index (option)}
        <div
          id={getOptionId(option)}
          class="px-4 py-2 hover:bg-primary-50 cursor-pointer focus:bg-primary-100 focus:outline-none {focusedOptionIndex ===
          index
            ? 'bg-primary-100'
            : ''}"
          onclick={(e) => {
            e.stopPropagation();
            selectOption(option);
          }}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              selectOption(option);
            }
          }}
          role="option"
          aria-selected="false"
          aria-label={option}
          tabindex="-1"
        >
          {option}
        </div>
      {/each}

      <!-- No options message -->
      {#if filteredOptions.length === 0 && inputValue}
        <div class="px-4 py-2 text-neutral-500 italic" role="status" aria-live="polite">
          No options found for "{inputValue}"
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
