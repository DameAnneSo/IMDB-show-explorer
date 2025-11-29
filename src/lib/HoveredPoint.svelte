<script>
let { x, y, width } = $props();
// $inspect(x, y);
</script>

<g>
  <circle class="point" cx={x} cy={y} r={width > 700 ? 5 : 4} />
</g>

<style>
.point {
  fill: var(--color-primary-dark);
}
</style>
