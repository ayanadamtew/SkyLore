import type { Body } from "astronomy-engine";

export type RendererQuality = "LOW" | "MEDIUM" | "HIGH";

export type LayerKey = "constellations" | "planets" | "grid" | "labels";

export type SkyLayers = Record<LayerKey, boolean>;

export type City = {
  id: string;
  slug: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  elevation: number;
  utcOffset: number;
};

export type StarCatalogItem = {
  id: string;
  slug: string;
  name: string;
  ra: number;
  dec: number;
  magnitude: number;
  distanceLy: number;
  distanceLabel: string;
  constellation: string;
  spectral: string;
  color: string;
  story: string;
  hook: string;
};

export type PlanetCatalogItem = {
  id: string;
  slug: string;
  name: string;
  body: Body;
  glyph: string;
  color: string;
  story: string;
};

export type ConstellationCatalogItem = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  color: string;
  stars: string[];
  segments: Array<[string, string]>;
  story: string;
};

export type CalculatedPosition = {
  altitude: number;
  azimuth: number;
  ra: number;
  dec: number;
  distanceAu?: number;
};

export type CelestialKind = "star" | "planet" | "moon" | "sun";

export type SkyObject = CalculatedPosition & {
  id: string;
  slug: string;
  name: string;
  type: CelestialKind;
  magnitude: number;
  color: string;
  hook: string;
  story: string;
  glyph?: string;
  constellation?: string;
  spectral?: string;
  distanceLabel?: string;
  phase?: string;
  illumination?: number;
};

export type ConstellationVisibility = ConstellationCatalogItem & {
  type: "constellation";
  members: SkyObject[];
  visibleMembers: SkyObject[];
  visibility: number;
  averageAltitude: number;
  averageAzimuth: number;
};

export type SkyTarget = SkyObject | ConstellationVisibility;

export type SkyInput = {
  city: City;
  date: string;
  time: string;
};

export type SkySnapshot = {
  date: Date;
  city: City;
  darkness: string;
  moonPhase: string;
  moonIllumination: number;
  sunAltitude: number;
  objects: SkyObject[];
  stars: SkyObject[];
  planets: SkyObject[];
  moon: SkyObject;
  sun: SkyObject;
  constellations: ConstellationVisibility[];
  highlights: SkyTarget[];
};
