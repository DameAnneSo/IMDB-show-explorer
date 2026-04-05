<script>
  import * as d3 from 'd3';
  import XAxis from './XAxis.svelte';
  import YAxis from './YAxis.svelte';
  import SeasonBands from './SeasonBands.svelte';
  import Points from './Points.svelte';
  import MinMaxRatings from './MinMaxRatings.svelte';
  import HoveredPoint from './HoveredPoint.svelte';
  import Tooltip from './Tooltip.svelte';
  import Gradient from './Gradient.svelte';

  let {
    showName,
    rank,
    episodeData,
    overallRating,
    seasons,
    episodes,
    storyline,
    genres,
    link,
    yScale,
    width,
    height,
    margins,
    boundedWidth,
    boundedHeight,
    numberOfRatings,
    timeRange,
    isDuplicateName = false,
  } = $props();

  // Filter out invalid data points first
  const validData = $derived(
    episodeData?.filter((d) => {
      const y = +d.episodeRating;
      const x = +d.episodeNumberOverall;
      return !isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y) && x > 0 && y > 0;
    }) || [],
  );

  // Create xScale based on the count of valid episodes (1-indexed)
  const xScale = $derived(d3.scaleLinear().domain([1, validData.length]).range([0, boundedWidth]));

  const formattedGenres = $derived(
    genres
      ? genres
          .split(',')
          .map((g) => g.trim())
          .sort()
          .join(' · ')
      : '',
  );

  const yAccessor = (d) => +d.episodeRating;

  // Use index-based x accessor (1-indexed position in validData array)
  const xAccessor = (d) => validData.indexOf(d) + 1;

  const xAccessorScaled = $derived((d) => xScale(xAccessor(d)));
  const yAccessorScaled = $derived((d) => yScale(yAccessor(d)));

  // Check if there are episodes without ratings (not aired yet)
  const hasUnratedEpisodes = $derived(episodeData && episodeData.length > validData.length);

  // Check if there are missing episodes (e.g., bonus episodes not plotted)
  const hasMissingEpisodes = $derived(episodeData && episodes && episodeData.length < episodes);

  // Find the best episode using tiebreaker: highest rating, then highest votes
  const bestEpisode = $derived(() => {
    if (!validData.length) return null;
    const max = d3.max(validData, yAccessor);
    const tied = validData.filter((d) => yAccessor(d) === max);
    return tied.reduce((best, d) => (d.episodeVotes > best.episodeVotes ? d : best), tied[0]);
  });

  // Find the worst episode using tiebreaker: lowest rating, then highest votes
  const worstEpisode = $derived(() => {
    if (!validData.length) return null;
    const min = d3.min(validData, yAccessor);
    const tied = validData.filter((d) => yAccessor(d) === min);
    return tied.reduce((worst, d) => (d.episodeVotes > worst.episodeVotes ? d : worst), tied[0]);
  });

  const maxRating = $derived(bestEpisode() ? yAccessor(bestEpisode()) : null);
  const minRating = $derived(worstEpisode() ? yAccessor(worstEpisode()) : null);

  let hoveredPoint = $state(null);

  // Check if hovered point is best or worst episode using identity comparison
  const isBestEpisode = $derived(hoveredPoint && hoveredPoint === bestEpisode());
  const isWorstEpisode = $derived(hoveredPoint && hoveredPoint === worstEpisode());

  // Function created using D3's bisector utility that helps find the closest data point when hovering over the chart
  const bisectX = d3.bisector(xAccessor).left;
  const handleMouseMove = (event) => {
    // Get the x-coordinate of the mouse event and find the closest data point
    const xCoordinate = xScale.invert(event.offsetX - margins.marginLeft);
    const index = bisectX(validData, xCoordinate);
    hoveredPoint = validData[index - 1];
  };

  const handleMouseLeave = () => {
    hoveredPoint = null;
  };

  const lineGenerator = $derived(
    d3
      .line()
      .x((d) => xAccessorScaled(d))
      .y((d) => yAccessorScaled(d))
      .curve(d3.curveMonotoneX)
      .defined((d) => {
        const x = xAccessorScaled(d);
        const y = yAccessorScaled(d);
        return !isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y);
      }),
  );

  const line = $derived(lineGenerator(validData));

  const formatYForTooltip = d3.format(',.1f');
  const formatNumberOfRatings = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  const ariaLabel = $derived(
    !validData || validData.length === 0
      ? 'Empty chart'
      : (() => {
          const worst = worstEpisode();
          const best = bestEpisode();

          const worstInfo = worst
            ? `"${worst.episodeTitle}" (episode ${worst.episodeNumberinSeason}, season ${worst.episodeSeason})`
            : 'unknown episode';

          const bestInfo = best
            ? `"${best.episodeTitle}" (episode ${best.episodeNumberinSeason}, season ${best.episodeSeason})`
            : 'unknown episode';

          return `This is a line chart of IMDB ratings for the TV series ${showName}, ${validData.length} episodes across ${seasons} ${seasons === 1 ? 'season' : 'seasons'}. The worst episode is ${worstInfo} rated ${minRating?.toFixed(1)} out of 10, the best episode is ${bestInfo} rated ${maxRating?.toFixed(1)} out of 10.`;
        })(),
  );
