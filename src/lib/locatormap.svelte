<script type="ts">
    import * as d3 from "d3";
    import * as topojson from "topojson-client";
    import { mapBounds, districtStore } from "../stores";

    const width = 150,
        height = 300;

    let svg;
    let geoPath;

    async function initSvg(container) {
        svg = d3.select(container);

        const nycd = await d3.json("./data/nycd_mn.topojson");

        const districts = topojson.feature(nycd, nycd.objects.nycd_mn).features;
        districtStore.set(districts)
        const manhattan = topojson.mesh(nycd);

        const projection = d3
            .geoMercator()
            .rotate([0, 21])
            .fitSize([width, height], manhattan);

        geoPath = d3.geoPath(projection);

        const g = svg.append("g").attr("id", "map");

        const shapes = g
            .selectAll("path")
            .data(districts)
            .join("path")
            .attr("d", (f) => geoPath(f))
            .attr("stroke", "white")
            .attr("fill", "rgba(200,200,200,0.5)")
            .attr("stroke-width", 1.2);

        const text = g
            .selectAll(".label")
            .data(districts)
            .enter()
            .append("g")
            .classed("label", true)
            .attr("transform", (d) => {
                const [x, y] = geoPath.centroid(d);
                return `translate(${x},${y})`;
            })
            .call((g) => {
                g.append("text")
                    .attr("text-anchor", "middle")
                    .text((d, i) => {
                        return d.properties.BoroCD - 100;
                    });
            });
    }

    $: {
        if ($mapBounds && geoPath) {
            svg.select("#bound").remove();
            if ($mapBounds) {
                svg.append("g")
                    .attr("id", "bound")
                    .selectAll("path")
                    .data([$mapBounds])
                    .join("path")
                    .attr("d", (f) => geoPath(f))
                    .attr("stroke", "rgba(100,100,100,1)")
                    .attr("fill", "rgba(200,200,200,0.4)")
                    .attr("stroke-width", 1);
            }
        } else {
            svg && svg.select("#bound").remove();
        }
    }
</script>

<svg {width} {height} use:initSvg />

<style>
    svg {
        z-index: 100;
        position: absolute;
        bottom: 2rem;
        left: 2rem;
    }

    :global(.label text){
        font-size: 0.7rem;
        font-weight: 100;
        fill: rgb(95, 95, 95);
    }
</style>
