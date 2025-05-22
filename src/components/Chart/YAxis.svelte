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
        {formatTick(tick)}{tick === Math.max(...ticks) ? "/10" : ""}
      </text>
    </g>
  {/each}

  <text class="axis__label" dx={0} y={-25} dy="0.8em" text-anchor="end">
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
