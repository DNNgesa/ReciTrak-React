import { deliveryPricing } from "../constants";

function calculateFallbackKm(origin, destination) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(destination.lat - origin.lat);
  const dLng = toRad(destination.lng - origin.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(origin.lat)) *
      Math.cos(toRad(destination.lat)) *
      Math.sin(dLng / 2) ** 2;
  const straightKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(straightKm * 1.3).toFixed(1);
}

export async function getDeliveryQuote(origin, supplier) {
  const { baseFeeKes, ratePerKmKes } = deliveryPricing;

  try {
    const url = `https://project-osrm.org{origin.lng},${origin.lat};${supplier.lng},${supplier.lat}?overview=false`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route returned");
    }

    const distanceKm = +(data.routes[0].distance / 1000).toFixed(1);
    const durationMins = Math.round(data.routes[0].duration / 60);
    const deliveryFeeKes = Math.round(baseFeeKes + distanceKm * ratePerKmKes);

    return { distanceKm, durationMins, deliveryFeeKes, isEstimated: false };
  } catch {
    const distanceKm = calculateFallbackKm(origin, supplier);
    const durationMins = Math.max(5, Math.round(distanceKm * 3));
    const deliveryFeeKes = Math.round(baseFeeKes + distanceKm * ratePerKmKes);

    return { distanceKm, durationMins, deliveryFeeKes, isEstimated: true };
  }
}
