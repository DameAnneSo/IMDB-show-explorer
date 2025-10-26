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
    const totalFilters = selectedGenres.length + selectedLanguages.length + (maxSeasons < maxSeasonsInDataset ? 1 : 0);
    selectedGenres = [];
    selectedLanguages = [];
    maxSeasons = maxSeasonsInDataset;
    announceToScreenReader(`All ${totalFilters} filters cleared`);
  };

  const removeGenre = (genre) => {
    selectedGenres = selectedGenres.filter(g => g !== genre);
    announceToScreenReader(`${genre} removed from genre filters. ${selectedGenres.length} genre filters remaining.`);
  };

  const removeLanguage = (language) => {
    selectedLanguages = selectedLanguages.filter(l => l !== language);
    announceToScreenReader(`${language} removed from language filters. ${selectedLanguages.length} language filters remaining.`);
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
  <fieldset class="grid md:grid-cols-3 gap-4 mb-3">
    <legend class="sr-only">Filter TV shows by genre, language, and number of seasons</legend>
    
    <!-- Genres Filter -->
    <div>
      <label 
        class="block text-sm font-medium text-gray-700 mb-2"
        for="genres-select"
        id="genres-label"
      >
        Genres
      </label>
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
      <label 
        class="block text-sm font-medium text-gray-700 mb-2"
        for="languages-select"
        id="languages-label"
      >
        Languages
      </label>
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
      <label 
        class="block text-sm font-medium text-gray-700 mb-2"
        for="seasons-slider"
        id="seasons-label"
      >
        Maximum number of seasons
      </label>
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

  <!-- Active filters display with pills -->
  {#if hasActiveFilters}
    <div 
      role="region"
      aria-labelledby="active-filters-heading"
      aria-live="polite"
      aria-atomic="false"
    >
      <h2 
        id="active-filters-heading" 
        class="font-semibold mb-2.5"
      >
        Active filters
      </h2>
      
      <div class="flex flex-wrap items-center gap-2">
        <!-- Clear all filters button -->
        <button
          type="button"
          onclick={clearAllFilters}
          class="px-2 py-0.5 text-gray-600 border border-gray-600 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm font-medium"
          aria-label="Clear all active filters"
        >
          Clear all
        </button>
        
        <!-- Genre pills -->
        {#each selectedGenres as genre (genre)}
          <div class="flex items-center bg-blue-100 text-blue-800 border border-blue-300 rounded-md px-1 py-0.5 text-sm">
            <span class="ml-1">{genre}</span>
            <button 
              type="button"
              class="ml-2 text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
              onclick={() => removeGenre(genre)}
              aria-label={`Remove ${genre} from genre filters`}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        {/each}
        
        <!-- Language pills -->
        {#each selectedLanguages as language (language)}
          <div class="flex items-center bg-blue-100 text-blue-800 border border-blue-300 rounded-md px-1 py-0.5 text-sm">
            <span class="ml-1">{language}</span>
            <button 
              type="button"
              class="ml-2 text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
              onclick={() => removeLanguage(language)}
              aria-label={`Remove ${language} from language filters`}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        {/each}
        
        <!-- Seasons pill -->
        {#if maxSeasons < maxSeasonsInDataset}
          <div class="flex items-center bg-blue-100 text-blue-800 border border-blue-300 rounded-md px-1 py-0.5 text-sm">
            <span class="font-medium">Max seasons:</span>
            <span class="ml-1">{maxSeasons}</span>
            <button 
              type="button"
              class="ml-2 text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
              onclick={resetSeasons}
              aria-label="Reset maximum seasons filter to show all shows"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <!-- No filters message -->
    <div 
      role="region"
      aria-labelledby="active-filters-heading"
    >
      <h2 
        id="active-filters-heading" 
        class="font-semibold mb-2"
      >
        Active filters
      </h2>
      <div class="text-gray-500 text-sm">
        No filters applied
      </div>
    </div>
  {/if}
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
