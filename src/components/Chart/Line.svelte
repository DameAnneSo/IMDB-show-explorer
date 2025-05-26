<script>
  import * as d3 from 'd3';

  export let data;
  export let xAccessor;
  export let yAccessor;
  export let interpolation;

  $: lineGenerator = d3.line().x(xAccessor).y(yAccessor).curve(interpolation);

  $: line = lineGenerator(data);
</script>

<path class="line" d={line} />

<style>
  .line {
    fill: none;
    stroke: #4427ca;
    stroke-width: 2px;
    stroke-linecap: round;
    transition: all 0.3s ease-out;
  }
</style>