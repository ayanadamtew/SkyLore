import { Body } from "astronomy-engine";
import type {
  City,
  ConstellationCatalogItem,
  PlanetCatalogItem,
  StarCatalogItem,
} from "@/types/sky";

export const CITIES: City[] = [
  { id: "addis", slug: "addis-ababa", name: "Addis Ababa", country: "Ethiopia", lat: 8.9806, lon: 38.7578, elevation: 2355, utcOffset: 3 },
  { id: "nairobi", slug: "nairobi", name: "Nairobi", country: "Kenya", lat: -1.2921, lon: 36.8219, elevation: 1795, utcOffset: 3 },
  { id: "london", slug: "london", name: "London", country: "United Kingdom", lat: 51.5072, lon: -0.1276, elevation: 11, utcOffset: 1 },
  { id: "new-york", slug: "new-york", name: "New York", country: "United States", lat: 40.7128, lon: -74.006, elevation: 10, utcOffset: -4 },
  { id: "tokyo", slug: "tokyo", name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503, elevation: 40, utcOffset: 9 },
  { id: "sydney", slug: "sydney", name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093, elevation: 58, utcOffset: 10 },
];

export const STAR_CATALOG: StarCatalogItem[] = [
  { id: "sirius", slug: "sirius", name: "Sirius", ra: 6.7525, dec: -16.7161, magnitude: -1.46, distanceLy: 8.6, distanceLabel: "8.6 light-years", constellation: "Canis Major", spectral: "A1V", color: "#d8e6ff", story: "Sirius appears exceptionally bright because it is relatively close to Earth and has high intrinsic luminosity. Its name comes from the Greek word for glowing or scorching.", hook: "The brightest star in Earth's night sky." },
  { id: "betelgeuse", slug: "betelgeuse", name: "Betelgeuse", ra: 5.9195, dec: 7.4071, magnitude: 0.42, distanceLy: 642, distanceLabel: "642 light-years", constellation: "Orion", spectral: "M1-M2 Ia-ab", color: "#ff9c78", story: "Betelgeuse is a red supergiant so large that, placed at the Sun, its outer atmosphere would reach beyond the orbit of Mars. It is also a variable star, subtly changing its brightness over time.", hook: "A red supergiant at the shoulder of Orion." },
  { id: "rigel", slug: "rigel", name: "Rigel", ra: 5.2423, dec: -8.2016, magnitude: 0.13, distanceLy: 860, distanceLabel: "860 light-years", constellation: "Orion", spectral: "B8 Ia", color: "#b8d4ff", story: "Rigel is a blue supergiant and the brightest star in Orion. Its blue-white light is a clue to its much hotter surface than the red stars nearby.", hook: "The blue-white foot of Orion." },
  { id: "bellatrix", slug: "bellatrix", name: "Bellatrix", ra: 5.4189, dec: 6.3497, magnitude: 1.64, distanceLy: 250, distanceLabel: "250 light-years", constellation: "Orion", spectral: "B2 III", color: "#b9d6ff", story: "Bellatrix marks Orion's western shoulder. Its name means female warrior in Latin, a fitting title for a star in the constellation of the hunter.", hook: "The warrior star on Orion's shoulder." },
  { id: "saiph", slug: "saiph", name: "Saiph", ra: 5.7959, dec: -9.6696, magnitude: 2.07, distanceLy: 720, distanceLabel: "720 light-years", constellation: "Orion", spectral: "B0.5 Ia", color: "#bdd8ff", story: "Saiph forms one of Orion's two bright feet. It is a hot blue supergiant, even though its low position in the pattern can make it feel less prominent than Rigel.", hook: "A hot blue star at Orion's other foot." },
  { id: "alnilam", slug: "alnilam", name: "Alnilam", ra: 5.6036, dec: -1.2019, magnitude: 1.69, distanceLy: 1340, distanceLabel: "1,340 light-years", constellation: "Orion", spectral: "B0 Ia", color: "#b9d5ff", story: "Alnilam is the central jewel of Orion's Belt. It is one of the most luminous stars known, shining thousands of times more brightly than the Sun.", hook: "The middle jewel in Orion's Belt." },
  { id: "alnitak", slug: "alnitak", name: "Alnitak", ra: 5.6793, dec: -1.9426, magnitude: 1.74, distanceLy: 1260, distanceLabel: "1,260 light-years", constellation: "Orion", spectral: "O9.5 Ib", color: "#b2d3ff", story: "Alnitak is the easternmost star of Orion's Belt. Near it sits the Horsehead Nebula, a dark cloud silhouetted against glowing hydrogen.", hook: "The first star in Orion's Belt." },
  { id: "mintaka", slug: "mintaka", name: "Mintaka", ra: 5.5334, dec: -0.2991, magnitude: 2.23, distanceLy: 1200, distanceLabel: "1,200 light-years", constellation: "Orion", spectral: "O9.5 II", color: "#c6dcff", story: "Mintaka is the westernmost star of Orion's Belt. The name traces back to an Arabic phrase meaning the belt of the giant.", hook: "The western star in Orion's Belt." },
  { id: "procyon", slug: "procyon", name: "Procyon", ra: 7.655, dec: 5.225, magnitude: 0.34, distanceLy: 11.5, distanceLabel: "11.5 light-years", constellation: "Canis Minor", spectral: "F5 IV-V", color: "#fff3cf", story: "Procyon means before the dog in Greek because it rises shortly before Sirius. Together they make the small constellation Canis Minor.", hook: "The little dog that rises before Sirius." },
  { id: "aldebaran", slug: "aldebaran", name: "Aldebaran", ra: 4.5987, dec: 16.5093, magnitude: 0.85, distanceLy: 65, distanceLabel: "65 light-years", constellation: "Taurus", spectral: "K5 III", color: "#ffbf8e", story: "Aldebaran is the orange eye of Taurus. It appears to sit inside the Hyades cluster, but it is actually much closer to us than those cluster stars.", hook: "The orange eye of Taurus the Bull." },
  { id: "vega", slug: "vega", name: "Vega", ra: 18.6156, dec: 38.7837, magnitude: 0.03, distanceLy: 25, distanceLabel: "25 light-years", constellation: "Lyra", spectral: "A0V", color: "#dce9ff", story: "Vega was one of the first stars to be photographed and has long served astronomers as a brightness reference. It anchors the Summer Triangle.", hook: "A blue-white anchor of the Summer Triangle." },
  { id: "arcturus", slug: "arcturus", name: "Arcturus", ra: 14.261, dec: 19.182, magnitude: -0.05, distanceLy: 36.7, distanceLabel: "36.7 light-years", constellation: "Bootes", spectral: "K1.5 III", color: "#ffc28e", story: "Arcturus is an aging orange giant and the brightest star in the northern celestial hemisphere. Follow the curve of the Big Dipper's handle to find it.", hook: "Follow the arc to this orange giant." },
  { id: "capella", slug: "capella", name: "Capella", ra: 5.2782, dec: 45.998, magnitude: 0.08, distanceLy: 42.9, distanceLabel: "42.9 light-years", constellation: "Auriga", spectral: "G8 III", color: "#fff0bb", story: "Capella is a system of four stars, with two giant stars dominating its light. Its name means little goat, a reference to the nearby kids in Auriga.", hook: "A golden pair in the Charioteer." },
  { id: "antares", slug: "antares", name: "Antares", ra: 16.4901, dec: -26.4319, magnitude: 1.09, distanceLy: 550, distanceLabel: "550 light-years", constellation: "Scorpius", spectral: "M1.5 Iab-Ib", color: "#ff9a79", story: "Antares means rival of Mars because its red color can resemble the planet. It is a red supergiant near the heart of Scorpius.", hook: "The red rival of Mars." },
  { id: "spica", slug: "spica", name: "Spica", ra: 13.4199, dec: -11.1614, magnitude: 0.98, distanceLy: 250, distanceLabel: "250 light-years", constellation: "Virgo", spectral: "B1 III-IV", color: "#c6ddff", story: "Spica is a close binary system whose stars orbit each other in only four days. It marks a sheaf of wheat held by Virgo.", hook: "A bright binary in the hand of Virgo." },
  { id: "deneb", slug: "deneb", name: "Deneb", ra: 20.6905, dec: 45.2803, magnitude: 1.25, distanceLy: 2600, distanceLabel: "2,600 light-years", constellation: "Cygnus", spectral: "A2 Ia", color: "#dce9ff", story: "Deneb is one of the most luminous stars visible to the naked eye. It forms the tail of Cygnus and one corner of the Summer Triangle.", hook: "A distant luminous star in the Swan." },
  { id: "altair", slug: "altair", name: "Altair", ra: 19.8464, dec: 8.8683, magnitude: 0.77, distanceLy: 16.7, distanceLabel: "16.7 light-years", constellation: "Aquila", spectral: "A7 V", color: "#e1eaff", story: "Altair spins so quickly that its equator bulges outward. Along with Vega and Deneb, it forms the easy-to-spot Summer Triangle.", hook: "The nearby, fast-spinning eagle star." },
  { id: "polaris", slug: "polaris", name: "Polaris", ra: 2.5303, dec: 89.2641, magnitude: 1.98, distanceLy: 433, distanceLabel: "433 light-years", constellation: "Ursa Minor", spectral: "F7 Ib-II", color: "#fff4d1", story: "Polaris lies close to the north celestial pole, so it appears almost fixed while the rest of the sky circles around it. It is a triple-star system.", hook: "The north star, almost fixed in the sky." },
  { id: "canopus", slug: "canopus", name: "Canopus", ra: 6.3992, dec: -52.6957, magnitude: -0.74, distanceLy: 310, distanceLabel: "310 light-years", constellation: "Carina", spectral: "A9 II", color: "#fff0bd", story: "Canopus is the second-brightest star in the night sky. Its low southern path makes it a special sight for observers at mid-northern latitudes.", hook: "The second-brightest star in the night sky." },
  { id: "fomalhaut", slug: "fomalhaut", name: "Fomalhaut", ra: 22.9608, dec: -29.6222, magnitude: 1.16, distanceLy: 25.1, distanceLabel: "25.1 light-years", constellation: "Piscis Austrinus", spectral: "A3 V", color: "#dbe8ff", story: "Fomalhaut is surrounded by a dusty debris disk shaped by young planets and planetesimals. It is the lonely bright eye of the Southern Fish.", hook: "A bright eye surrounded by a dusty disk." },
];

