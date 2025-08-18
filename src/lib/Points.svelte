<script>
 let { episodeData, xScale, yScale, xAccessor, yAccessor, width } = $props();

</script>

<g class="points">
  {#each episodeData as episode}
    <circle
      cx={xScale(xAccessor(episode))}
      cy={yScale(yAccessor(episode))}
      r={width > 700 ? 3 : 2}
      fill="var(--color-primary)"
    />
  {/each}
</g>
