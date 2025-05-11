<script>
  import * as d3 from "d3";
  import Filter from "./lib/Filter.svelte";

  let dataByEpisode = $state(null);

  d3.csv('./data/by_series.csv').then(data => {
    dataByEpisode = data;
    console.log("data", data);
  });
</script>

<main>
  <div>
    <h1>TV shows</h1>
    {#if dataByEpisode}
      <Filter filterData={dataByEpisode} />
    {/if}
  </div>
</main>
