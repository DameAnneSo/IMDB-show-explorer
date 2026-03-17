<script>
  let { episodeData, xScale, boundedHeight } = $props();

  let windowWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 1024);

  $effect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      windowWidth = window.innerWidth;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  // Group data by season and find the index range for each season
  const seasonRanges = $derived(
    episodeData?.reduce((acc, d, index) => {
      const season = d.episodeSeason;
      const episodeIndex = index + 1; // 1-indexed
      if (!acc[season]) {
        acc[season] = {
          season: +season,
          minIndex: episodeIndex,
          maxIndex: episodeIndex,
        };
      } else {
        acc[season].minIndex = Math.min(acc[season].minIndex, episodeIndex);
        acc[season].maxIndex = Math.max(acc[season].maxIndex, episodeIndex);
      }
      return acc;
    }, {}) || {},
  );

  // Convert to array and sort by season number
  const seasons = $derived(Object.values(seasonRanges).sort((a, b) => a.season - b.season));

  // Create season markers with vertical lines
  const seasonMarkers = $derived(
    seasons.map((season, index) => {
      const x = xScale(season.minIndex);
      const nextX = index < seasons.length - 1 ? xScale(seasons[index + 1].minIndex) : Infinity;
      const widthToNext = nextX - x;
      return {
        x,
        season: season.season,
        widthToNext,
      };
    }),
  );

  // Minimum width threshold for showing labels (in pixels)
  const minLabelWidth = $derived(windowWidth < 768 ? 23 : 20);
</script>

{#if seasons.length > 1}
  {#each seasonMarkers as marker (marker)}
    <!-- Vertical line at the start of each season -->
    <line
      x1={marker.x}
      y1={0}
      x2={marker.x}
      y2={boundedHeight}
      stroke="white"
      stroke-width="2"
      opacity="1"
    />
    <!-- Season label, skip for season 1, and only show if there's enough space -->
    {#if marker.widthToNext >= minLabelWidth}
      <text
        x={marker.x + 6}
        y={boundedHeight - 10}
        text-anchor="start"
        font-size="12"
        fill="var(--color-neutral-600)"
      >
        s{marker.season}
      </text>
    {/if}
  {/each}
{/if}
