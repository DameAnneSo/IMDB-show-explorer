<script>

import * as d3 from "d3";
import LineChart from "./components/LineChart.svelte";

// data import
let rawData;
let newData;
d3.csv("../public/data/by_episode.csv")
  .then((data) => {
    rawData = data;

    newData = rawData.map((d) => {
      return {
        seriesRank: +d.seriesRank,
        seriesTitle: d.seriesTitle,
        seriesLink: d.seriesLink,
        episodeNumber: +d.episodeNumber,
        episodeRating: +d.episodeRating,
        episodeSeason: +d.episodeSeason,
        episodeSynopsis: d.episodeSynopsis,
        episodeVotes: +d.episodeVotes,
        seriesNumberOfEpisodes: +d.seriesNumberOfEpisodes
      };
    });
  })
  .catch((error) => {
    console.error("Error loading the CSV file:", error);
  });

// handle select and clear events 
//  const handleSelect = event => {
//     value = event.detail.value;
//   };
//   const handleClear = () => {
//     value = null;
//   };

// $: console.log(rawData);
// $: console.log(newData);
</script>

<main>

  <p>First attempt at the line chart</p>
   <LineChart data={newData} />
</main>

<style>
</style>
