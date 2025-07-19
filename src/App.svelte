<script>
  import MultiSelect from './lib/MultiSelect.svelte';
  import RangeSlider from './lib/RangeSlider.svelte';
  import Charts from './lib/Charts.svelte';
  import * as d3 from 'd3';
  
  let shows = $state([]);
  let episodes = $state([]);
  let selectedGenres = $state([]);
  let selectedLanguages = $state([]);
  let maxSeasons = $state(12);
  
  let availableGenres = $state([]);
  let availableLanguages = $state([]);
  let minSeasonsInDataset = $state(1);
  let maxSeasonsInDataset = $state(12);
  let isLoading = $state(true);
  let loadError = $state(null);

  const loadCSVData = async () => {
    try {
      isLoading = true;
      loadError = null;
      
      // Load both CSV files
      const [seriesData, episodeData] = await Promise.all([
        d3.csv('/public/data/seriesv2.csv'),
        d3.csv('/public/data/episodes.csv')
      ]);
      
      const showData = seriesData.map(d => ({
        name: d.title?.trim() || '',
        genres: d.genres?.trim() || '',
        languages: d.language?.trim() || '',
        seasons: parseInt(d.seasons) || 0
      }));

      const episodesData = episodeData.map(d => ({
        seriesTitle: d.seriesTitle?.trim() || '',
        seriesLink: d.seriesLink?.trim() || '',
        seriesEpisodesLink: d.seriesEpisodesLink?.trim() || '',
        episodeSeason: parseInt(d.episodeSeason) || 0,
        episodeNumber: parseInt(d.episodeNumber) || 0,
        episodeTitle: d.episodeTitle?.trim() || '',
        episodeDate: d.episodeDate?.trim() || '',
        episodeRating: parseFloat(d.episodeRating) || 0,
        episodeVotes: parseInt(d.episodeVotes) || 0
      }));

      shows = showData;
      episodes = episodesData;

      const genresSet = new Set();
      const languagesSet = new Set();
      let minSeasons = Infinity;
      let maxSeasonsFound = 0;

      showData.forEach(show => {
        if (show.genres) {
          show.genres.split(',').forEach(genre => {
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
      
    } catch (error) {
      console.error('Error loading CSV data:', error);
      loadError = 'Failed to load series data. Please check that the files exist at /public/data/series.csv and /public/data/episodes.csv';
    } finally {
      isLoading = false;
    }
  }

  const filteredShows = $derived(() => {
    if (!shows || shows.length === 0) return [];
    
    return shows.filter(show => {
      if (selectedGenres.length > 0) {
        const showGenres = show.genres.split(',').map(g => g.trim());
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

  // Filter episodes based on selected shows
  const filteredEpisodes = $derived(() => {
    if (!episodes || episodes.length === 0 || !filteredShows()) return [];
    
    const filteredShowNames = filteredShows().map(show => show.name);
    
    return episodes.filter(episode => 
      filteredShowNames.includes(episode.seriesTitle)
    );
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

  const handleGenreChange = (event) => {
    console.log('Genres changed:', event.detail.selected);
  }

  const handleLanguageChange = (event) => {
    console.log('Languages changed:', event.detail.selected);
  }

  const handleSeasonsChange = (event) => {
    console.log('Max seasons changed:', event.detail.value);
  }

  loadCSVData();
</script>

<main class="p-6 max-w-4xl mx-auto">
  <h1 class="text-3xl font-bold mb-6">IMDb best-rated TV Shows</h1>
  
  {#if isLoading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Loading series data...</span>
    </div>
  {:else if loadError}
    <div class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error Loading Data</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{loadError}</p>
          </div>
        </div>
      </div>
    </div>
  {:else}
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
    <!-- Charts Component -->
    <Charts 
      shows={filteredShows()}
      episodes={filteredEpisodes()} 
    />
  {/if}
</main>
