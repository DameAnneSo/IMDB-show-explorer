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

  // Create bands with alternating colors
  const seasonBands = $derived(
    seasons.map((season, index) => {
      const x = xScale(season.minIndex);
      const width = xScale(season.maxIndex) - xScale(season.minIndex);
      return {
        x,
        width,
        season: season.season,
        color: index % 2 === 0 ? 'var(--color-neutral-50)' : 'var(--color-neutral-150)',
      };
    }),
  );

  // Minimum width threshold for showing labels (in pixels)
  const minLabelWidth = $derived(windowWidth < 768 ? 17 : 20);
</script>

{#if seasons.length > 1}
  {#each seasonBands as band (band)}
    <rect x={band.x} y={0} width={band.width} height={boundedHeight} fill={band.color} />
    {#if band.width >= minLabelWidth}
      <text
        x={band.x + band.width / 2}
        y={boundedHeight - 10}
        text-anchor="middle"
        font-size="12"
        fill="var(--color-neutral-600)"
      >
        s{band.season}
      </text>
    {/if}
  {/each}
{/if}
