<script>
import * as d3 from "d3";
import LineChart from "./LineChart.svelte";
import Toggle from "./Toggle.svelte";

let { shows = [], episodes = [], maxSeasons } = $props();

let showAnnotations = $state(true);

const sortedShows = $derived(shows.sort((a, b) => a.rank - b.rank));

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
    .nice()
);
</script>

<div class="results-note-section">
  {#if sortedShows.length > 0}
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-lg font-semibold leading-none">
        Result of your selection: {sortedShows.length}
        {sortedShows.length === 1 ? "show" : "shows"}
      </h1>

      <div class="flex items-center">
        <Toggle
          bind:checked={showAnnotations}
          label="Show / hide annotations"
          id="annotations-toggle"
        />
      </div>
    </div>
  {:else}
    <h1 class="mb-5 text-center">No shows correspond to your filters</h1>
  {/if}
</div>
<div class="line-charts" bind:clientWidth={width}>
  {#each sortedShows as show, i}
    <LineChart
      showName={show.name}
      rank={show.rank}
      episodeData={episodes.filter((ep) => ep.seriesRank === show.rank)}
      overallRating={show.overall_ratings}
      seasons={show.seasons}
      {maxSeasons}
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
      {showAnnotations}
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
