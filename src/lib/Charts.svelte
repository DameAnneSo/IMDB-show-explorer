<script>
  import * as d3 from 'd3';
  import LazyLineChart from './LazyLineChart.svelte';

  let { shows = [], episodes = [] } = $props();

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
    <div class="mb-5">
      <h1 class="text-lg font-semibold leading-none">
        {sortedShows.length}
        {sortedShows.length === 1 ? 'result' : 'results'}
        {sortedShows.length === 1 ? 'matches' : 'match'} the active filters
      </h1>
    </div>
  {:else}
    <div class="mb-5">
      <h1 class="text-lg font-semibold leading-none">No results match the active filters</h1>
    </div>
  {/if}
</div>
<div class="line-charts" bind:clientWidth={width}>
  {#each sortedShows as show (show)}
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
      numberOfRatings={show.numberOfRatings}
      timeRange={show.timeRange}
      isDuplicateName={showNameCounts[show.name] > 1}
    />
  {/each}
</div>

<small class="note">
  IMDb notes: The list is ranked using a formula that considers both the total number of user
  ratings each TV show has received and the ratings from regular users. To qualify, a series must
  have at least 10,000 user ratings and must have aired a minimum of 5 episodes.
</small>

<style>
  .line-charts {
    width: 100%;
  }
  .results-note-section {
    margin-bottom: 3rem;
  }

  small {
    display: block;
    margin-bottom: 2rem;
    color: var(--color-neutral-800);
  }
</style>
