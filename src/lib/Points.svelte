<script>
  import * as d3 from 'd3';

  let { episodeData, xScale, yScale, xAccessor, yAccessor, width } = $props();

  // Calculate min and max ratings
  const maxRating = $derived(d3.max(episodeData, yAccessor));
  const minRating = $derived(d3.min(episodeData, yAccessor));

  // Helper function to determine dot color
  const getDotColor = (episode) => {
    const rating = yAccessor(episode);
    if (rating === maxRating) return 'var(--warn-neg-5)';
    if (rating === minRating) return 'var(--warn-pos-3)';
    return 'var(--color-primary)';
  };

  // Helper function to determine dot radius
  const getDotRadius = (episode) => {
    const rating = yAccessor(episode);
    const baseRadius = width > 700 ? 3 : 2;
    // Make min/max dots slightly larger
    if (rating === maxRating || rating === minRating) return baseRadius + 1;
    return baseRadius;
  };
</script>

<g class="points">
  {#each episodeData as episode (episode)}
    <circle
      cx={xScale(xAccessor(episode))}
      cy={yScale(yAccessor(episode))}
      r={getDotRadius(episode)}
      fill={getDotColor(episode)}
      stroke="white"
      stroke-width="0.3"
    />
  {/each}
</g>
