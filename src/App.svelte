<script>
import svelteLogo from "./assets/svelte.svg";
import LineChart from "./components/LineChart.svelte";
import * as d3 from "d3";

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

// $: console.log(rawData);
$: console.log(newData);
</script>

<main>
  <div>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>starting page</h1>

  <p>TEST TEST TEST</p>
</main>

<style>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.svelte:hover {
  filter: drop-shadow(0 0 2em #ff3e00aa);
}
</style>
