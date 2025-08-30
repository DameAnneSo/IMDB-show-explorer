<script>
  import Filters from './lib/Filters.svelte';
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
      
      // Load CSV files
      const [seriesData, episodeData] = await Promise.all([
        d3.csv('/data/series_test.csv'),
        d3.csv('/data/episodes_test.csv')
      ]);
      
      const showData = seriesData.map(d => ({
        name: d.title?.trim() || '',
        genres: d.genres?.trim() || '',
        languages: d.languages?.trim() || '',
        seasons: parseInt(d.seasons) || 0,
        episodes: parseInt(d.episodes) || 0,
        overall_ratings: parseFloat(d.overall_ratings) || 0,
      }));

      const episodesData = episodeData.map(d => ({
        seriesRank: parseInt(d.seriesRank) || 0,
        seriesTitle: d.seriesTitle?.trim() || '',
        seriesNumberOfEpisodes: parseInt(d.seriesNumberOfEpisodes) || 0,
        episodeSeason: parseInt(d.episodeSeason) || 0,
        episodeNumberOverall: parseInt(d.episodeNumberOverall) || 0,
        episodeRating: parseFloat(d.episodeRating) || 0,
      }));

      shows = showData;
      episodes = episodesData;

      // Compute available options and ranges from the data
      const genresSet = new Set();
      const languagesSet = new Set();
      const seasonCounts = [];

      showData.forEach(show => {
        // Extract genres
        if (show.genres) {
          show.genres.split(',').forEach(genre => {
            const cleanGenre = genre.trim();
            if (cleanGenre) genresSet.add(cleanGenre);
          });
        }

        // Extract languages
        if (show.languages) {
          show.languages.split(',').forEach(lang => {
            const cleanLang = lang.trim();
            if (cleanLang) languagesSet.add(cleanLang);
          });
        }

        // Collect season counts
        if (show.seasons > 0) {
          seasonCounts.push(show.seasons);
        }
      });

      // Set values
      availableGenres = Array.from(genresSet).sort();
      availableLanguages = Array.from(languagesSet).sort();
      
      // Compute min/max seasons from actual data
      if (seasonCounts.length > 0) {
        minSeasonsInDataset = Math.min(...seasonCounts);
        maxSeasonsInDataset = Math.max(...seasonCounts);
      } else {
        // Fallback values if no valid season data
        minSeasonsInDataset = 1;
        maxSeasonsInDataset = 1;
      }
      
      // Set initial slider value to maximum seasons found in data
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

  loadCSVData();
</script>

<main class="p-6 max-w-6xl mx-auto">
  <h1 class="text-3xl font-bold mb-6">IMDb best-rated TV shows</h1>
  
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
    <!-- Filters component -->
    <div class="mb-6">
      <Filters
        {availableGenres}
        {availableLanguages}
        {minSeasonsInDataset}
        {maxSeasonsInDataset}
        bind:selectedGenres
        bind:selectedLanguages
        bind:maxSeasons
      />
    </div>

    <!-- Results section -->
    <!-- <div class="mb-4">
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
    </div> -->

    <!-- Charts component -->
    <Charts 
      shows={filteredShows()}
      episodes={filteredEpisodes()} 
    />
  {/if}
</main>
