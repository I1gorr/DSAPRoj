import { geocodeLocation, getPOIsAlongRoute, drawRoute } from './routeOptimizer.js';

window.optimizeRoute = async function () {
  const startInput = document.getElementById('start').value.trim();
  const endInput = document.getElementById('end').value.trim();
  const preference = document.getElementById('preference').value;

  if (!startInput || !endInput) {
    alert('Please enter both start and end locations.');
    return;
  }

  try {
    const startCoords = await geocodeLocation(startInput);
    const endCoords = await geocodeLocation(endInput);

    if (!startCoords || !endCoords) {
      alert('Could not geocode the locations. Please check input.');
      return;
    }

    const route = await drawRoute(startCoords, endCoords);
    await getPOIsAlongRoute(route, preference);
  } catch (err) {
    console.error('Error optimizing route:', err);
    alert('An error occurred while optimizing the route.');
  }
};
