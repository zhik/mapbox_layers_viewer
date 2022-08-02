import type mapboxgl from "mapbox-gl";
import { writable, readable } from "svelte/store";

export const mapStore = writable<mapboxgl.Map>();
export const mapBounds = writable(null)
export const districtStore = writable(null)
export const mapLayersLoaded = writable<boolean>(false)