<script>
  export let id;
  export let x1;
  export let x2;
  export let y1;
  export let y2;
  export let gradientAttributes;
</script>

<linearGradient {id} {x1} {x2} {y1} {y2} gradientUnits="userSpaceOnUse">
  {#each gradientAttributes as { offset, stopColor, stopOpacity }}
    <stop {offset} stop-color={stopColor} stop-opacity={stopOpacity} />
  {/each}
</linearGradient>