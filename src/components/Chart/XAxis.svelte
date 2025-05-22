<script>
import { getContext } from "svelte";

export let scale;
export let label;
export let formatTick;

const { dimensions: dimensionsStore } = getContext("chart");
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

  <text class="axis__label" x={scale.range()[1] + 5} text-anchor="end" y={40}>
    {label}
  </text>
</g>

<style>
.axis__line {
  stroke: var(--color-neutral-300);
}

.axis__tick-line {
  stroke: var(--color-neutral-300);
}

.axis__tick-text {
  fill: var(--color-neutral-600);
  font-size: 0.75rem;
}

.axis__label {
  fill: var(--color-neutral-700);
  font-style: italic;
}

.axis__label {
  font-size: 12px;
}
</style>
