<script>
  import * as d3 from 'd3';
  import LineChart from './LineChart.svelte';
  
  let { shows = [], episodes = [] } = $props();

  const maxEpisodes = $derived(shows.reduce((max, show) => {
    return show.episodes > max ? show.episodes : max;
  }, 0));

  const sortedShows = $derived(shows.sort((a, b) => {
    if (b.overall_ratings !== a.overall_ratings) {
      return b.overall_ratings - a.overall_ratings;
    }
    return a.name.localeCompare(b.name);
  }));

  const yAccessor = d => d.episodeRating;

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

  const xScale = $derived(d3
    .scaleLinear()
    .domain([1, maxEpisodes])
    .range([0, boundedWidth])
  );

  const yScale = $derived(d3
    .scaleLinear()
    .domain([0, d3.max(episodes, yAccessor)])
    .range([boundedHeight, 0])
    .nice()
  );
</script>

<div class="line-charts" bind:clientWidth={width}>
  {#each sortedShows as show, i}
    <LineChart
      showName={show.name}
      episodeData = {episodes.filter(ep => ep.seriesTitle == show.name)}
      overallRating={show.overall_ratings}
      seasons={show.seasons}
      episodes={show.episodes}
      {xScale}
      {yScale}
      {width}
      {height}
      {margins}
    />      
  {/each}
</div>

<style>
  .line-charts {
    width: 100%;
  }
</style>
