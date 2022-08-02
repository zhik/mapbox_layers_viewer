<script lang="ts">
    import mapboxgl from "mapbox-gl";
    import "mapbox-gl/dist/mapbox-gl.css";
    import {
        mapStore,
        mapBounds,
        districtStore,
        mapLayersLoaded,
    } from "../stores";
    import buildViewBoundsGeoJSON from "./getBounds";
    import { getDotDensity } from "./getDotDensity";
    import { json } from "d3";
    import { layers } from "./layers";

    let map;
    let mapLoaded = false;
    mapboxgl.accessToken =
        "pk.eyJ1IjoiemhpayIsImEiOiJjaW1pbGFpdHQwMGNidnBrZzU5MjF5MTJiIn0.N-EURex2qvfEiBsm-W9j7w";

    async function initMap(container) {
        map = new mapboxgl.Map({
            container,
            center: [-73.985, 40.7534],
            zoom: 12,
            bearing: 29,
            maxBounds: [
                [-74.505,40.4093],
                [-73.546,41.031],
            ],
            attributionControl: false,
            style: "mapbox://styles/mapbox/light-v10",
        });

        map.addControl(
            new mapboxgl.NavigationControl({ showCompass: false }),
            "bottom-right"
        );

        const updateBounds = () => {
            const bounds = buildViewBoundsGeoJSON(map);
            if (map.getZoom() > 13) {
                mapBounds.set(bounds);
            } else {
                mapBounds.set(null);
            }
        };

        map.on("zoom", updateBounds);
        map.on("drag", updateBounds);
        map.on("pitch", updateBounds);
        map.on("rotate", updateBounds);

        mapStore.set(map);

        Promise.all([
            json("./data/ct2020_mn.geojson"),
            json("./data/demographics.json"),
        ]).then(([tracts, demographics]: any[]) => {
            const data = {
                type: "FeatureCollection",
                features: tracts.features.map((row) => {
                    //merge with demographics
                    row.properties = {
                        ...row.properties,
                        ...(demographics.find(
                            (i) => i["tract"] === row.properties["ct2020"]
                        ) ?? {}),
                    };

                    return row;
                }),
            };

            map.on("load", function () {
                map.addSource("tracts", {
                    type: "geojson",
                    promoteId: "ct2020",
                    data,
                });
                map.addLayer({
                    id: `tracts-stroke-layer`,
                    type: "line",
                    source: "tracts",
                    paint: {
                        "line-color": "#616161",
                        "line-width": {
                            stops: [
                                [12, 0],
                                [14, 0.7],
                                [17, 1],
                            ],
                        },
                    },
                });

                map.addSource("b_alone", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: getDotDensity(data.features, "b_alone"),
                    },
                });

                map.addSource("h_any", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: getDotDensity(data.features, "h_any"),
                    },
                });

                //import the rest of the layers with visiblitly turned off
                layers.forEach((layer) => {
                    map.addLayer({ ...layer, layout: { visibility: "none" } });
                });

                map.on("sourcedata", (source) => {
                    if (source.sourceId === "tracts" && source.isSourceLoaded) {
                        mapLoaded = true;
                    }
                });

                map.on("styledata", () => {
                    const waiting = () => {
                        if (!map.isStyleLoaded()) {
                            setTimeout(waiting, 200);
                        } else {
                            mapLayersLoaded.set(true);
                        }
                    };
                    waiting();
                });
            });
        });
    }

    $: {
        if (mapLoaded && $districtStore) {
            const data = {
                type: "FeatureCollection",
                features: $districtStore,
            };
            map.addSource("districts", {
                type: "geojson",
                promoteId: "borocd",
                data,
            });

            map.addLayer({
                id: `districts-layer`,
                type: "fill",
                source: "districts",
                paint: {
                    "fill-color": "#7a7a7a",
                    "fill-opacity": [
                        "case",
                        ["boolean", ["feature-state", "selected"], false],
                        0.2,
                        0.05,
                    ],
                },
            }).addLayer({
                id: `districts-stroke-layer`,
                type: "line",
                source: "districts",
                paint: {
                    "line-color": "rgba(60, 60, 60, 0.7)",
                    "line-width": [
                        "case",
                        [
                            "any",
                            ["boolean", ["feature-state", "hover"], false],
                            ["boolean", ["feature-state", "selected"], false],
                        ],
                        2,
                        1.8,
                    ],
                },
            });
        }
    }
</script>

<div id="map" use:initMap />

<style>
    #map {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100vh;
    }
</style>
