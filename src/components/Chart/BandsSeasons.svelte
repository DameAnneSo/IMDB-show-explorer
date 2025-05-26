<script>
export let data;
export let xScale;
export let boundedHeight;

// Group data by season and find the episode range for each season
$: seasonRanges =
  data?.reduce((acc, d) => {
    const season = d.episodeSeason;
    if (!acc[season]) {
      acc[season] = {
        season,
        minEpisode: d.episodeNumberOverall,
        maxEpisode: d.episodeNumberOverall,
      };
    } else {
      acc[season].minEpisode = Math.min(
        acc[season].minEpisode,
        d.episodeNumberOverall
      );
      acc[season].maxEpisode = Math.max(
        acc[season].maxEpisode,
        d.episodeNumberOverall
      );
    }
    return acc;
  }, {}) || {};

// Convert to array and sort by season number
$: seasons = Object.values(seasonRanges).sort((a, b) => a.season - b.season);

// Create bands with alternating colors
$: seasonBands = seasons.map((season, index) => {
  const x = xScale(season.minEpisode);
  const width = xScale(season.maxEpisode) - xScale(season.minEpisode);

  return {
    ...season,
    x,
    width,
    fill:
      index % 2 === 0 ? "var(--color-neutral-50)" : "var(--color-neutral-100)", // Make gray more visible for debugging
    opacity: 1, // Make both visible for debugging
  };
});

// $: console.log('Seasons array:', seasons);
// $: console.log('Season bands:', seasonBands);
</script>

{#if seasons.length > 1}
  {#each seasonBands as band, i}
    <rect
      x={band.x}
      y={0}
      width={band.width}
      height={boundedHeight}
      fill={band.fill}
      fill-opacity={band.opacity}
    />
    <!-- Add text labels for debugging -->
    <text
      x={band.x + band.width / 2}
      y={boundedHeight - 10}
      text-anchor="middle"
      font-size="12"
      fill="#666"
    >
      S{band.season}
    </text>
  {/each}
{/if}
