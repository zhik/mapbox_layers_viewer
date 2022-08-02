<script lang="ts">
  import Map from "./lib/map.svelte";
  import LocatorMap from "./lib/locatormap.svelte";
  import Toggles from "./lib/toggles.svelte";
</script>

<main class="full">
    <Toggles />
    <LocatorMap />
    <Map />
</main>

<style>
  main {
    color: #444;
    font-family: "Open Sans", sans-serif;
    height: 100vh;
    overflow: hidden;
    position: relative;
  }
</style>
