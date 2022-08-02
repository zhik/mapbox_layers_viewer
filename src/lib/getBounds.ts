// from https://github.com/chriswhong/mapboxgl-view-bounds/blob/master/index.html

export default function buildViewBoundsGeoJSON(map) {
    const canvas = map.getCanvas();
    let { width, height } = canvas;

    // workaround for retina displays
    if (window.devicePixelRatio > 1) {
        width = width * 0.5;
        height = height * 0.5;
    }

    const cUL = map.unproject([0, 0]).toArray();
    const cUR = map.unproject([width, 0]).toArray();
    const cLR = map.unproject([width, height]).toArray();
    const cLL = map.unproject([0, height]).toArray();

    return {
        type: 'Polygon',
        coordinates: [[cUL, cUR, cLR, cLL, cUL]],
        crs: {
            type: 'name',
            properties: {
                name: 'EPSG:4326',
            },
        },
    };
};