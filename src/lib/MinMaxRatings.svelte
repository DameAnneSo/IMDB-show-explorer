<script>
  let { xAccessor, yAccessor, xScale, yScale, bestEpisode, worstEpisode } = $props();

  const maxX = $derived(xScale(xAccessor(bestEpisode)));
  const minX = $derived(xScale(xAccessor(worstEpisode)));
  const scaledMaxY = $derived(yScale(yAccessor(bestEpisode)));
  const scaledMinY = $derived(yScale(yAccessor(worstEpisode)));

  // Calculate text dimensions for background rectangles
  const fontSize = 12;
  const paddingVertical = 4;
  const paddingHorizontal = 1;
  const maxText = $derived(`${bestEpisode.episodeRating.toFixed(1)}/10`);
  const minText = $derived(`${worstEpisode.episodeRating.toFixed(1)}/10`);

  // Approximate text width
  const maxTextWidth = $derived(maxText.length * fontSize * 0.6 + paddingHorizontal * 2);
  const minTextWidth = $derived(minText.length * fontSize * 0.6 + paddingHorizontal * 2);
  const rectHeight = $derived(fontSize + paddingVertical * 2);
</script>

<g class="pictos">
  <!-- Background rectangle for highest point -->
  <rect
    class="highest_background"
    x={maxX - maxTextWidth / 2}
    y={scaledMaxY - rectHeight - 7}
    width={maxTextWidth}
    height={rectHeight}
    rx="3"
  />

  <!-- above the max point -->
  <text
    class="highest"
    x={maxX}
    y={scaledMaxY - 7 - rectHeight / 2}
    text-anchor="middle"
    font-size="12"
    dominant-baseline="middle"
  >
    {bestEpisode.episodeRating.toFixed(1)}/10
  </text>

  <!-- Background rectangle for lowest point -->
  <rect
    class="lowest_background"
    x={minX - minTextWidth / 2}
    y={scaledMinY + 5}
    width={minTextWidth}
    height={rectHeight}
    rx="3"
  />

  <!-- below the min point -->
  <text
    class="lowest"
    x={minX}
    y={scaledMinY + 5 + rectHeight / 2}
    text-anchor="middle"
    font-size="12"
    dominant-baseline="middle"
  >
    {worstEpisode.episodeRating.toFixed(1)}/10
  </text>
</g>

<style>
  .pictos {
    pointer-events: none;
  }

  text {
    font-weight: 600;
  }

  .highest {
    fill: var(--warn-neg-5);
  }

  .lowest {
    fill: var(--warn-pos-5);
  }

  .highest_background {
    fill: var(--warn-neg-0);
    opacity: 0.9;
  }

  .lowest_background {
    fill: var(--warn-pos-0);
    opacity: 0.9;
  }
</style>
