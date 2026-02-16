<script>
  let {
    yAccessor,
    xAccessorScaled,
    yAccessorScaled,
    width,
    margins,
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
  <div class="tooltip_header">
    <div class="tooltip_top_line">
      <span class="tooltip_intro">
        episode {data.episodeNumberOverall} (season {data.episodeSeason} | episode
        {data.episodeNumberinSeason})
      </span>
    </div>
    <p class="tooltip_title">"{data.episodeTitle}"</p>
  </div>

  <hr class="divider" />
  <div>
    <span class="rating">{formatYForTooltip(yAccessor)}/10</span>
    <span class="votes">(<b>{data.episodeVotes.toLocaleString()}</b> votes)</span>
  </div>
</div>

<style>
  .tooltip {
    position: absolute;
    top: -12px;
    left: 0;
    padding: 0.6em 0.5em;
    pointer-events: none;
    background: var(--color-neutral-50);
    border-radius: 2px;
    font-size: 14px;
    text-align: left;
    transition: transform 300ms ease;
    box-shadow: var(--box-shadow);
  }

  .tooltip_header {
    display: flex;
    flex-direction: column;
  }

  .tooltip_top_line {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tooltip_intro {
    font-weight: 700;
    color: var(--color-neutral-500);
    text-transform: uppercase;
    font-size: 0.7rem;
  }

  .tooltip_title {
    font-weight: 700;
    color: var(--color-neutral-600);
    width: 100%;
    margin: -2px 0 0 0;
  }

  .divider {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .rating {
    text-transform: uppercase;
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-primary);
    background-color: var(--color-primary-100);
    border-radius: 3px;
    padding: 0px 4px;
  }

  .votes {
    color: var(--color-neutral-500);
    font-weight: 400;
  }
</style>
