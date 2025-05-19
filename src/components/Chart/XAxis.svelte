<script>
  import { getContext } from 'svelte';

  export let scale;
  export let label;
  export let formatTick;

  const { dimensions: dimensionsStore } = getContext('chart');
  $: dimensions = $dimensionsStore;

  const numberOfTicks = (pixelsAvailable, pixelsPerTick = 140) =>
    Math.floor(Math.abs(pixelsAvailable) / pixelsPerTick);

  $: [xMin, xMax] = scale.range();

  $: ticks = scale.ticks(numberOfTicks(xMax - xMin));
</script>

<g transform={`translate(0 ${dimensions.boundedHeight})`}>
  <line class="axis__line" x1={xMin} x2={xMax} y1={0} y2={0} />

  {#each ticks as tick}
    <g transform={`translate(${scale(tick)} 0)`}>
      <line class="axis__tick-line" y1={0} y2={6} />
      <text class="axis__tick-text" y={10} dy="0.8em" text-anchor="middle">
        {formatTick(tick)}
      </text>
    </g>
  {/each}

  <text
    class="axis__label"
    x={scale.range()[1] / 2}
    text-anchor="middle"
    y={50}
  >
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