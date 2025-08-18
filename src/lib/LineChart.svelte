<script>
import * as d3 from "d3";
import XAxis from "./XAxis.svelte";
import YAxis from "./YAxis.svelte";
import SeasonBands from "./SeasonBands.svelte";
import Points from "./Points.svelte";
import Pictograms from "./Pictograms.svelte";


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
</script>

<h1>{infoString}</h1>

<div class="chart-wrapper" style="height:{height}px">
  <svg class="chart" {width} {height}>
    <g transform={`translate(${margins.marginLeft}, ${margins.marginTop})`}>
      <XAxis {xScale} {height} {margins} />
      <YAxis {yScale} />
      <SeasonBands
        {episodeData}
        {xScale}
        {boundedHeight}
      />
      <Points
        {episodeData}
        {xScale}
        {yScale}
        {xAccessor}
        {yAccessor}
        {width}
      />
      <Pictograms 
        {episodeData}
        {xAccessor}
        {yAccessor}
        {xScale}
        {yScale}
      />
      {#if line}
        <path class="line" d={line} />
      {/if}
    </g>
  </svg>
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
