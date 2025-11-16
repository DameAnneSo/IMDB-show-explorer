<script>
  let {xScale, height, margins, maxSeasons } = $props();
  
  const numberOfTicks = (pixelsAvailable, pixelsPerTick = 80) =>
    Math.floor(Math.abs(pixelsAvailable) / pixelsPerTick);
  
  const [xMin, xMax] = $derived(xScale.range());
  
  const defaultTicks = $derived(xScale.ticks(numberOfTicks(xMax - xMin)));
  
  // Filter out non-integer ticks
  const ticks = $derived(
    maxSeasons <= 2
      ? defaultTicks.filter(tick => Number.isInteger(tick))
      : defaultTicks
  );
</script>

<g transform={`translate(0 ${height - margins.marginTop - margins.marginBottom})`}>
  <line class="axis__line" x1={xMin} x2={xMax} y1={0} y2={0} />

  {#each ticks as tick}
    <g transform={`translate(${xScale(tick)} 0)`}>
      <line class="axis__tick" y1={0} y2={6} />
      <text
        y={10}
        dy="0.8em"
        text-anchor="middle"
        fill='#000000'
      >
        {tick}
      </text>
    </g>
  {/each}

  <text
    class="axis__label"
    x={xScale.range()[1] / 2}
    text-anchor="middle"
    y={50}
  >
    episode number
  </text>
</g>

<style>
  .axis__line {
    stroke: #bdc3c7;
  }

  .axis__tick {
    stroke: #bdc3c7;
  }

  .axis__label {
    fill: #000000;
  }
</style>