export const CONSTELLATIONS: ConstellationCatalogItem[] = [
  {
    id: "orion",
    slug: "orion",
    name: "Orion",
    subtitle: "The Hunter",
    color: "#f0cf8a",
    stars: ["betelgeuse", "bellatrix", "alnilam", "alnitak", "mintaka", "rigel", "saiph"],
    segments: [["betelgeuse", "bellatrix"], ["bellatrix", "alnilam"], ["alnilam", "alnitak"], ["alnilam", "mintaka"], ["betelgeuse", "alnitak"], ["bellatrix", "rigel"], ["alnitak", "saiph"], ["rigel", "saiph"]],
    story: "Across civilizations, humans saw a pattern in these same stars. The familiar hourglass is observational, not physical: the stars appear together from Earth, but sit at very different distances.",
  },
  {
    id: "summer-triangle",
    slug: "summer-triangle",
    name: "Summer Triangle",
    subtitle: "Asterism",
    color: "#80b8b4",
    stars: ["vega", "deneb", "altair"],
    segments: [["vega", "deneb"], ["deneb", "altair"], ["altair", "vega"]],
    story: "The Summer Triangle is an asterism rather than a single constellation. Its three bright stars cross the boundaries of Lyra, Cygnus, and Aquila.",
  },
  {
    id: "scorpius",
    slug: "scorpius",
    name: "Scorpius",
    subtitle: "The Scorpion",
    color: "#d98573",
    stars: ["antares"],
    segments: [],
    story: "Antares anchors the curved heart of Scorpius. The full scorpion stretches farther across the southern sky, with a tail that curls toward the horizon.",
  },
];

