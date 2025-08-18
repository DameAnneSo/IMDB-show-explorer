<script>
import * as d3 from "d3";
let { episodeData, xAccessor, yAccessor, xScale, yScale} = $props();

// Find the max and min values using unscaled access
const maxY = $derived(d3.max(episodeData, yAccessor)); // Changed: max for highest rating
const minY = $derived(d3.min(episodeData, yAccessor)); // Changed: min for lowest rating

// Find the full episodeData points at those positions
const maxPoint = $derived(episodeData.find((d) => yAccessor(d) === maxY));
const minPoint = $derived(episodeData.find((d) => yAccessor(d) === minY));

// Get the already-scaled x/y positions
const maxX = $derived(xScale(xAccessor(maxPoint))); // Fixed: apply xScale to the accessor result
const minX = $derived(xScale(xAccessor(minPoint))); // Fixed: apply xScale to the accessor result
const scaledMaxY = $derived(yScale(maxY));
const scaledMinY = $derived(yScale(minY));

// Calculate text dimensions for background rectangles
const fontSize = 12;
const padding = 4;
const maxText = $derived(`+${maxPoint.episodeRating.toFixed(1)}`);
const minText = $derived(`−${minPoint.episodeRating.toFixed(1)}`);
// Approximate text width (you can adjust the multiplier as needed)
const maxTextWidth = $derived(maxText.length * fontSize * 0.5 + padding * 2);
const minTextWidth = $derived(minText.length * fontSize * 0.5 + padding * 2);
</script>

<g class="pictos">
  <!-- Background rectangle for highest point -->
  <rect
    class="highest_background"
    x={maxX - maxTextWidth / 2}
    y={scaledMaxY - 9 - fontSize}
    width={maxTextWidth}
    height={fontSize + padding}
    rx="3"
  />
  
  <!-- Green "+" above the max point -->
  <text
    class="highest"
    x={maxX}
    y={scaledMaxY - 9}
    text-anchor="middle"
    font-size="12"
  >
    +{maxPoint.episodeRating.toFixed(1)}
  </text>

  <!-- Background rectangle for lowest point -->
  <rect
    class="lowest_background"
    x={minX - minTextWidth / 2}
    y={scaledMinY + 15 - fontSize}
    width={minTextWidth}
    height={fontSize + padding}
    rx="3"
  />

  <!-- Red "−" below the min point -->
  <text
    class="lowest"
    x={minX}
    y={scaledMinY + 15}
    text-anchor="middle"
    font-size="12"
  >
    −{minPoint.episodeRating.toFixed(1)}
  </text>
</g>

<style>
.pictos {
  pointer-events: none;
}

text {
  font-style: italic;
}

.highest {
  fill: var(--green-dark);
}

.lowest {
  fill: var(--red-dark);
}

.highest_background {
  fill: var(--green-light);
  opacity: 0.8;
}

.lowest_background {
  fill: var(--red-light);
  opacity: 0.8;
}
</style>