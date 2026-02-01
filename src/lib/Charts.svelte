<script>
import * as d3 from "d3";
import LazyLineChart from "./LazyLineChart.svelte";
import Toggle from "./Toggle.svelte";

let { shows = [], episodes = [], maxSeasons } = $props();

let showDetails = $state(true);

const sortedShows = $derived(shows.sort((a, b) => a.rank - b.rank));

// Detect duplicate show names
const showNameCounts = $derived(
  sortedShows.reduce((acc, show) => {
    acc[show.name] = (acc[show.name] || 0) + 1;
    return acc;
  }, {}),
);

const yAccessor = (d) => d.episodeRating;

// Shared width that all charts will use
let width = $state(500);
const height = 200;

const margins = {
  marginTop: 40,
  marginRight: 55,
  marginBottom: 65,
  marginLeft: 55,
};

// Compute scales once in parent - yScale is shared, but xScale is now per-chart
const boundedWidth = $derived(width - margins.marginLeft - margins.marginRight);
const boundedHeight = height - margins.marginTop - margins.marginBottom;

const yScale = $derived(
  d3
    .scaleLinear()
    .domain([0, d3.max(episodes, yAccessor)])
    .range([boundedHeight, 0])
    .nice(),
);
</script>

<div class="results-note-section">
  {#if sortedShows.length > 0}
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-lg font-semibold leading-none">
        {sortedShows.length}
        {sortedShows.length === 1 ? "result" : "results"}
        {sortedShows.length === 1 ? "matches" : "match"} the active filters
      </h1>

      <div class="flex items-center">
        <Toggle
          bind:checked={showDetails}
          label="Show / hide details"
          id="details-toggle"
        />
      </div>
    </div>
  {:else}
    <div class="mb-5">
      <h1 class="text-lg font-semibold leading-none">
        No results match the active filters
      </h1>
    </div>
  {/if}
</div>
<div class="line-charts" bind:clientWidth={width}>
  {#each sortedShows as show, i}
    <LazyLineChart
      showName={show.name}
      rank={show.rank}
      episodeData={episodes.filter((ep) => ep.seriesRank === show.rank)}
      overallRating={show.overall_ratings}
      seasons={show.seasons}
      episodes={show.episodes}
      storyline={show.storyline}
      genres={show.genres}
      link={show.link}
      {yScale}
      {width}
      {height}
      {margins}
      {boundedWidth}
      {boundedHeight}
      {showDetails}
      numberOfRatings={show.numberOfRatings}
      timeRange={show.timeRange}
      isDuplicateName={showNameCounts[show.name] > 1}
    />
  {/each}
</div>

<style>
.line-charts {
  width: 100%;
}
.results-note-section {
  margin-bottom: 3rem;
}
</style>