</script>

<div class="line-chart-container">
  <div class="info-header">
    <span class="rank">#{rank}</span>
    <span class="show-name-group">
      <span class="show-value">{showName}</span>
      {#if isDuplicateName && timeRange}
        <span class="time-range">({timeRange})</span>
      {/if}
    </span>
    <span class="show-info"
      ><span class="show-value rating_accent">{overallRating}/10</span>
      {#if numberOfRatings}
        <span class="ratings-count">({formatNumberOfRatings(numberOfRatings)} votes)</span>
      {/if}
    </span>
  </div>
  <p class="show-genres">{formattedGenres}</p>

  <div class="show-details">
    <h3>
      <span class="show-value2">{seasons} </span>
      <span class="show-info"> {seasons === 1 ? 'season' : 'seasons'}</span>
      <span class="separator">|</span>
      <span class="show-value2"
        >{validData.length}
        <span class="show-info"> episodes</span>
      </span>
      {#if timeRange}
        <span class="separator">|</span>
        <span class="show-info">{timeRange}</span>
      {/if}
    </h3>
    <p class="show-storyline">
      {storyline}
    </p>
    <a href={link} target="_blank" rel="noopener noreferrer" title="IMDB link">Read more →</a>
  </div>

  <div class="chart-wrapper" style="height:{height}px">
    <svg
      class="chart"
      {width}
      {height}
      role="img"
      aria-label={ariaLabel}
      onmousemove={handleMouseMove}
      onmouseleave={handleMouseLeave}
      onfocus={handleMouseMove}
      onblur={handleMouseLeave}
    >
      <g transform={`translate(${margins.marginLeft}, ${margins.marginTop})`}>
        <Gradient
          {validData}
          {xAccessorScaled}
          {yAccessorScaled}
          {boundedHeight}
          gradientId="gradient-{rank}"
        />
        <SeasonBands episodeData={validData} {xScale} {boundedHeight} />
        {#if line}
          <path class="line" d={line} />
        {/if}
        <XAxis {xScale} {height} {margins} />
        <YAxis {yScale} />
        <Points
          episodeData={validData}
          {xScale}
          {yScale}
          {xAccessor}
          {yAccessor}
          {width}
          bestEpisode={bestEpisode()}
          worstEpisode={worstEpisode()}
        />
        <MinMaxRatings
          {xAccessor}
          {yAccessor}
          {xScale}
          {yScale}
          bestEpisode={bestEpisode()}
          worstEpisode={worstEpisode()}
          {validData}
        />
        {#if hoveredPoint}
          <HoveredPoint
            x={xAccessorScaled(hoveredPoint)}
            y={yAccessorScaled(hoveredPoint)}
            {width}
          />
        {/if}
      </g>
    </svg>

    {#if hoveredPoint}
      <Tooltip
        yAccessor={yAccessor(hoveredPoint)}
        xAccessorScaled={xAccessorScaled(hoveredPoint)}
        yAccessorScaled={yAccessorScaled(hoveredPoint)}
        {width}
        {margins}
        {formatYForTooltip}
        data={hoveredPoint}
        {isBestEpisode}
        {isWorstEpisode}
      />
    {/if}
  </div>

  {#if hasUnratedEpisodes || hasMissingEpisodes}
    <div class="chart-notes">
      {#if hasUnratedEpisodes}
        <p class="note">
          Note: some episodes have not been rated yet (not aired or insufficient data).
        </p>
      {/if}
      {#if hasMissingEpisodes}
        <p class="note">Note: bonus episodes with unknown season were not plotted.</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .line-chart-container {
    margin-bottom: 3rem;
  }
  .chart-wrapper {
    position: relative;
    font-size: 12px;
    width: 100%;
    max-width: 600px;
    margin-bottom: 0rem;
  }
  .line {
    fill: none;
    stroke: var(--color-primary);
    stroke-width: 1px;
    stroke-linecap: round;
  }

  .info-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 1.1rem;
    margin-top: 1rem;
    justify-content: flex-start;
  }

  .show-name-group {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .show-value {
    font-weight: 700;
    color: var(--color-primary);
  }

  .show-value2 {
    font-weight: 500;
    color: var(--color-primary-500);
  }

  .show-genres {
    font-size: 14px;
    color: var(--color-neutral-600);
  }
  .separator {
    color: var(--color-neutral-400);
    font-weight: 300;
  }

  .show-info {
    color: var(--color-neutral-600);
    font-weight: 400;
  }

  .show-details {
    font-size: 13px;
    color: var(--color-neutral-700);
    margin-bottom: 0;
  }

  .show-storyline {
    color: var(--color-neutral-600);
  }
  .chart-notes {
    margin-top: 0rem;
  }

  .rank {
    font-weight: 700;
    color: var(--color-neutral-500);
  }

  .ratings-count,
  .time-range {
    color: var(--color-neutral-500);
    font-size: 0.9rem;
  }

  .note {
    font-size: 12px;
    color: #6b7280;
  }

  .rating_accent {
    text-transform: uppercase;
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-primary);
    background-color: var(--color-primary-100);
    border-radius: 3px;
    padding: 0px 4px;
    margin-left: 0;
  }
</style>
