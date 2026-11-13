import * as Astronomy from "astronomy-engine";
import { CONSTELLATIONS, PLANETS, STAR_CATALOG } from "@/data/catalog";
import { localDateToUtc, normalizeAngle } from "@/lib/format";
import type {
  CalculatedPosition,
  City,
  ConstellationVisibility,
  SkyInput,
  SkyObject,
  SkySnapshot,
  SkyTarget,
} from "@/types/sky";

const STAR_SLOTS = [
  Astronomy.Body.Star1,
  Astronomy.Body.Star2,
  Astronomy.Body.Star3,
  Astronomy.Body.Star4,
  Astronomy.Body.Star5,
  Astronomy.Body.Star6,
  Astronomy.Body.Star7,
  Astronomy.Body.Star8,
];

function objectEquator(body: Astronomy.Body, date: Date, observer: Astronomy.Observer): CalculatedPosition {
  const eq = Astronomy.Equator(body, date, observer, true, true);
  const horizontal = Astronomy.Horizon(date, observer, eq.ra, eq.dec, "normal");
  return {
    altitude: horizontal.altitude,
    azimuth: horizontal.azimuth,
    ra: horizontal.ra,
    dec: horizontal.dec,
    distanceAu: eq.dist,
  };
}

function moonPhaseLabel(phaseFraction: number, phaseAngle: number) {
  const angle = normalizeAngle(phaseAngle);
  if (phaseFraction < 0.03) return "New moon";
  if (phaseFraction > 0.97) return "Full moon";
  if (angle < 90) return "Waxing crescent";
  if (angle < 180) return "Waxing gibbous";
  if (angle < 270) return "Waning gibbous";
  return "Waning crescent";
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function averageAzimuth(objects: SkyObject[]) {
  if (!objects.length) return 180;
  const vectors = objects.map((object) => {
    const radians = (object.azimuth * Math.PI) / 180;
    return { x: Math.cos(radians), y: Math.sin(radians) };
  });
  const x = average(vectors.map((vector) => vector.x));
  const y = average(vectors.map((vector) => vector.y));
  return normalizeAngle((Math.atan2(y, x) * 180) / Math.PI);
}

export function calculateSky({ city, date, time }: SkyInput): SkySnapshot {
  const utcDate = localDateToUtc(date, time, city.utcOffset);
  const observer = new Astronomy.Observer(city.lat, city.lon, city.elevation);
  const sunPosition = objectEquator(Astronomy.Body.Sun, utcDate, observer);
  const moonPosition = objectEquator(Astronomy.Body.Moon, utcDate, observer);
  const moonIllumination = Astronomy.Illumination(Astronomy.Body.Moon, utcDate);
  const moonPhaseAngle = Astronomy.MoonPhase(utcDate);

  const planets: SkyObject[] = PLANETS.map((planet) => {
    const position = objectEquator(planet.body, utcDate, observer);
    const illumination = Astronomy.Illumination(planet.body, utcDate);
    return {
      ...position,
      id: planet.id,
      slug: planet.slug,
      name: planet.name,
      type: "planet",
      magnitude: illumination.mag,
      color: planet.color,
      glyph: planet.glyph,
      story: planet.story,
      hook: "A wandering world with a verified topocentric position.",
    };
  });

  const stars: SkyObject[] = STAR_CATALOG.map((star, index) => {
    const body = STAR_SLOTS[index % STAR_SLOTS.length];
    Astronomy.DefineStar(body, star.ra, star.dec, star.distanceLy);
    const position = objectEquator(body, utcDate, observer);
    return {
      ...position,
      id: star.id,
      slug: star.slug,
      name: star.name,
      type: "star",
      magnitude: star.magnitude,
      color: star.color,
      story: star.story,
      hook: star.hook,
      constellation: star.constellation,
      spectral: star.spectral,
      distanceLabel: star.distanceLabel,
    };
  });

  const darkness =
    sunPosition.altitude < -18
      ? "Night"
      : sunPosition.altitude < -12
        ? "Astronomical twilight"
        : sunPosition.altitude < -6
          ? "Nautical twilight"
          : sunPosition.altitude < 0
            ? "Civil twilight"
            : "Daylight";

  const moonPhase = moonPhaseLabel(moonIllumination.phase_fraction, moonPhaseAngle);
  const moon: SkyObject = {
    ...moonPosition,
    id: "moon",
    slug: "moon",
    name: "Moon",
    type: "moon",
    magnitude: -12.6,
    color: "#f2dfb0",
    glyph: "Moon",
    phase: moonPhase,
    illumination: moonIllumination.phase_fraction,
    hook: `${moonPhase} with ${Math.round(moonIllumination.phase_fraction * 100)}% illumination`,
    story: `The Moon is ${Math.round(moonIllumination.phase_fraction * 100)}% illuminated from ${city.name}. Astronomy Engine calculates this topocentric position for your observer, including the shift caused by lunar parallax.`,
  };

  const sun: SkyObject = {
    ...sunPosition,
    id: "sun",
    slug: "sun",
    name: "Sun",
    type: "sun",
    magnitude: -26.7,
    color: "#f1b968",
    glyph: "Sun",
    hook: darkness,
    story: "The Sun sets the sky's twilight state. Its altitude determines whether tonight's view is in daylight, twilight, or full astronomical night.",
  };

  const objects = [...stars, ...planets, moon, sun];

  const constellations: ConstellationVisibility[] = CONSTELLATIONS.map((constellation) => {
    const members = constellation.stars
      .map((id) => stars.find((star) => star.id === id))
      .filter((star): star is SkyObject => Boolean(star));
    const visibleMembers = members.filter((star) => star.altitude > 0);
    return {
      ...constellation,
      type: "constellation",
      members,
      visibleMembers,
      visibility: visibleMembers.length / Math.max(members.length, 1),
      averageAltitude: average(members.map((star) => star.altitude)),
      averageAzimuth: averageAzimuth(members),
    };
  });

  const visibleObjects = objects
    .filter((object) => ["planet", "moon", "star"].includes(object.type) && object.altitude > 5)
    .sort((a, b) => {
      const planetBias = Number(b.type === "planet") - Number(a.type === "planet");
      return planetBias || a.magnitude - b.magnitude;
    });

  const highlights: SkyTarget[] = [
    ...visibleObjects.slice(0, 5),
    ...constellations.filter((constellation) => constellation.visibility >= 0.5).slice(0, 2),
  ].slice(0, 5);

  return {
    date: utcDate,
    city,
    darkness,
    moonPhase,
    moonIllumination: moonIllumination.phase_fraction,
    sunAltitude: sun.altitude,
    objects,
    stars,
    planets,
    moon,
    sun,
    constellations,
    highlights,
  };
}

export function findTarget(snapshot: SkySnapshot, id?: string | null): SkyTarget | null {
  if (!id) return null;
  return snapshot.objects.find((object) => object.id === id || object.slug === id) ?? snapshot.constellations.find((item) => item.id === id || item.slug === id) ?? null;
}

export function lookAzimuthForTarget(target?: SkyTarget | null) {
  if (!target) return 180;
  return "visibility" in target ? target.averageAzimuth : target.azimuth;
}

export function useableCityFromLocation(latitude: number, longitude: number, offset: number): City {
  return {
    id: "current",
    slug: "current-location",
    name: "Current location",
    country: "Browser coordinates",
    lat: latitude,
    lon: longitude,
    elevation: 0,
    utcOffset: offset,
  };
}
