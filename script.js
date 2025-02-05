import { optimizeRoute } from './routeOptimizer.js';

const platform = new H.service.Platform({
    'apikey': 'API_KEY'
});
const defaultLayers = platform.createDefaultLayers();

let coordinates = [
    { lat: 40.7128, lng: -74.0060 },   // New York, NY
    { lat: 34.0522, lng: -118.2437 },  // Los Angeles, CA
    { lat: 41.8781, lng: -87.6298 },   // Chicago, IL
    { lat: 29.7604, lng: -95.3698 },   // Houston, TX
    { lat: 33.4484, lng: -112.0740 }   // Phoenix, AZ
];

let currentPointIndex = 0;
let totalDistance = 0;
let routeLines = [];
let markers = [];

const map = new H.Map(
    document.getElementById("mapContainer"),
    defaultLayers.vector.normal.map,
    {
        zoom: 4,
        center: coordinates[0]
    }
);

const ui = H.ui.UI.createDefault(map, defaultLayers);
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const router = platform.getRoutingService(null, 8);

const calculateRoute = (origin, destination) => {
    const routingParameters = {
        'routingMode': 'fast',
        'transportMode': 'car',
        'origin': `${origin.lat},${origin.lng}`,
        'destination': `${destination.lat},${destination.lng}`,
        'return': 'polyline,summary'
    };

    router.calculateRoute(routingParameters, (result) => {
        if (result.routes.length) {
            const section = result.routes[0].sections[0];
            const segmentDistance = section.summary.length;
            totalDistance += segmentDistance;

            const displayTotalDistance = totalDistance > 1000
                ? `${(totalDistance / 1000).toFixed(2)} km`
                : `${totalDistance.toFixed(2)} m`;

            const displaySegmentDistance = segmentDistance > 1000
                ? `${(segmentDistance / 1000).toFixed(2)} km`
                : `${segmentDistance.toFixed(2)} m`;

            document.getElementById('distanceDisplay').innerText = `Total Distance: ${displayTotalDistance}`;
            document.getElementById('segmentDistance').innerText = `Segment Distance: ${displaySegmentDistance}`;

            const lineString = H.geo.LineString.fromFlexiblePolyline(section.polyline);
            const routeLine = new H.map.Polyline(lineString, {
                style: { strokeColor: 'blue', lineWidth: 5 }
            });

            map.addObject(routeLine);
            routeLines.push(routeLine);

            const startMarker = new H.map.Marker(origin);
            const endMarker = new H.map.Marker(destination);
            map.addObject(startMarker);
            map.addObject(endMarker);
            markers.push(startMarker, endMarker);
        } else {
            alert('No route found');
        }
    }, onError);
};

const onError = (error) => {
    console.error('Error calculating route: ', error);
    alert('Error calculating route: ' + error.message);
};

const calculateNextSegment = () => {
    if (currentPointIndex < coordinates.length - 1) {
        const origin = coordinates[currentPointIndex];
        const destination = coordinates[currentPointIndex + 1];
        calculateRoute(origin, destination);
        currentPointIndex++;
    } else {
        alert('You have reached the last destination');
    }
};

document.getElementById('nextButton').addEventListener('click', calculateNextSegment);

document.getElementById('optimizeRouteButton').addEventListener('click', () => {
    const optimizedRoute = optimizeRoute(coordinates);
    coordinates = optimizedRoute;
    totalDistance = 0;
    currentPointIndex = 0;

    routeLines.forEach(line => map.removeObject(line));
    routeLines = [];

    alert('Route optimized! Start viewing each segment by clicking "Next".');
});

document.getElementById('addWaypointButton').addEventListener('click', () => {
    const newLat = prompt("Enter latitude for new waypoint:");
    const newLng = prompt("Enter longitude for new waypoint:");

    if (newLat && newLng) {
        const newWaypoint = { lat: parseFloat(newLat), lng: parseFloat(newLng) };
        coordinates.push(newWaypoint);
        alert('New waypoint added!');
    } else {
        alert('Invalid coordinates entered.');
    }
});

calculateNextSegment();

map.addEventListener('mapviewchange', () => {
    const zoom = map.getZoom();
    map.setZoom(zoom);
});

window.addEventListener('resize', () => map.getViewPort().resize());
