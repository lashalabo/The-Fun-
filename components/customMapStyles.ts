// components/customMapStyles.ts
// A collection of artistic map styles for the Google Maps API.
// You can generate your own styles using tools like: https://mapstyle.withgoogle.com/

export const customMapStyles = {
    // Style inspired by the vintage, blocky look of the London map image.
    vintage: [
        { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
        {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [{ color: "#c9b2a6" }],
        },
        {
            featureType: "administrative.land_parcel",
            elementType: "geometry.stroke",
            stylers: [{ color: "#dcd2be" }],
        },
        {
            featureType: "administrative.land_parcel",
            elementType: "labels.text.fill",
            stylers: [{ color: "#ae9e90" }],
        },
        // --- Key change: Make buildings a prominent, warm color ---
        {
            featureType: "landscape.man_made",
            elementType: "geometry.fill",
            stylers: [{ color: "#e49945" }], // Orange/Brown for buildings
        },
        {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
        },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#93817c" }],
        },
        {
            featureType: "poi.park",
            elementType: "geometry.fill",
            stylers: [{ color: "#a5b076" }],
        },
        {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#447530" }],
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#f5f1e6" }],
        },
        {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [{ color: "#fdfcf8" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#f8c967" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#e9bc62" }],
        },
        {
            featureType: "transit.line",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
        },
        {
            featureType: "transit.station",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
        },
        // --- Key change: Make water a distinct, contrasting color ---
        { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#b9d3c2" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#92998d" }] },
    ],

    // Style inspired by the dark, neon look of the Amsterdam/Göttingen maps.
    cyberpunk: [
        { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
        {
            featureType: "administrative.country",
            elementType: "geometry.stroke",
            stylers: [{ color: "#4b6878" }],
        },
        {
            featureType: "administrative.land_parcel",
            elementType: "labels.text.fill",
            stylers: [{ color: "#64779e" }],
        },
        {
            featureType: "administrative.province",
            elementType: "geometry.stroke",
            stylers: [{ color: "#4b6878" }],
        },
        // --- Key change: Make buildings dark but visible ---
        {
            featureType: "landscape.man_made",
            elementType: "geometry.stroke",
            stylers: [{ color: "#334e87" }],
        },
        {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [{ color: "#023e58" }],
        },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#283d6a" }] },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6f9ba5" }],
        },
        {
            featureType: "poi",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#1d2c4d" }],
        },
        {
            featureType: "poi.park",
            elementType: "geometry.fill",
            stylers: [{ color: "#023e58" }],
        },
        {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#3C7680" }],
        },
        // --- Key change: Roads are bright, neon lines ---
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#304a7d" }] },
        {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#98a5be" }],
        },
        {
            featureType: "road",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#1d2c4d" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#2c6675" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#255763" }],
        },
        // --- Key change: Water is a vibrant, contrasting cyan ---
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#007bff" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4e6d70" }] },
    ],

    // A colorful, peachy style for a unique look.
    peach: [
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 13
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#144b53"
                },
                {
                    "lightness": 14
                },
                {
                    "weight": 1.4
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#08304b"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#0c4152"
                },
                {
                    "lightness": 5
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#0b434f"
                },
                {
                    "lightness": 25
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#0b3d51"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#146474"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#021019"
                }
            ]
        }
    ]
};
