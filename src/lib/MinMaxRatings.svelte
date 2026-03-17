<script>
  import * as d3 from 'd3';
  let { episodeData, xAccessor, yAccessor, xScale, yScale } = $props();

  // Find the max and min values using unscaled access
  const maxY = $derived(d3.max(episodeData, yAccessor));
  const minY = $derived(d3.min(episodeData, yAccessor));

  // Find the full episodeData points at those positions
  const maxPoint = $derived(episodeData.find((d) => yAccessor(d) === maxY));
  const minPoint = $derived(episodeData.find((d) => yAccessor(d) === minY));

  // Get the already-scaled x/y positions
  const maxX = $derived(xScale(xAccessor(maxPoint)));
  const minX = $derived(xScale(xAccessor(minPoint)));
  const scaledMaxY = $derived(yScale(maxY));
  const scaledMinY = $derived(yScale(minY));

  // Calculate text dimensions for background rectangles
  const fontSize = 12;
  const paddingVertical = 4;
  const paddingHorizontal = 1;
  const maxText = $derived(`${maxPoint.episodeRating.toFixed(1)}/10`);
  const minText = $derived(`${minPoint.episodeRating.toFixed(1)}/10`);
  // Approximate text width (you can adjust the multiplier as needed)
  const maxTextWidth = $derived(maxText.length * fontSize * 0.6 + paddingHorizontal * 2);
  const minTextWidth = $derived(minText.length * fontSize * 0.6 + paddingHorizontal * 2);
  const rectHeight = $derived(fontSize + paddingVertical * 2);
</script>

<g class="pictos">
  <!-- Dots for highest and lowest points -->
  <circle class="highest-dot" cx={maxX} cy={scaledMaxY} r="4" />
  <circle class="lowest-dot" cx={minX} cy={scaledMinY} r="4" />

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
    {maxPoint.episodeRating.toFixed(1)}/10
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
    {minPoint.episodeRating.toFixed(1)}/10
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

  .highest-dot {
    fill: var(--warn-neg-5);
  }

  .lowest-dot {
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
