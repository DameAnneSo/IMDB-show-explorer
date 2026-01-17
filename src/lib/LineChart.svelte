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
  rank,
  episodeData,
  overallRating,
  seasons,
  maxSeasons,
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
  showDetails = true,
} = $props();

// Create xScale specific to this show's episode count
const xScale = $derived(
  d3.scaleLinear().domain([1, episodes]).range([0, boundedWidth])
);

const formattedGenres = $derived(
  genres
    ? genres
        .split(",")
        .map((g) => g.trim())
        .sort()
        .join(" · ")
    : ""
);

const xAccessor = (d) => +d.episodeNumberOverall;
const yAccessor = (d) => +d.episodeRating;

const xAccessorScaled = $derived((d) => xScale(xAccessor(d)));
const yAccessorScaled = $derived((d) => yScale(yAccessor(d)));

// Filter out invalid data points before creating the line
const validData = $derived(
  episodeData?.filter((d) => {
    const x = xAccessor(d);
    const y = yAccessor(d);
    return (
      !isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y) && x > 0 && y > 0
    );
  }) || []
);

let hoveredPoint = $state(null);
// function created using D3's bisector utility that helps find the closest data point when hovering over the chart
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
  <span class="rank">#{rank}</span>
  <span class="show-value">{showName}</span>
  <span class="show-info"
    ><span class="show-value rating_accent">{overallRating}/10</span>
  </span>
</h1>
<h2>
  <p class="show-genres">{formattedGenres}</p>
</h2>

{#if showDetails}
  <div class="show-details">
    <h3>
      <span class="show-value2">{seasons} </span>
      <span class="show-info"> {seasons === 1 ? "season" : "seasons"}</span>
      <span class="separator">|</span>
      <span class="show-value2"
        >{episodes}
        <span class="show-info"> episodes</span>
      </span>
    </h3>
    <i class="show-storyline">
      {storyline}
    </i>
    <a href={link} target="_blank" rel="noopener noreferrer" title="IMDB link"
      >Read more →</a
    >
  </div>
{/if}

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
      {#if showDetails}
        <SeasonBands {episodeData} {xScale} {boundedHeight} />
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
      />
      {#if showDetails}
        <MinMaxRatings
          episodeData={validData}
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
  font-size: 12px;
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
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
}

@media (min-width: 768px) {
  .info-header {
    justify-content: flex-start;
  }
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
  margin-bottom: 1rem;
}

.rank{
  font-weight: 700;
  color: var(--color-neutral-500);
}
</style>
