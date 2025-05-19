<script>
import * as d3 from "d3";
import LineChart from "./components/LineChart.svelte";
import Select from 'svelte-select';

// data import
let rawData;
let newData;
let seriesTitleArray = [];
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
          newData.map((item) => item.seriesTitle)
            .sort((a, b) => a.localeCompare(b))
        ),
      ];
  })
  .catch((error) => {
    console.error("Error loading the CSV file:", error);
  });

// handle select and clear events
 const handleSelect = event => {
    value = event.detail.value;
  };
  const handleClear = () => {
    value = null;
  };

// $: console.log(rawData);
// $: console.log(newData);
</script>

<main>
    <p>Select a show</p>
  <div class="app">
    <!-- <Header serieTitle={value} /> -->
    <div class="selector">
      <Select
        items={seriesTitleArray}
        {value}
        placeholder="Select a series..."
        inputStyles="font-family: Lato;"
        on:select={handleSelect}
        on:clear={handleClear}
      />
    </div>

  
    {#if newData && value}
      <LineChart data={newData.filter(d => d.seriesTitle === value)} />
    {/if}
  </div>
</main>

<style>
</style>
