<script>
  let { 
    checked = $bindable(true),
    disabled = false,
    label = '',
    id = undefined,
    onchange = undefined
  } = $props();

  // Generate a unique ID if none provided
  const toggleId = id || `toggle-${Math.random().toString(36).substring(2, 11)}`;

  const handleChange = (event) => {
    checked = event.target.checked;
    if (onchange) {
      onchange({ detail: { checked } });
    }
  };

  const handleButtonClick = () => {
    if (!disabled) {
      checked = !checked;
      // Trigger change event for consistency
      if (onchange) {
        onchange({ detail: { checked: !checked } });
      }
    }
  };

  const handleKeyDown = (event) => {
    // Handle space and enter keys for accessibility
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleButtonClick();
    }
  };
</script>

<div class="flex items-center">
  {#if label}
    <label class="text-sm font-medium text-gray-700 mr-3" for={toggleId}>
      {label}
    </label>
  {/if}
  
  <button
    type="button"
    class="relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 h-6 w-11 {checked ? 'bg-blue-600' : 'bg-gray-200'} {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
    role="switch"
    aria-checked={checked}
    aria-labelledby={label ? toggleId : undefined}
    aria-label={!label ? 'Toggle switch' : undefined}
    aria-describedby={label ? undefined : `${toggleId}-description`}
    onclick={handleButtonClick}
    onkeydown={handleKeyDown}
    {disabled}
    tabindex={disabled ? -1 : 0}
  >
    <span class="sr-only">{label || 'Toggle switch'}</span>
    <span
      class="pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out h-5 w-5 {checked ? 'translate-x-5' : 'translate-x-0'}"
      aria-hidden="true"
    ></span>
  </button>

  <!-- Hidden checkbox for form compatibility and screen readers -->
  <input
    type="checkbox"
    bind:checked
    onchange={handleChange}
    {disabled}
    id={toggleId}
    class="sr-only"
    tabindex="-1"
    aria-hidden="true"
  />
  
  <!-- Hidden description for screen readers when no label is provided -->
  {#if !label}
    <span id="{toggleId}-description" class="sr-only">
      Toggle switch, currently {checked ? 'on' : 'off'}
    </span>
  {/if}
</div>
