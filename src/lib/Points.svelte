<script>
 let { episodeData, xScale, yScale, xAccessor, yAccessor } = $props();

</script>

<g class="little-dots">
  {#each episodeData as episode}
    <circle
      cx={xScale(xAccessor(episode))}
      cy={yScale(yAccessor(episode))}
      r="2"
      fill="var(--color-primary)"
    />
  {/each}
</g>

<style>
  .little-dots {
    position: absolute;
    pointer-events: none;
  }
  circle {
    transition: fill 0.3s ease;
  }
</style> 
