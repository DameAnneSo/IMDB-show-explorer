<script>
import * as d3 from "d3";
import LineChart from "./LineChart.svelte";
import Toggle from "./Toggle.svelte";

let { shows = [], episodes = [], maxSeasons } = $props();

let showAnnotations = $state(true);

const maxEpisodes = $derived(
  shows.reduce((max, show) => {
    return show.episodes > max ? show.episodes : max;
  }, 0)
);

const sortedShows = $derived(
  shows.sort((a, b) => {
    if (b.overall_ratings !== a.overall_ratings) {
      return b.overall_ratings - a.overall_ratings;
    }
    return a.name.localeCompare(b.name);
  })
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

// Compute scales once in parent - all charts share the same scales
const boundedWidth = $derived(width - margins.marginLeft - margins.marginRight);
const boundedHeight = height - margins.marginTop - margins.marginBottom;

const xScale = $derived(
  d3.scaleLinear().domain([1, maxEpisodes]).range([0, boundedWidth])
);

const yScale = $derived(
  d3
    .scaleLinear()
    .domain([0, d3.max(episodes, yAccessor)])
    .range([boundedHeight, 0])
    .nice()
);
</script>

<h1 class="mb-5">
  {#if sortedShows.length === 0}
    No shows correspond to your filters
  {:else}
    Result of your selection: {sortedShows.length} {sortedShows.length === 1 ? 'show' : 'shows'}
  {/if}
</h1>

{#if sortedShows.length > 0}
<div class="mb-5">
  <div class="flex items-center">
    <Toggle
      bind:checked={showAnnotations}
      label="Show annotations (season bands and min/max ratings)"
      id="annotations-toggle"
    />
  </div>
</div>
{/if}

<div class="line-charts" bind:clientWidth={width}>
  {#each sortedShows as show, i}
    <LineChart
      showName={show.name}
      episodeData={episodes.filter((ep) => ep.seriesTitle == show.name)}
      overallRating={show.overall_ratings}
      seasons={show.seasons}
      {maxSeasons}
      episodes={show.episodes}
      {xScale}
      {yScale}
      {width}
      {height}
      {margins}
      {boundedHeight}
      {showAnnotations}
    />
  {/each}
</div>

<style>
.line-charts {
  width: 100%;
}
</style>
