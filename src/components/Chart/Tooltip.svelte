<script>
export let xAccessor;
export let yAccessor;
export let xAccessorScaled;
export let yAccessorScaled;
export let marginLeft;
export let marginTop;
export let formatX;
export let formatYForTooltip;
export let data;

$: x = xAccessorScaled + marginLeft;
$: y = yAccessorScaled + marginTop;

$: console.log("Tooltip data:", data);
$: console.log(data.seriesTitle);
</script>

<div
  class="tooltip"
  style="transform: translate(calc(-50% + {x}px), calc(-100% + {y}px))"
>
  <div>
    episode {formatX(xAccessor)}
    <span class="tooltip_data">{formatYForTooltip(yAccessor)}/10 </span>
  </div>
</div>

<style>
.tooltip {
  position: absolute;
  top: -12px;
  left: 0;
  padding: 0.5em;
  pointer-events: none;
  background: var(--color-neutral-100);
  border: 1px solid var(--color-neutral-50);
  border-radius: 2px;
  font-size: 14px;
  text-align: left;
}

.tooltip_data {
  display: block;
  margin-bottom: 0.3em;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 700;
}
</style>
