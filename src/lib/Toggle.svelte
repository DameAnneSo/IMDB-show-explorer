<script>
  let { 
    checked = $bindable(true),
    disabled = false,
    label = '',
    id = undefined,
    onchange = undefined
  } = $props();

  const handleChange = (event) => {
    checked = event.target.checked;
    if (onchange) {
      onchange({ detail: { checked } });
    }
  };
</script>

<div class="flex items-center">
  {#if label}
    <label class="text-sm font-medium text-gray-700 mr-3" for={id}>
      {label}
    </label>
  {/if}
  
  <button
    type="button"
    class="relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 h-6 w-11 {checked ? 'bg-blue-600' : 'bg-gray-200'} {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
    role="switch"
    aria-checked={checked}
    aria-labelledby={id}
    onclick={() => !disabled && (checked = !checked)}
    {disabled}
  >
    <span class="sr-only">{label || 'Toggle'}</span>
    <span
      class="pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out h-5 w-5 {checked ? 'translate-x-5' : 'translate-x-0'}"
    ></span>
  </button>

  <!-- Hidden checkbox for form compatibility -->
  <input
    type="checkbox"
    bind:checked
    onchange={handleChange}
    {disabled}
    {id}
    class="sr-only"
    aria-hidden="true"
  />
</div>
