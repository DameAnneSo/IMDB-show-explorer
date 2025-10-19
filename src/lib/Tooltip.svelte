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
const xPosition = $derived(
  isFallingOffChart ? x - tooltipWidth - xNudge : x + xNudge
);
const yPosition = $derived(y + yNudge);
</script>

<div
  bind:clientWidth={tooltipWidth}
  class="tooltip"
  style="transform: translate({xPosition}px, {yPosition}px)"
>
  <div class="tooltip_header">
    <div class="tooltip_top_line">
      <span class="tooltip_intro">
        episode {data.episodeNumberinSeason} | season {data.episodeSeason}
      </span>
      <span class="tooltip_accent">{formatYForTooltip(yAccessor)}/10</span>
    </div>
    <p class="tooltip_title">"{data.episodeTitle}"</p>
  </div>

  <hr class="divider" />
  <table class="tooltip_table">
    <tbody>
      <tr>
        <td class="label">Number of votes:</td>
        <td class="value">{data.episodeVotes || "include later"}</td>
      </tr>
      <tr>
        <td class="label">Episode's number overall:</td>
        <td class="value">{data.episodeNumberOverall}</td>
      </tr>
    </tbody>
  </table>
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

.tooltip_header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tooltip_top_line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tooltip_accent {
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  background-color: var(--color-100);
  border-radius: 3px;
  padding: 0px 4px;
  margin-left: 0;
}

.tooltip_intro {
  font-weight: 700;
  color: var(--color-neutral-500);
  text-transform: uppercase;
  font-size: 0.8rem;
}

.tooltip_title {
  font-weight: 600;
  color: var(--color-neutral-500);
  margin: 0;
  width: 100%;
}

.divider {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  margin-top: 5px;
  margin-bottom: 5px;
}

.tooltip_table {
  width: 100%;
  margin-top: 0.5em;
}

.tooltip_table td {
  padding: 2px 0;
  border: none;
}

.value {
  text-align: end;
  font-weight: 600;
  color: var(--color-neutral-800);
}

.label {
  text-align: left;
  font-weight: 400;
  color: var(--color-neutral-500);
  opacity: 0.8;
  padding-right: 12px; /* Breathing space between columns */
  font-size: 0.85em; /* Slightly smaller to recede */
}
</style>
