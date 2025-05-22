<script>
import { setContext } from "svelte";
import { writable } from "svelte/store";
import * as d3 from "d3";
import Gradient from "./Chart/Gradient.svelte";
import Area from "./Chart/Area.svelte";
import Line from "./Chart/Line.svelte";
import XAxis from "./Chart/XAxis.svelte";
import YAxis from "./Chart/YAxis.svelte";
import Point from "./Chart/Point.svelte";
import Tooltip from "./Chart/Tooltip.svelte";

export let data;

const xAccessor = (d) => +d.episodeNumberOverall;
const yAccessor = (d) => +d.episodeRating;

let hoveredPoint = null;

const gradientId = "gradient";

const gradientAttributes = [
  { offset: "0%", stopColor: "#4427ca", stopOpacity: "0.6" },
  { offset: "85%", stopColor: "#ffffff", stopOpacity: "0" },
];

// const interpolation = d3.curveMonotoneX;
const interpolation = d3.curveLinear;

const bisectX = d3.bisector(xAccessor).left;

let width = 100;
$: height = 0.65 * width;

const margins = {
  marginTop: 40,
  marginRight: 20,
  marginBottom: 65,
  marginLeft: 45,
};

$: dimensions = {
  width,
  height,
  ...margins,
  boundedHeight: Math.max(height - margins.marginTop - margins.marginBottom, 0),
  boundedWidth: Math.max(width - margins.marginLeft - margins.marginRight, 0),
};

$: xScale = d3
  .scaleLinear()
  .domain(d3.extent(data, xAccessor))
  .range([0, dimensions.boundedWidth]);

$: yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, yAccessor)])
  .range([dimensions.boundedHeight, 0])
  .nice();

$: xAccessorScaled = (d) => xScale(xAccessor(d));
$: yAccessorScaled = (d) => yScale(yAccessor(d));
$: y0AccessorScaled = yScale(yScale.domain()[0]);

let currentDimensions = writable(dimensions);

$: {
  currentDimensions.set(dimensions);
}

setContext("chart", {
  dimensions: currentDimensions,
});

const handleMouseMove = (event) => {
  const xCoordinate = xScale.invert(event.offsetX - margins.marginLeft);
  const index = bisectX(data, xCoordinate);
  hoveredPoint = data[index - 1];
};

const handleMouseLeave = () => {
  hoveredPoint = null;
};

const formatX = d3.format("d");
const formatY = d3.format(".0s");
const formatYForTooltip = d3.format(",.1f");
</script>

<div class="wrapper" bind:clientWidth={width} style="height: {height}px">
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <svg
    class="chart"
    width={dimensions.width}
    height={dimensions.height}
    on:mousemove={handleMouseMove}
    on:mouseleave={handleMouseLeave}
    on:focus={handleMouseMove}
    on:blur={handleMouseLeave}
  >
    <g
      transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}
    >
      <defs>
        <Gradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="0"
          y2="100%"
          {gradientAttributes}
        />
      </defs>

      <Area
        {data}
        xAccessor={xAccessorScaled}
        yAccessor={yAccessorScaled}
        y0Accessor={y0AccessorScaled}
        {interpolation}
        style="fill: url(#{gradientId})"
      />

      <Line
        {data}
        xAccessor={xAccessorScaled}
        yAccessor={yAccessorScaled}
        {interpolation}
      />

      <XAxis scale={xScale} label="episode number" formatTick={formatX} />

      <YAxis scale={yScale} label="rating" formatTick={formatY} />

      {#if hoveredPoint}
        <Point
          x={xAccessorScaled(hoveredPoint)}
          y={yAccessorScaled(hoveredPoint)}
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
      marginLeft={margins.marginLeft}
      marginTop={margins.marginTop}
      {formatX}
      {formatYForTooltip}
    />
  {/if}
</div>

<style>
.wrapper {
  position: relative;
  font-size: 16px;
  width: 100%;
  max-width: 600px;
  margin: 0 40px;
}
</style>
