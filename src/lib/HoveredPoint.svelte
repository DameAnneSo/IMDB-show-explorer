<script>
  let { x, y, width } = $props();
</script>

<g>
  <circle class="point" cx={x} cy={y} r={width > 700 ? 6 : 4} />
</g>

<style>
  .point {
    fill: var(--color-primary-300);
    stroke: var(--color-primary-600);
  }
</style>
