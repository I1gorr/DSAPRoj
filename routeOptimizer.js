
const platform = new H.service.Platform({
  apikey: 'YOUR_HERE_API_KEY'
});

const maptypes = platform.createDefaultLayers();
const map = new H.Map(
  document.getElementById('mapContainer'),
  maptypes.vector.normal.map,
  {
    zoom: 13,
    center: { lat: 12.9716, lng: 77.5946 }
  }
);

const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const ui = H.ui.UI.createDefault(map, maptypes);

const router = platform.getRoutingService(null, 8);
const searchService = platform.getSearchService();

export async function geocodeLocation(query) {
  return new Promise((resolve, reject) => {
    platform.getSearchService().geocode({
      q: query
    }, (result) => {
      if (result.items.length > 0) {
        const position = result.items[0].position;
        resolve({ lat: position.lat, lng: position.lng });
      } else {
        resolve(null);
      }
    }, reject);
  });
}

export async function drawRoute(start, end) {
  return new Promise((resolve, reject) => {
    const routeParams = {
      routingMode: 'fast',
      transportMode: 'car',
      origin: `${start.lat},${start.lng}`,
      destination: `${end.lat},${end.lng}`,
      return: 'polyline,summary'
    };

    router.calculateRoute(routeParams, (result) => {
      if (result.routes.length) {
        const route = result.routes[0];
        const linestring = H.geo.LineString.fromFlexiblePolyline(route.sections[0].polyline);
        const routeLine = new H.map.Polyline(linestring, {
          style: { strokeColor: 'blue', lineWidth: 5 }
        });

        map.addObject(routeLine);
        map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });

        resolve(route);
      } else {
        reject('No route found');
      }
    }, reject);
  });
}

export async function getPOIsAlongRoute(route, category) {
  const line = H.geo.LineString.fromFlexiblePolyline(route.sections[0].polyline);
  const points = line.getLatLngAltArray();

  for (let i = 0; i < points.length; i += 10) {
    const lat = points[i];
    const lng = points[i + 1];

    searchService.browse({
      at: `${lat},${lng}`,
      categories: [category],
      limit: 2
    }, (result) => {
      result.items.forEach((item) => {
        const marker = new H.map.Marker(item.position);
        map.addObject(marker);
      });
    }, console.error);
  }
}
