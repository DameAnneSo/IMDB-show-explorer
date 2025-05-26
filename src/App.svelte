<script>
import * as d3 from "d3";
import LineChart from "./components/LineChart.svelte";
import Select from "svelte-select";
import Header from "./components/Header.svelte";
import Footer from "./components/Footer.svelte";

// data import
let rawData;
let newData;
let seriesTitleArray = [];
let highestRating;
let lowestRating;
$: value = seriesTitleArray[0];

d3.csv("../data/by_episode.csv")
  .then((data) => {
    rawData = data;

    newData = rawData.map((d) => {
      return {
        seriesRank: +d.seriesRank,
        seriesTitle: d.seriesTitle,
        seriesLink: d.seriesLink,
        episodeNumberinSeason: +d.episodeNumberinSeason,
        episodeNumberOverall: +d.episodeNumberOverall,
        episodeRating: parseFloat(d.episodeRating),
        episodeSeason: +d.episodeSeason,
        episodeSynopsis: d.episodeSynopsis,
        episodeVotes: +d.episodeVotes,
        seriesNumberOfEpisodes: +d.seriesNumberOfEpisodes,
      };
    });

    // create an array of unique values seriesTitle in alphabetical order
    seriesTitleArray = [
      ...new Set(
        newData
          .map((item) => item.seriesTitle)
          .sort((a, b) => a.localeCompare(b))
      ),
    ];
  })
  .catch((error) => {
    console.error("Error loading the CSV file:", error);
  });

// handle select and clear events
const handleSelect = (event) => {
  value = event.detail.value;
};
const handleClear = () => {
  value = null;
};

// Reactive statements to calculate highest/lowest for selected series
$: filteredData =
  newData && value ? newData.filter((d) => d.seriesTitle === value) : [];
// find highest and lowest rating
$: highestRating =
  filteredData.length > 0 ? d3.max(filteredData, (d) => d.episodeRating) : null;
$: lowestRating =
  filteredData.length > 0 ? d3.min(filteredData, (d) => d.episodeRating) : null;
</script>

<main>
  <div class="app">
    <Header seriesTitle={value} />
    <p>Select a show</p>
    <div class="selector">
      <Select
        items={seriesTitleArray}
        {value}
        placeholder="Select a series..."
        on:select={handleSelect}
        on:clear={handleClear}
      />
    </div>
    {#if newData && value}
      <LineChart data={newData.filter((d) => d.seriesTitle === value)} />
    {/if}
    <div class="wrapper">
      {#if value && highestRating !== null && lowestRating !== null}
        <p>
          Highest rating: {highestRating.toFixed(1)} | Lowest rating: {lowestRating.toFixed(1)}
        </p>
      {:else if value}
        <p>Loading ratings...</p>
      {:else}
        <p>Select a series to see ratings</p>
      {/if}
    </div>
    <Footer />
  </div>
</main>

<style>
.selector {
  width: 450px;
  text-align: left;
}

.wrapper {
  font-size: 16px;
  width: 100%;
  max-width: 600px;
  margin: 0px 40px;
}
</style>
