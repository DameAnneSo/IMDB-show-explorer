<script>
  export let scale;
  export let label;
  export let formatTick;

  const numberOfTicks = (pixelsAvailable, pixelsPerTick = 50) =>
    Math.floor(Math.abs(pixelsAvailable) / pixelsPerTick);

  $: [yMin, yMax] = scale.range();

  $: ticks = scale.ticks(numberOfTicks(yMax - yMin));
</script>

<g>
  <line class="axis__line" x1={0} x2={0} y1={yMin} y2={yMax} />

  {#each ticks as tick}
    <g transform={`translate(0 ${scale(tick)})`}>
      <line class="axis__tick-line" x1={0} x2={-6} />
      <text class="axis__tick-text" dx={-10} dy="0.34em" text-anchor="end">
        {formatTick(tick)}
      </text>
    </g>
  {/each}

  <text class="axis__label" dx={4} y={-25} dy="0.8em">
    {label}
  </text>
</g>

<style>
  .axis__line {
    stroke: #bdc3c7;
  }

  .axis__tick-line {
    stroke: #bdc3c7;
  }

  .axis__tick-text {
    fill: #282828;
  }

  .axis__label {
    fill: #282828;
  }
</style>