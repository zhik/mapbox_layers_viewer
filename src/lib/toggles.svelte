<script lang="ts">
    import { layers, toggles } from "./layers";
    import { mapStore, mapLayersLoaded } from "../stores";
    const allLayers = toggles.reduce(
        (layers, toggle) => [...layers, ...toggle.layers],
        []
    );

    let activeLayer = toggles[0].name;
    $: activeLayerToggle = toggles.find((i) => i.name === activeLayer);
    function onclick(name) {
        activeLayer = name;
    }

    $: {
        if ($mapStore && $mapLayersLoaded) {
            //disable other layers
            allLayers.forEach((layer) =>
                $mapStore.setLayoutProperty(layer, "visibility", "none")
            );
            //enable layers
            activeLayerToggle.layers.forEach((layer) =>
                $mapStore.setLayoutProperty(layer, "visibility", "visible")
            );
        }
    }
</script>

<nav>
    {#each toggles as toggle}
        <button
            class={activeLayer === toggle.name ? "active" : ""}
            on:click={() => onclick(toggle.name)}
        >
            {toggle.name}</button
        >
    {/each}
    <div class="legend">
        {#each activeLayerToggle.legend as item}
            {#if typeof item.value === "string"}
                <div class="label">
                    <span class="icon" style="background-color: {item.value}" />
                    <h4>{item.name}</h4>
                </div>
            {:else}
                <h4>{item.name}</h4>
                {#each [...Array(item.value.length / 2)].map((_, i) => i) as count}
                    <div class="label">
                        <span
                            class="icon"
                            style="background-color: {item.value[
                                count * 2 + 1
                            ]}"
                        />{item.format
                            ? item.format(item.value[count * 2])
                            : item.value[count * 2]}
                    </div>
                {/each}
            {/if}
        {/each}
    </div>
</nav>

<style>
    nav {
        z-index: 100;
        position: absolute;
        top: 1rem;
        left: 2rem;
    }
    button {
        background-color: rgba(255, 255, 255, 0.7);
        border-color: #dbdbdbd6;
        border-width: 1px;
        color: #363636;
        cursor: pointer;
        justify-content: center;
        padding-bottom: calc(0.5em - 1px);
        padding-left: 1em;
        padding-right: 1em;
        padding-top: calc(0.5em - 1px);
        text-align: center;
        white-space: nowrap;
        border-radius: 0.375em;
        box-shadow: none;
        display: inline-flex;
        font-size: 1rem;
        position: relative;
        margin-right: 0.5rem;
    }

    button.active {
        background-color: rgba(88, 88, 88, 0.9);
        border-color: #5d5d5dd6;
        color: white;
    }

    div.legend {
        margin-top: 1rem;
        display: block;
        background: rgba(255, 255, 255, 0.65);
        border-radius: 5px;
        padding: 5px 10px 6px 10px;
        max-width: 12rem;
    }

    h4{
        margin: 0;
    }

    .icon {
        width: 0.8em;
        height: 0.8em;
        display: inline-block;
        margin-right: 0.5rem;
    }
</style>
