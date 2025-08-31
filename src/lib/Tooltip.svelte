<script>
let {
  xAccessor,
  yAccessor,
  xAccessorScaled,
  yAccessorScaled,
  width,
  margins,
  formatX,
  formatYForTooltip,
  data,
} = $props();

let tooltipWidth = $state();

const x = $derived(xAccessorScaled + margins.marginLeft);
const y = $derived(yAccessorScaled + margins.marginTop);

const xNudge = 15;
const yNudge = 15;

const isFallingOffChart = $derived(tooltipWidth + x > width);
const xPosition = $derived(isFallingOffChart ? x - tooltipWidth - xNudge : x + xNudge);
const yPosition = $derived(y + yNudge);
</script>

<div
  bind:clientWidth={tooltipWidth}
  class="tooltip"
  style="transform: translate({xPosition}px, {yPosition}px)"
>
  <div>
    <span class="tooltip_intro">
      episode {formatX(xAccessor)} | season {data.episodeSeason}</span
    >
    <span class="tooltip_main">
      <span class="tooltip_accent">{formatYForTooltip(yAccessor)}/10</span>
      <span class="tooltip_receeded">{data.episodeVotes} votes</span>
    </span>
  </div>
</div>

<style>
.tooltip {
  position: absolute;
  top: -12px;
  left: 0;
  padding: 0.6em 0.5em;
  pointer-events: none;
  background: var(--color-neutral-100);
  border-radius: 2px;
  font-size: 14px;
  text-align: left;
  transition: transform 300ms ease;
}

.tooltip_main {
  display: block;
  margin-bottom: 0.3em;
}

.tooltip_accent {
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  background-color: var(--color-100);
  border-radius: 3px;
  padding: 0px 4px;
}

.tooltip_receeded {
  font-size: 0.8rem;
  color: var(--color-neutral-700);
}

.tooltip_intro {
  font-weight: 700;
  color: var(--color-neutral-500);
  text-transform: uppercase;
  font-size: 0.8rem;
}
</style>
