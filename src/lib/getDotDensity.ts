//adapted from https://github.com/BilelJegham/randomPositionInPolygon/blob/main/index.js
import bbox from '@turf/bbox'
import { randomPosition } from '@turf/random'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'

export function randomPositionInPolygon(polygon, bboxObj) {
    if (!polygon || !polygon.type || polygon.type !== 'Feature' || ['Polygon', 'MultiPolygon'].indexOf(polygon.geometry.type) === -1) {
        throw new Error('param polygon must be a Feature<(Polygon|MultiPolygon)>')
    }
    let position;
    do {
        position = randomPosition(bboxObj)
    }
    while (!booleanPointInPolygon(position, polygon));

    return position;
}

export function getDotDensity(features, column) {
    const points = features.reduce((points, feature) => {
        const count = Math.floor(feature.properties[column] / 2);
        const arr = [...Array(count)].map((_, __) => {
            return randomPositionInPolygon(feature, bbox(feature));
        })

        return [...arr.map(coordinates => ({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                coordinates
            }
        })), ...points]
    }, []
    )
    return points
}