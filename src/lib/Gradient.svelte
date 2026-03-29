<script>
  import * as d3 from 'd3';

  let { validData, xAccessorScaled, yAccessorScaled, boundedHeight, gradientId } = $props();

  const areaGenerator = $derived(
    d3
      .area()
      .x((d) => xAccessorScaled(d))
      .y0(boundedHeight)
      .y1((d) => yAccessorScaled(d))
      .curve(d3.curveMonotoneX)
      .defined((d) => {
        const x = xAccessorScaled(d);
        const y = yAccessorScaled(d);
        return !isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y);
      }),
  );

  const area = $derived(areaGenerator(validData));
</script>

<defs>
  <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" style="stop-color:var(--color-primary);stop-opacity:0.23" />
    <stop offset="100%" style="stop-color:var(--color-primary);stop-opacity:0.013" />
  </linearGradient>
</defs>

{#if area}
  <path class="gradient-area" d={area} fill="url(#{gradientId})" />
{/if}
