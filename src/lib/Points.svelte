<script>
  let { episodeData, xScale, yScale, xAccessor, yAccessor, width, bestEpisode, worstEpisode } =
    $props();

  // Helper function to determine dot color using identity comparison
  const getDotColor = (episode) => {
    if (episode === bestEpisode) return 'var(--warn-neg-5)';
    if (episode === worstEpisode) return 'var(--warn-pos-3)';
    return 'var(--color-primary)';
  };

  // Helper function to determine dot radius
  const getDotRadius = (episode) => {
    const baseRadius = width > 700 ? 3 : 2;
    if (episode === bestEpisode || episode === worstEpisode) return baseRadius + 1;
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
