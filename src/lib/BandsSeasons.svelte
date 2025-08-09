<script>
let {episodeData, xScale, boundedHeight } = $props();

// Group data by season and find the episode range for each season
const seasonRanges =
  episodeData?.reduce((acc, d) => {
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
const seasons = Object.values(seasonRanges).sort((a, b) => a.season - b.season);

// Create bands with alternating colors
const seasonBands = seasons.map((season, index) => {
  const x = xScale(season.minEpisode);
  const width = xScale(season.maxEpisode) - xScale(season.minEpisode);

  return {
    ...season,
    x,
    width,
    fill:
      index % 2 === 0 ? "var(--color-neutral-50)" : "var(--color-neutral-200)", // Make gray more visible for debugging
    opacity: 1, // Make both visible for debugging
  };
});

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
