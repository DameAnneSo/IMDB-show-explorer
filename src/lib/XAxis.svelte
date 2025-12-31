<script>
let { xScale, height, margins } = $props();

const numberOfTicks = (pixelsAvailable, pixelsPerTick = 80) =>
  Math.floor(Math.abs(pixelsAvailable) / pixelsPerTick);

const [xMin, xMax] = $derived(xScale.range());
const [domainMin, domainMax] = $derived(xScale.domain());

const defaultTicks = $derived(xScale.ticks(numberOfTicks(xMax - xMin)));

// Filter out non-integer ticks if the domain is small
const ticks = $derived(
  domainMax <= 20
    ? defaultTicks.filter((tick) => Number.isInteger(tick))
    : defaultTicks
);

</script>

<g
  transform={`translate(0 ${height - margins.marginTop - margins.marginBottom})`}
>
  <line class="axis__line" x1={xMin} x2={xMax} y1={0} y2={0} />

  {#each ticks as tick}
    <g transform={`translate(${xScale(tick)} 0)`}>
      <line class="axis__tick" y1={0} y2={6} />
      <text
        class="axis__tick-label"
        y={10}
        dy="0.7em"
        text-anchor="middle"
        fill="#000000"
      >
        {tick}
      </text>
    </g>
  {/each}

  <text
    class="axis__label"
    x={xScale.range()[1] / 2}
    text-anchor="middle"
    y={37}
  >
    episode number
  </text>
</g>

<style>
.axis__line {
  stroke: var(--color-neutral-400);
}

.axis__tick {
  stroke: var(--color-neutral-400);
}

.axis__label {
  fill: var(--color-neutral-600);
  font-size: 13px;
}

.axis__tick-label {
  fill: var(--color-neutral-500);
}
</style>
