<script>
import Intro from "./lib/Intro.svelte";
import Filters from "./lib/Filters.svelte";
import Charts from "./lib/Charts.svelte";
import BackToTopButton from "./lib/BackToTopButton.svelte";
import Footer from "./lib/Footer.svelte";
import * as d3 from "d3";

let shows = $state([]);
let episodes = $state([]);
let showDetails = $state(new Map()); // Store storylines separately
let selectedGenres = $state([]);
let selectedLanguages = $state([]);
let maxSeasons = $state(42);

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

    // Load CSV files + pre-computed metadata for faster initialization
    const [seriesData, episodeData, metadataResponse] = await Promise.all([
      d3.csv("/data/imdb_top_tv_shows.csv"),
      d3.csv("/data/imdb_episodes.csv"),
      fetch("/data/metadata.json").then((r) => r.json()),
    ]);

    const showData = seriesData.map((d) => ({
      rank: parseInt(d.seriesRank) || 0,
      name: d.seriesTitle?.trim() || "",
      genres: d.genres?.trim() || "",
      language: d.language?.trim() || "",
      seasons: parseInt(d.seasons) || 0,
      episodes: parseInt(d.episodes) || 0,
      overall_ratings: parseFloat(d.overallRating) || 0,
      storyline: d.storyline?.trim() || "",
      genresList: d.genres?.trim() || "",
      link: d.seriesLink?.trim() || "",
      numberOfRatings: parseInt(d.numberOfRatings) || 0,
      timeRange: d.timeRange?.trim() || "",
    }));
    console.log("imdb_top_tv_shows:", showData);

    const episodesData = episodeData.map((d) => ({
      seriesRank: parseInt(d.seriesRank) || 0,
      seriesTitle: d.seriesTitle?.trim() || "",
      episodeSeason: parseInt(d.episodeSeason) || 0,
      episodeNumberOverall: parseInt(d.episodeNumberOverall) || 0,
      episodeNumberinSeason: parseInt(d.episodeNumberinSeason) || 0,
      episodeRating: parseFloat(d.episodeRating) || 0,
      episodeVotes: parseInt(d.episodeVotes) || 0,
      episodeTitle: d.episodeTitle?.trim() || "",
      episodeSummary: d.episodeSummary?.trim() || "",
      episodeLink: d.episodeLink?.trim() || "",
    }));
    console.log("imdb_episodes:", episodesData);

    shows = showData;
    episodes = episodesData;

    // Use pre-computed metadata instead of calculating from data
    availableGenres = metadataResponse.genres || [];
    availableLanguages = metadataResponse.languages || [];
    minSeasonsInDataset = metadataResponse.minSeasons || 1;
    maxSeasonsInDataset = metadataResponse.maxSeasons || 12;

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

const loadStorylines = async () => {
  try {
    const detailsData = await d3.csv("/data/imdb_top_tv_shows_details.csv");
    const detailsMap = new Map();
    detailsData.forEach((d) => {
      const rank = parseInt(d.rank);
      detailsMap.set(rank, d.storyline?.trim() || "");
    });

    showDetails = detailsMap;

    // Update shows with storylines
    shows = shows.map((show) => ({
      ...show,
      storyline: detailsMap.get(show.rank) || "",
    }));
  } catch (error) {
    console.warn("Could not load storylines:", error);
  }
};

const filteredShows = $derived(() => {
  if (!shows || shows.length === 0) return [];

  return shows.filter((show) => {
    // Season filter (fastest check first - simple number comparison)
    if (show.seasons > maxSeasons) {
      return false;
    }

    // Genre filter
    if (selectedGenres.length > 0) {
      const showGenres = show.genres
        .split(",")
        .map((g) => g.trim().toLowerCase());
      const hasGenre = selectedGenres.some((selectedGenre) =>
        showGenres.some((showGenre) =>
          showGenre.includes(selectedGenre.toLowerCase()),
        ),
      );
      if (!hasGenre) return false;
    }

    // Language filter
    if (selectedLanguages.length > 0) {
      const showLanguage = show.language.trim().toLowerCase();
      const hasLanguage = selectedLanguages.some((selectedLang) =>
        showLanguage.includes(selectedLang.toLowerCase()),
      );
      if (!hasLanguage) return false;
    }

    return true;
  });
});

// Optimized episode filtering using Set for O(1) lookup instead of array.includes()
const filteredEpisodes = $derived(() => {
  if (!episodes || episodes.length === 0 || !filteredShows()) return [];

  // Use Set with rank (number) for faster lookup vs string comparison
  const filteredShowRanks = new Set(filteredShows().map((show) => show.rank));

  return episodes.filter((episode) =>
    filteredShowRanks.has(episode.seriesRank),
  );
});

loadCSVData();
</script>

<div class="app-wrapper">
  <main class="main-content">
    <div class="content-container">
      <h1 class="page-title">IMDb best-rated TV shows</h1>

      <Intro />
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

    <div class="content-container">
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

.content-container {
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-title {
  font-size: 2.5rem;
  font-family: var(--font-display);
  font-weight: 700;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
  color: var(--color-primary);
  line-height: 1.2;
  word-wrap: break-word;
}

@media (min-width: 640px) {
  .page-title {
    font-size: 3rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
}

@media (min-width: 768px) {
  .page-title {
    font-size: 3.5rem;
    margin-bottom: 2.5rem;
  }
}

.filters-section {
  background-color: var(--color-primary-50);
  margin-bottom: 1rem;
}

.filters-inner {
  max-width: 72rem;
  margin: 0 auto;
}
</style>
