<script>
  import MultiSelect from './MultiSelect.svelte';
  import RangeSlider from './RangeSlider.svelte';

  let {
    availableGenres = [],
    availableLanguages = [],
    minSeasonsInDataset,
    maxSeasonsInDataset,
    selectedGenres = $bindable([]),
    selectedLanguages = $bindable([]),
    maxSeasons = $bindable(12),
    onGenreChange = undefined,
    onLanguageChange = undefined,
    onSeasonsChange = undefined
  } = $props();

  const hasActiveFilters = $derived(
    selectedGenres.length > 0 || 
    selectedLanguages.length > 0 || 
    maxSeasons < maxSeasonsInDataset
  );

  const clearAllFilters = () => {
    selectedGenres = [];
    selectedLanguages = [];
    maxSeasons = maxSeasonsInDataset;
    announceToScreenReader('All filters cleared');
  };

  const clearGenres = () => {
    const count = selectedGenres.length;
    selectedGenres = [];
    announceToScreenReader(`${count} genre filter${count !== 1 ? 's' : ''} cleared`);
  };

  const clearLanguages = () => {
    const count = selectedLanguages.length;
    selectedLanguages = [];
    announceToScreenReader(`${count} language filter${count !== 1 ? 's' : ''} cleared`);
  };

  const resetSeasons = () => {
    maxSeasons = maxSeasonsInDataset;
    announceToScreenReader('Season filter reset to maximum');
  };

  const handleGenreChange = (event) => {
    if (onGenreChange) {
      onGenreChange(event);
    }
  };

  const handleLanguageChange = (event) => {
    if (onLanguageChange) {
      onLanguageChange(event);
    }
  };

  const handleSeasonsChange = (event) => {
    if (onSeasonsChange) {
      onSeasonsChange(event);
    }
  };

  // Screen reader announcements
  const announceToScreenReader = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    
    document.body.appendChild(announcement);
    
    // Small delay to ensure screen reader picks it up
    setTimeout(() => {
      announcement.textContent = message;
    }, 100);
    
    // Clean up after announcement
    setTimeout(() => {
      if (announcement.parentNode) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  };
</script>

<section 
  aria-labelledby="filters-heading"
  class="space-y-6"
>
  <h2 id="filters-heading" class="sr-only">Filter TV shows</h2>
  
  <!-- Filter Controls -->
  <fieldset class="grid md:grid-cols-3 gap-4">
    <legend class="sr-only">Filter TV shows by genre, language, and number of seasons</legend>
    
    <!-- Genres Filter -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label 
          class="block text-sm font-medium text-gray-700" 
          for="genres-select"
          id="genres-label"
        >
          Genres
        </label>
        {#if selectedGenres.length > 0}
          <button
            type="button"
            onclick={clearGenres}
            class="text-xs text-red-600 hover:text-red-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1"
            aria-label={`Clear ${selectedGenres.length} genre filter${selectedGenres.length !== 1 ? 's' : ''}`}
          >
            Clear ({selectedGenres.length})
          </button>
        {/if}
      </div>
      <MultiSelect
        options={availableGenres}
        bind:selectedValues={selectedGenres}
        placeholder="Select genres..."
        onchange={handleGenreChange}
        id="genres-select"
        label="Genres"
      />
    </div>
    
    <!-- Languages filter -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label 
          class="block text-sm font-medium text-gray-700" 
          for="languages-select"
          id="languages-label"
        >
          Languages
        </label>
        {#if selectedLanguages.length > 0}
          <button
            type="button"
            onclick={clearLanguages}
            class="text-xs text-red-600 hover:text-red-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1"
            aria-label={`Clear ${selectedLanguages.length} language filter${selectedLanguages.length !== 1 ? 's' : ''}`}
          >
            Clear ({selectedLanguages.length})
          </button>
        {/if}
      </div>
      <MultiSelect
        options={availableLanguages}
        bind:selectedValues={selectedLanguages}
        placeholder="Select languages..."
        onchange={handleLanguageChange}
        id="languages-select"
        label="Languages"
      />
    </div>
    
    <!-- Seasons filter -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label 
          class="block text-sm font-medium text-gray-700" 
          for="seasons-slider"
          id="seasons-label"
        >
          Maximum seasons
        </label>
        {#if maxSeasons < maxSeasonsInDataset}
          <button
            type="button"
            onclick={resetSeasons}
            class="text-xs text-red-600 hover:text-red-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1"
            aria-label="Reset maximum seasons filter to show all shows"
          >
            Reset
          </button>
        {/if}
      </div>
      <RangeSlider
        min={minSeasonsInDataset}
        max={maxSeasonsInDataset}
        bind:value={maxSeasons}
        id="seasons-slider"
        onchange={handleSeasonsChange}
        showValue={true}
      />
      <div 
        class="text-xs text-gray-600 mt-1"
        id="seasons-description"
        aria-live="polite"
      >
        Shows with {maxSeasons} season{maxSeasons !== 1 ? 's' : ''} or fewer
      </div>
    </div>
  </fieldset>

  <!-- Clear all filters button -->
  {#if hasActiveFilters}
    <div>
      <button
        type="button"
        onclick={clearAllFilters}
        class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        aria-label="Clear all active filters"
      >
        Clear all filters
      </button>
    </div>
  {/if}

  <!-- Active filters display -->
  <div 
    class="p-4 bg-gray-50 rounded-md"
    role="region"
    aria-labelledby="active-filters-heading"
    aria-live="polite"
    aria-atomic="false"
  >
    <h2 
      id="active-filters-heading" 
      class="font-semibold mb-2"
    >
      Active filters:
    </h2>
    <div class="space-y-1 text-sm">
      {#if selectedGenres.length > 0}
        <div>
          <strong>Genres:</strong> 
          <span aria-label={`${selectedGenres.length} genres selected: ${selectedGenres.join(', ')}`}>
            {selectedGenres.join(', ')}
          </span>
        </div>
      {/if}
      {#if selectedLanguages.length > 0}
        <div>
          <strong>Languages:</strong> 
          <span aria-label={`${selectedLanguages.length} languages selected: ${selectedLanguages.join(', ')}`}>
            {selectedLanguages.join(', ')}
          </span>
        </div>
      {/if}
      {#if maxSeasons < maxSeasonsInDataset}
        <div>
          <strong>Maximum Seasons:</strong> 
          <span aria-label={`Maximum seasons set to ${maxSeasons}`}>
            {maxSeasons}
          </span>
        </div>
      {/if}
      {#if !hasActiveFilters}
        <div class="text-gray-500 italic">
          No filters applied
        </div>
      {/if}
    </div>
  </div>
</section>

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
