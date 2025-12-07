<script>
import Filters from "./lib/Filters.svelte";
import Charts from "./lib/Charts.svelte";
import BackToTopButton from "./lib/BackToTopButton.svelte";
import Footer from "./lib/Footer.svelte";
import * as d3 from "d3";

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
      d3.csv("/data/series_test.csv"),
      d3.csv("/data/episodes_test.csv"),
    ]);

    const showData = seriesData.map((d) => ({
      name: d.title?.trim() || "",
      genres: d.genres?.trim() || "",
      languages: d.languages?.trim() || "",
      seasons: parseInt(d.seasons) || 0,
      episodes: parseInt(d.episodes) || 0,
      overall_ratings: parseFloat(d.overall_ratings) || 0,
    }));

    const episodesData = episodeData.map((d) => ({
      seriesRank: parseInt(d.seriesRank) || 0,
      seriesTitle: d.seriesTitle?.trim() || "",
      seriesNumberOfEpisodes: parseInt(d.seriesNumberOfEpisodes) || 0,
      episodeSeason: parseInt(d.episodeSeason) || 0,
      episodeNumberOverall: parseInt(d.episodeNumberOverall) || 0,
      episodeNumberinSeason: parseInt(d.episodeNumberinSeason) || 0,
      episodeRating: parseFloat(d.episodeRating) || 0,
      episodeTitle: d.episodeTitle?.trim() || "",
    }));

    shows = showData;
    episodes = episodesData;

    // Compute available options and ranges from the data
    const genresSet = new Set();
    const languagesSet = new Set();
    const seasonCounts = [];

    showData.forEach((show) => {
      // Extract genres
      if (show.genres) {
        show.genres.split(",").forEach((genre) => {
          const cleanGenre = genre.trim();
          if (cleanGenre) genresSet.add(cleanGenre);
        });
      }

      // Extract languages
      if (show.languages) {
        show.languages.split(",").forEach((lang) => {
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
    console.error("Error loading CSV data:", error);
    loadError =
      "Failed to load series data. Please check that the files exist at /public/data/series.csv and /public/data/episodes.csv";
  } finally {
    isLoading = false;
  }
};

const filteredShows = $derived(() => {
  if (!shows || shows.length === 0) return [];

  return shows.filter((show) => {
    if (selectedGenres.length > 0) {
      const showGenres = show.genres.split(",").map((g) => g.trim());
      const hasGenre = selectedGenres.some((selectedGenre) =>
        showGenres.some((showGenre) =>
          showGenre.toLowerCase().includes(selectedGenre.toLowerCase())
        )
      );
      if (!hasGenre) return false;
    }

    if (selectedLanguages.length > 0) {
      const showLanguages = show.languages.split(",").map((l) => l.trim());
      const hasLanguage = selectedLanguages.some((selectedLang) =>
        showLanguages.some((showLang) =>
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

  const filteredShowNames = filteredShows().map((show) => show.name);

  return episodes.filter((episode) =>
    filteredShowNames.includes(episode.seriesTitle)
  );
});

loadCSVData();
</script>

<div class="app-wrapper">
  <main class="main-content">
    <div class="main-inner">
      <h1 class="page-title">
        IMDb best-rated TV shows
      </h1>
    </div>

    <div class="filters-section">
      <div class="filters-inner">
        {#if isLoading}
          <div class="flex justify-center items-center py-12">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
            ></div>
            <span class="ml-3 text-neutral-600">Loading series data...</span>
          </div>
        {:else if loadError}
          <div class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Error Loading Data
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{loadError}</p>
                </div>
              </div>
            </div>
          </div>
        {:else}
          <!-- Filters component -->
          <Filters
            {availableGenres}
            {availableLanguages}
            {minSeasonsInDataset}
            {maxSeasonsInDataset}
            bind:selectedGenres
            bind:selectedLanguages
            bind:maxSeasons
          />
        {/if}
      </div>
    </div>

    <div class="main-inner">
      <!-- Charts component -->
      {#if !isLoading && !loadError}
        <Charts
          shows={filteredShows()}
          episodes={filteredEpisodes()}
          {maxSeasons}
        />
      {/if}

      <BackToTopButton />
    </div>
  </main>
  <Footer />
</div>

<style>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

.main-inner {
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-title {
  font-size: 2.5rem;
  font-family: var(--font-display);
  font-weight: 700;
  margin-bottom: 3rem;
  margin-top: 1.5rem;
  color: var(--color-primary);
  line-height: 1.2;
  word-wrap: break-word;
}

@media (min-width: 640px) {
  .page-title {
    font-size: 3rem;
    margin-top: 2rem;
    margin-bottom: 4rem;
  }
}

@media (min-width: 768px) {
  .page-title {
    font-size: 3.5rem;
    margin-bottom: 5rem;
  }
}

.filters-section {
  background-color: var(--color-primary-100);
  width: 100%;
  padding: 2rem 1.5rem;
  margin-bottom: 3rem;
}

.filters-inner {
  max-width: 72rem;
  margin: 0 auto;
}
</style>
