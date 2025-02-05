
export const getDistance = (point1, point2) => {
    const R = 6371;  
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
};

export const optimizeRoute = (coords) => {
    const remaining = coords.slice(1);
    const optimized = [coords[0]];

    while (remaining.length) {
        const lastPoint = optimized[optimized.length - 1];
        let closestIndex = 0;
        let minDistance = Infinity;

        remaining.forEach((point, index) => {
            const distance = getDistance(lastPoint, point);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        optimized.push(remaining.splice(closestIndex, 1)[0]);
    }
    return optimized;
};
