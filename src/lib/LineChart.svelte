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
  episodes,
  xScale,
  yScale,
  width,
  height,
  margins,
  boundedHeight,
  showAnnotations = true
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

const infoString = $derived(
  `${showName} | overall rating: ${overallRating} | ${seasons} season(s) | ${episodes} episodes`
);

const formatX = d3.format("d");
const formatYForTooltip = d3.format(",.1f");
</script>

<h1>{infoString}</h1>

<div class="chart-wrapper" style="height:{height}px">
  <svg
    class="chart"
    {width}
    {height}
    role="img"
    onmousemove={handleMouseMove}
    onmouseleave={handleMouseLeave}
    onfocus={handleMouseMove}
    onblur={handleMouseLeave}
  >
    <g transform={`translate(${margins.marginLeft}, ${margins.marginTop})`}>
      <XAxis {xScale} {height} {margins} />
      <YAxis {yScale} />
      {#if showAnnotations}
        <SeasonBands {episodeData} {xScale} {boundedHeight} />
      {/if}
      <Points {episodeData} {xScale} {yScale} {xAccessor} {yAccessor} {width} />
      {#if showAnnotations}
        <MinMaxRatings {episodeData} {xAccessor} {yAccessor} {xScale} {yScale} />
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
</style>
