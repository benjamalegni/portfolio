export type CountryCoordinate = {
  lat: number
  lng: number
}

export const countryCoordinates: Record<string, CountryCoordinate> = {
  Argentina: { lat: -34.6, lng: -58.4 },
  Brazil: { lat: -15.8, lng: -47.9 },
  Chile: { lat: -33.4, lng: -70.7 },
  "Dominican Republic": { lat: 18.5, lng: -69.9 },
  England: { lat: 51.5, lng: -0.1 },
  Estonia: { lat: 59.4, lng: 24.7 },
  Finland: { lat: 60.2, lng: 24.9 },
  Germany: { lat: 52.5, lng: 13.4 },
  Italy: { lat: 41.9, lng: 12.5 },
  Latvia: { lat: 56.9, lng: 24.1 },
  Lithuania: { lat: 54.7, lng: 25.3 },
  Mexico: { lat: 19.4, lng: -99.1 },
  Panama: { lat: 9.0, lng: -79.5 },
  Paraguay: { lat: -25.3, lng: -57.6 },
  Poland: { lat: 52.2, lng: 21.0 },
  Sweden: { lat: 59.3, lng: 18.1 },
  "United States": { lat: 38.9, lng: -77.0 },
  Uruguay: { lat: -34.9, lng: -56.2 },
}
