<script>
  let { showName, overallRating, seasons, episodes, xScale, yScale } = $props();

  $inspect('name', showName);
</script>

<h1>{ showName } { overallRating } { seasons } { episodes }</h1>