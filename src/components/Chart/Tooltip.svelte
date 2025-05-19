<script>
  export let xAccessor;
  export let yAccessor;
  export let xAccessorScaled;
  export let yAccessorScaled;
  export let marginLeft;
  export let marginTop;
  export let formatX;
  export let formatYForTooltip;

  $: x = xAccessorScaled + marginLeft;
  $: y = yAccessorScaled + marginTop;
</script>

<div
  class="tooltip"
  style="transform: translate(calc(-50% + {x}px), calc(-100% + {y}px))"
>
  <div class="tooltip_data">episode: {formatX(xAccessor)}</div>
  <div>rating: {formatYForTooltip(yAccessor)}/10</div>
</div>

<style>
  .tooltip {
    position: absolute;
    top: -12px;
    left: 0;
    padding: 0.5em;
    pointer-events: none;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #bdc3c7;
    border-radius: 2px;
    font-size: 14px;
  }

  .tooltip_data {
    margin-bottom: 0.3em;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 700;
  }
</style>