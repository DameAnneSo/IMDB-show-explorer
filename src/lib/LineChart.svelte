<script>
import * as d3 from "d3";
import XAxis from "./XAxis.svelte";
import YAxis from "./YAxis.svelte";
import SeasonBands from "./SeasonBands.svelte";
import Points from "./Points.svelte";
import MinMaxRatings from "./MinMaxRatings.svelte";
import HoveredPoint from "./HoveredPoint.svelte";
import Tooltip from "./Tooltip.svelte";

let {
  showName,
  episodeData,
  overallRating,
  seasons,
  maxSeasons,
  episodes,
  xScale,
  yScale,
  width,
  height,
  margins,
  boundedHeight,
  showAnnotations = true,
} = $props();

const xAccessor = (d) => +d.episodeNumberOverall;
const yAccessor = (d) => +d.episodeRating;

const xAccessorScaled = $derived((d) => xScale(xAccessor(d)));
const yAccessorScaled = $derived((d) => yScale(yAccessor(d)));

// Filter out invalid data points before creating the line
const validData = $derived(
  episodeData?.filter((d) => {
    const x = xAccessor(d);
    const y = yAccessor(d);
    return !isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y);
  }) || []
);

let hoveredPoint = $state(null);
// function created using D3's bisector utility that helps find the closest data point when hovering over the chart
const bisectX = d3.bisector(xAccessor).left;
const handleMouseMove = (event) => {
  // Get the x-coordinate of the mouse event and find the closest data point
  const xCoordinate = xScale.invert(event.offsetX - margins.marginLeft);
  const index = bisectX(episodeData, xCoordinate);
  hoveredPoint = episodeData[index - 1];
};

const handleMouseLeave = () => {
  hoveredPoint = null;
};

const lineGenerator = $derived(
  d3
    .line()
    .x((d) => {
      const result = xAccessorScaled(d);
      return isNaN(result) ? 0 : result;
    })
    .y((d) => {
      const result = yAccessorScaled(d);
      return isNaN(result) ? 0 : result;
    })
    .curve(d3.curveMonotoneX)
    .defined((d) => {
      const x = xAccessorScaled(d);
      const y = yAccessorScaled(d);
      return !isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y);
    })
);

const line = $derived(lineGenerator(validData));

const formatX = d3.format("d");
const formatYForTooltip = d3.format(",.1f");

const ariaLabel = $derived(
  !validData || validData.length === 0
    ? "Empty chart"
    : (() => {
        const ratings = validData.map((d) => yAccessor(d));
        const minRating = Math.min(...ratings);
        const maxRating = Math.max(...ratings);
        // Find the actual episode objects for min and max ratings
        const worstEpisode = validData.find((d) => yAccessor(d) === minRating);
        const bestEpisode = validData.find((d) => yAccessor(d) === maxRating);

        const worstInfo = worstEpisode
          ? `"${worstEpisode.episodeTitle}" (episode ${worstEpisode.episodeNumberinSeason}, season ${worstEpisode.episodeSeason})`
          : "unknown episode";

        const bestInfo = bestEpisode
          ? `"${bestEpisode.episodeTitle}" (episode ${bestEpisode.episodeNumberinSeason}, season ${bestEpisode.episodeSeason})`
          : "unknown episode";

        return `This is a line chart of IMDB ratings for the TV series ${showName}, ${episodes} episodes across ${seasons} ${seasons === 1 ? "season" : "seasons"}. The worst episode is ${worstInfo} rated ${minRating.toFixed(1)} out of 10, the best episode is ${bestInfo} rated ${maxRating.toFixed(1)} out of 10.`;
      })()
);
</script>

<h1 class="info-header">
  <span class="episode-value">{showName}</span>
  <span class="separator">|</span>
  <span class="episode-info"
    >rated <span class="episode-value">{overallRating}/10</span>
    <span class="separator">|</span>
    <span class="episode-value">{seasons} </span>

    <span class="episode-info"> {seasons === 1 ? "season" : "seasons"}</span>
    <span class="separator">|</span>
    <span class="episode-value"
      >{episodes}
      <span class="episode-info"> episodes</span>
    </span>
  </span>
</h1>

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
      <XAxis {xScale} {height} {margins} {maxSeasons}/>
      <YAxis {yScale} />
      {#if showAnnotations}
        <SeasonBands {episodeData} {xScale} {boundedHeight} />
      {/if}
      <Points {episodeData} {xScale} {yScale} {xAccessor} {yAccessor} {width} />
      {#if showAnnotations}
        <MinMaxRatings
          {episodeData}
          {xAccessor}
          {yAccessor}
          {xScale}
          {yScale}
        />
      {/if}
      {#if line}
        <path class="line" d={line} />
      {/if}
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
      xAccessor={xAccessor(hoveredPoint)}
      yAccessor={yAccessor(hoveredPoint)}
      xAccessorScaled={xAccessorScaled(hoveredPoint)}
      yAccessorScaled={yAccessorScaled(hoveredPoint)}
      {width}
      {margins}
      {formatX}
      {formatYForTooltip}
      data={hoveredPoint}
    />
  {/if}
</div>

<style>
.chart-wrapper {
  position: relative;
  font-size: 16px;
  width: 100%;
  max-width: 600px;
}
.line {
  fill: none;
  stroke: #4427ca;
  stroke-width: 1px;
  stroke-linecap: round;
}

.info-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  margin-top: 1rem;
}

.episode-value {
  font-weight: 700;
  color: var(--color-primary, #4427ca);
}

.separator {
  color: var(--color-neutral-400, #999);
  font-weight: 300;
}

.episode-info {
  color: var(--color-neutral-600, #666);
  font-weight: 400;
}
</style>
