import { format } from 'd3'

const percent_over_60_scale = [
    0.1,
    "#fef0d9",
    0.2,
    "#fdcc8a",
    0.4,
    "#fc8d59",
    0.6,
    "#e34a33",
    1,
    "#b30000"]

const household_income_scale = [
    10000,
    "#edf8e9",
    50000,
    "#bae4b3",
    100000,
    "#74c476",
    200000,
    "#31a354",
    250000,
    "#006d2c",
]

export const toggles = [
    {
        name: 'Black/ African American',
        layers: ['b_alone_layer'],
        legend: [
            {
                name:
                    '1 dot = 2 people idenifying as Black/ African American alone',
                value: '#e55e5e',
                format: null
            }
        ]
    },
    {
        name: 'Hispanic/ Latinx',
        layers: ['h_any_layer'],
        legend: [
            {
                name: '1 dot = 2 people idenifying as Hispanic/ Latinx',
                value: '#5e5ee5',
                format: null
            }
        ]
    },
    {
        name: 'Age 60+',
        layers: ['percent_over_60_layer'],
        legend: [
            {
                name: 'Percent of tract 60+',
                value: percent_over_60_scale,
                format: d => format(".0%")(d)
            }
        ]
    },
    {
        name: 'Income',
        layers: ['household_income_layer'],
        legend: [
            {
                name: 'Median Household Income',
                value: household_income_scale,
                format: d => format("$,.0f")(d)
            }
        ]
    }
]

export const layers = [
    {
        id: 'b_alone_layer',
        type: "circle",
        source: "b_alone",
        paint: {
            "circle-radius": {
                base: 1.75,
                stops: [
                    [12, 1],
                    [22, 50],
                ],
            },
            'circle-color': '#e55e5e'
        },
    },
    {
        id: 'h_any_layer',
        type: "circle",
        source: "h_any",
        paint: {
            "circle-radius": {
                base: 1.75,
                stops: [
                    [12, 1],
                    [22, 50],
                ],
            },
            'circle-color': '#5e5ee5'
        },
    },
    {
        id: 'percent_over_60_layer',
        type: "fill",
        source: "tracts",
        paint: {
            "fill-color": [
                "interpolate",
                ["linear"],
                ["get", "percent_over_60"],
                ...percent_over_60_scale
            ],
            "fill-opacity": 0.6,
        },
    },
    {
        id: 'household_income_layer',
        type: "fill",
        source: "tracts",
        paint: {
            "fill-color": [
                "interpolate",
                ["linear"],
                ["get", "hmi"],
                ...household_income_scale
            ],
            "fill-opacity": 0.6,
        },
    }
]