<script>
import { onMount } from "svelte";
import LineChart from "./LineChart.svelte";

let {
  showName,
  rank,
  episodeData,
  overallRating,
  seasons,
  maxSeasons,
  episodes,
  storyline,
  genres,
  link,
  yScale,
  width,
  height,
  margins,
  boundedWidth,
  boundedHeight,
  showAnnotations,
} = $props();

let isVisible = $state(false);
let containerRef = $state(null);

onMount(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible = true;
          // Once visible, keep it rendered (don't unmount)
          observer.disconnect();
        }
      });
    },
    {
      rootMargin: "400px", // Load charts 400px before they enter viewport
      threshold: 0,
    }
  );

  if (containerRef) {
    observer.observe(containerRef);
  }

  return () => {
    observer.disconnect();
  };
});
</script>

<div bind:this={containerRef} class="lazy-chart-container">
  {#if isVisible}
    <LineChart
      {showName}
      {rank}
      {episodeData}
      {overallRating}
      {seasons}
      {maxSeasons}
      {episodes}
      {storyline}
      {genres}
      {link}
      {yScale}
      {width}
      {height}
      {margins}
      {boundedWidth}
      {boundedHeight}
      {showAnnotations}
    />
  {:else}
    <!-- Placeholder with same height to prevent layout shift -->
    <div class="chart-placeholder" style="height: {height + 150}px;">
      <div class="placeholder-shimmer"></div>
    </div>
  {/if}
</div>

<style>
.lazy-chart-container {
  min-height: 200px;
  margin-bottom: 1rem;
}

.chart-placeholder {
  width: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