export const PLANETS: PlanetCatalogItem[] = [
  { id: "mercury", slug: "mercury", name: "Mercury", body: Body.Mercury, glyph: "Mercury", color: "#c9b39a", story: "Mercury is the smallest planet and the closest to the Sun. It stays low near the horizon, so a clear view matters." },
  { id: "venus", slug: "venus", name: "Venus", body: Body.Venus, glyph: "Venus", color: "#ead39a", story: "Venus is wrapped in bright clouds of sulfuric acid. Its brilliance comes from both its reflective clouds and its relative closeness to Earth." },
  { id: "mars", slug: "mars", name: "Mars", body: Body.Mars, glyph: "Mars", color: "#e89172", story: "Mars gets its rust-red color from iron minerals in its surface dust. Its slow movement against the stars made it a wandering light to ancient observers." },
  { id: "jupiter", slug: "jupiter", name: "Jupiter", body: Body.Jupiter, glyph: "Jupiter", color: "#e3bd8a", story: "Jupiter is the largest planet in the Solar System. Even through binoculars, its four brightest moons can appear as tiny points beside it." },
  { id: "saturn", slug: "saturn", name: "Saturn", body: Body.Saturn, glyph: "Saturn", color: "#d7c28d", story: "Saturn's rings are made of countless pieces of ice and rock. At the right magnification, the planet turns a point of light into a world." },
];

export function cityById(cityId: string): City {
  return CITIES.find((city) => city.id === cityId || city.slug === cityId) ?? CITIES[0];
}

export function cityBySlug(slug?: string): City {
  if (!slug) return CITIES[0];
  return CITIES.find((city) => city.slug === slug || city.id === slug) ?? CITIES[0];
}

export function starBySlug(slug: string) {
  return STAR_CATALOG.find((star) => star.slug === slug || star.id === slug);
}

export function planetBySlug(slug: string) {
  return PLANETS.find((planet) => planet.slug === slug || planet.id === slug);
}

export function constellationBySlug(slug: string) {
  return CONSTELLATIONS.find((constellation) => constellation.slug === slug || constellation.id === slug);
}
