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
  };

  const clearGenres = () => {
    selectedGenres = [];
  };

  const clearLanguages = () => {
    selectedLanguages = [];
  };

  const resetSeasons = () => {
    maxSeasons = maxSeasonsInDataset;
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
</script>

<div class="space-y-6">
  <!-- Filter Controls -->
  <div class="grid md:grid-cols-3 gap-4">
    <!-- Genres Filter -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-gray-700" for="genres-select">
          Genres
        </label>
        {#if selectedGenres.length > 0}
          <button
            onclick={clearGenres}
            class="text-xs text-red-600 hover:text-red-800 font-medium"
            title="Clear genre filters"
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
      />
    </div>
    
    <!-- Languages filter -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-gray-700" for="languages-select">
          Languages
        </label>
        {#if selectedLanguages.length > 0}
          <button
            onclick={clearLanguages}
            class="text-xs text-red-600 hover:text-red-800 font-medium"
            title="Clear language filters"
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
      />
    </div>
    
    <!-- Seasons filter -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-gray-700" for="seasons-slider">
          Maximum seasons
        </label>
        {#if maxSeasons < maxSeasonsInDataset}
          <button
            onclick={resetSeasons}
            class="text-xs text-red-600 hover:text-red-800 font-medium"
            title="Reset season filter"
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
      <div class="text-xs text-gray-600 mt-1">
        Shows with {maxSeasons} season{maxSeasons !== 1 ? 's' : ''} or fewer
      </div>
    </div>
  </div>

  <!-- Clear all filters button -->
  {#if hasActiveFilters}
    <div>
      <button
        onclick={clearAllFilters}
        class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  {/if}

  <!-- Active filters display -->
  <div class="p-4 bg-gray-50 rounded-md">
    <h2 class="font-semibold mb-2">Active filters:</h2>
    <div class="space-y-1 text-sm">
      {#if selectedGenres.length > 0}
        <div><strong>Genres:</strong> {selectedGenres.join(', ')}</div>
      {/if}
      {#if selectedLanguages.length > 0}
        <div><strong>Languages:</strong> {selectedLanguages.join(', ')}</div>
      {/if}
      {#if maxSeasons < maxSeasonsInDataset}
        <div><strong>Maximum Seasons:</strong> {maxSeasons}</div>
      {/if}
      {#if !hasActiveFilters}
        <div class="text-gray-500 italic">No filters applied</div>
      {/if}
    </div>
  </div>
</div>
