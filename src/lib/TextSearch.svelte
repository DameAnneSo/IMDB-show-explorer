<script>
  let {
    value = $bindable(''),
    placeholder = 'Search...',
    disabled = false,
    id = undefined,
    label = '',
    showClearButton = true,
    onchange = undefined,
  } = $props();

  let inputElement;
  let isFocused = $state(false);

  const inputId = id || `textsearch-${Math.random().toString(36).substr(2, 9)}`;

  const handleInput = () => {
    if (onchange) {
      onchange({ detail: { value } });
    }
  };

  const clear = () => {
    value = '';
    if (onchange) {
      onchange({ detail: { value: '' } });
    }
    announceToScreenReader('Search cleared.');
    inputElement?.focus();
  };

  const handleKeydown = (event) => {
    if (event.key === 'Escape' && value) {
      event.preventDefault();
      clear();
    }
  };

  const announceToScreenReader = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    document.body.appendChild(announcement);
    announcement.textContent = message;
    setTimeout(() => {
      if (announcement.parentNode) document.body.removeChild(announcement);
    }, 1000);
  };
</script>

<div class="relative w-full">
  {#if label}
    <label class="sr-only" for={inputId}>{label}</label>
  {/if}

  <div
    class="flex items-center min-h-10 w-full px-3 py-2 border rounded-md bg-white
      {isFocused ? 'border-primary-500 ring-2 ring-primary-100' : 'border-neutral-300'}
      {disabled ? 'bg-neutral-100 cursor-not-allowed' : 'cursor-text'}"
  >
    <!-- Search icon -->
    <svg
      class="w-4 h-4 text-neutral-400 flex-shrink-0 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
      />
    </svg>

    <input
      type="text"
      {id}
      bind:this={inputElement}
      bind:value
      {disabled}
      {placeholder}
      oninput={handleInput}
      onkeydown={handleKeydown}
      onfocus={() => (isFocused = true)}
      onblur={() => (isFocused = false)}
      class="flex-grow outline-none bg-transparent text-primary-900
        placeholder-neutral-500 py-1{disabled ? 'cursor-not-allowed' : ''}"
      aria-label={label || placeholder}
      aria-describedby="{inputId}-help"
    />

    {#if showClearButton && value && !disabled}
      <button
        type="button"
        class="ml-2 text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-2
          focus:ring-primary-500 focus:ring-offset-1 rounded flex-shrink-0"
        onclick={clear}
        onkeydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            clear();
          }
        }}
        aria-label="Clear search"
        title="Clear search"
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
          />
        </svg>
      </button>
    {/if}
  </div>

  <div id="{inputId}-help" class="sr-only">Type to search. Press Escape to clear.</div>
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
