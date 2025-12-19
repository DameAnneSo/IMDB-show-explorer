<script>
let { yScale } = $props();

const numberOfTicks = (pixelsAvailable, pixelsPerTick = 40) =>
  Math.floor(Math.abs(pixelsAvailable) / pixelsPerTick);

const [yMin, yMax] = $derived(yScale.range());

const ticks = $derived(yScale.ticks(numberOfTicks(yMax - yMin)));
</script>

<g>
  <line class="axis__line" x1={0} x2={0} y1={yMin} y2={yMax} />

  {#each ticks as tick}
    <g transform={`translate(0 ${yScale(tick)})`}>
      <line class="axis__tick" x1={0} x2={-6} />

      <text class="axis__tick-label"
      dx={-10} dy="0.34em" text-anchor="end">
        {tick}
      </text>
    </g>
  {/each}

  <!-- <text class="axis__label" dx={4} y={-25} dy="0.8em"> -->
  <text class="axis__label" x={-20} y={-15}> rating </text>
</g>

<style>
.axis__line {
  stroke:var(--color-neutral-400);
}

.axis__tick {
  stroke:var(--color-neutral-400);
}

.axis__label {
  fill: var(--color-neutral-600);
}

.axis__tick-label {
  fill: var(--color-neutral-500);
}
</style>
