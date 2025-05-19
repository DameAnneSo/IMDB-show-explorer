<script>
  import * as d3 from 'd3';

  export let data;
  export let xAccessor;
  export let yAccessor;
  export let y0Accessor;
  export let interpolation;
  export let style;

  $: areaGenerator = d3
    .area()
    .x(xAccessor)
    .y0(y0Accessor)
    .y1(yAccessor)
    .curve(interpolation);

  $: area = areaGenerator(data);
</script>

<path class="area" d={area} {style} />

<style>
  .area {
    fill: none;
    stroke-width: 0;
    transition: all 0.3s ease-out;
  }
</style>