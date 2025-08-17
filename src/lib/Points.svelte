<script>
 let { episodeData, xScale, yScale, xAccessor, yAccessor } = $props();

</script>

<g class="points">
  {#each episodeData as episode}
    <circle
      cx={xScale(xAccessor(episode))}
      cy={yScale(yAccessor(episode))}
      r="3"
      fill="var(--color-primary)"
    />
  {/each}
</g>
