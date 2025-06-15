<script>
  import MultiSelect from './lib/MultiSelect.svelte';
  import RangeSlider from './lib/RangeSlider.svelte';
  import * as d3 from 'd3';
  
  const csvData = `name,genres,languages,seasons
Line of Duty,thriller,"English",6
Breaking Bad,crime drama,"English",5
Money Heist,heist thriller,"Spanish",5
Dark,sci-fi thriller,"German",3
The Crown,biographical drama,"English",6
Narcos,crime drama,"Spanish, English",3
Stranger Things,sci-fi/horror,"English",4
Borgen,political drama,"Danish",4
Fauda,action thriller,"Hebrew, Arabic",4
The Bridge,crime thriller,"Swedish, Danish",4`;

  let shows = $state([]);
  let selectedGenres = $state([]);
  let selectedLanguages = $state([]);
  let maxSeasons = $state(6); // Dynamically set
  
  let availableGenres = $state([]);
  let availableLanguages = $state([]);
  let minSeasonsInDataset = $state(1);
  let maxSeasonsInDataset = $state(6);

  const parseCSVData = () => {
    const showData = d3.csvParse(csvData, (d) => {
      return {
        name: d.name?.trim() || '',
        genres: d.genres?.trim() || '',
        languages: d.languages?.replace(/"/g, '').trim() || '',
        seasons: parseInt(d.seasons) || 0
      };
    });

    shows = showData;

    const genresSet = new Set();
    const languagesSet = new Set();
    let minSeasons = Infinity;
    let maxSeasonsFound = 0;

    showData.forEach(show => {
      if (show.genres) {
        show.genres.split(/[,/]/).forEach(genre => {
          const cleanGenre = genre.trim();
          if (cleanGenre) genresSet.add(cleanGenre);
        });
      }

      if (show.languages) {
        show.languages.split(',').forEach(lang => {
          const cleanLang = lang.trim();
          if (cleanLang) languagesSet.add(cleanLang);
        });
      }

      if (show.seasons > 0) {
        minSeasons = Math.min(minSeasons, show.seasons);
        maxSeasonsFound = Math.max(maxSeasonsFound, show.seasons);
      }
    });

    availableGenres = Array.from(genresSet).sort();
    availableLanguages = Array.from(languagesSet).sort();
    minSeasonsInDataset = minSeasons === Infinity ? 1 : minSeasons;
    maxSeasonsInDataset = maxSeasonsFound;
    
    // Set initial slider value to maximum seasons
    maxSeasons = maxSeasonsInDataset;
  }

  const filteredShows = $derived(() => {
    if (!shows || shows.length === 0) return [];
    
    return shows.filter(show => {
      if (selectedGenres.length > 0) {
        const showGenres = show.genres.split(/[,/]/).map(g => g.trim());
        const hasGenre = selectedGenres.some(selectedGenre => 
          showGenres.some(showGenre => 
            showGenre.toLowerCase().includes(selectedGenre.toLowerCase())
          )
        );
        if (!hasGenre) return false;
      }

      if (selectedLanguages.length > 0) {
        const showLanguages = show.languages.split(',').map(l => l.trim());
        const hasLanguage = selectedLanguages.some(selectedLang =>
          showLanguages.some(showLang =>
            showLang.toLowerCase().includes(selectedLang.toLowerCase())
          )
        );
        if (!hasLanguage) return false;
      }

      // Filter by maximum number of seasons
      if (show.seasons > maxSeasons) {
        return false;
      }

      return true;
    });
  });

  const clearAllFilters = () => {
    selectedGenres = [];
    selectedLanguages = [];
    maxSeasons = maxSeasonsInDataset; // Reset to maximum
  };

  // Individual clear functions for each category
  const clearGenres = () => {
    selectedGenres = [];
  };

  const clearLanguages = () => {
    selectedLanguages = [];
  };

  const resetSeasons = () => {
    maxSeasons = maxSeasonsInDataset;
  };

  const hasActiveFilters = $derived(
    selectedGenres.length > 0 || 
    selectedLanguages.length > 0 || 
    maxSeasons < maxSeasonsInDataset
  );

  parseCSVData();

  const handleGenreChange = (event) => {
    console.log('Genres changed:', event.detail.selected);
  }

  const handleLanguageChange = (event) => {
    console.log('Languages changed:', event.detail.selected);
  }

  const handleSeasonsChange = (event) => {
    console.log('Max seasons changed:', event.detail.value);
  }
</script>

<main class="p-6 max-w-4xl mx-auto">
  <h1 class="text-3xl font-bold mb-6">IMDb best-rated TV Shows</h1>
  <div class="grid md:grid-cols-3 gap-4 mb-6">
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
    
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-gray-700" for="seasons-slider">
          Maximum Seasons
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

  {#if hasActiveFilters}
    <div class="mb-4">
      <button
        onclick={clearAllFilters}
        class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  {/if}

  <div class="mb-6 p-4 bg-gray-50 rounded-md">
    <h2 class="font-semibold mb-2">Active Filters:</h2>
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

  <div class="mb-4">
    <h2 class="text-xl font-semibold mb-4">
      Results ({filteredShows().length} of {shows.length} shows)
    </h2>
    
    {#if filteredShows().length === 0}
      <div class="text-center py-8 text-gray-500">
        <p>No shows match your current filters.</p>
        <p class="text-sm mt-2">Try adjusting or clearing your filters.</p>
      </div>
    {:else}
      <div class="grid gap-4">
        {#each filteredShows() as show (show.name)}
          <div class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h3 class="font-semibold text-lg mb-2">{show.name}</h3>
            <div class="grid md:grid-cols-3 gap-2 text-sm text-gray-600">
              <div><strong>Genre:</strong> {show.genres}</div>
              <div><strong>Languages:</strong> {show.languages}</div>
              <div><strong>Seasons:</strong> {show.seasons}</div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</main>
