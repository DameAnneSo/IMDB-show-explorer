<script>
  import * as d3 from 'd3';
  import LineChart from './LineChart.svelte';
  
  let { shows = [], episodes = [] } = $props();
  $inspect(episodes);
  $inspect(shows);

  const maxEpisodes = $derived(shows.reduce((max, show) => {
    return show.episodes > max ? show.episodes : max;
  }, 0));

  const sortedShowNames = $derived(shows
    .sort((a, b) => {
      if (b.overall_rating !== a.overall_rating) {
        return b.overall_rating - a.overall_rating;
      }
      return a.name.localeCompare(b.name);
    })
    .map(show => show.name));

  const sortedShows = $derived(shows.sort((a, b) => {
    if (b.overall_rating !== a.overall_rating) {
      return b.overall_rating - a.overall_rating;
    }
    return a.name.localeCompare(b.name);
  }));

  const xAccessor = d => d.episodes;
  const yAccessor = d => d.episodeRating;

  let width = 100;
  const height = 200;
  
  const margins = {
    marginTop: 40,
    marginRight: 55,
    marginBottom: 65,
    marginLeft: 55,
  };

  const dimensions = $derived({
    width,
    height,
    ...margins,
    boundedHeight: Math.max(
      height - margins.marginTop - margins.marginBottom,
      0,
    ),
    boundedWidth: Math.max(width - margins.marginLeft - margins.marginRight, 0),
  });

  const xScale = $derived(d3
    .scaleBand()
    .domain([1, maxEpisodes])
    .range([0, dimensions.boundedWidth])
    .padding(0.25));

  const yScale = $derived(d3
    .scaleLinear()
    .domain([0, d3.max(episodes, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice());
</script>

<div class="line-charts">
  {#each sortedShows as show, i}
    <LineChart
      showName={show.name}
      overallRating={show.overall_rating}
      seasons={show.seasons}
      episodes={show.episodes}
      {xScale}
      {yScale}
    />      
  {/each}
</div>
