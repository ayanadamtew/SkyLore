"use client";

import { create } from "zustand";
import type { City, RendererQuality, SkyLayers } from "@/types/sky";

type SkyStore = {
  cityId: string;
  customCity: City | null;
  date: string;
  time: string;
  selectedId: string | null;
  viewAzimuth: number;
  zoom: number;
  layers: SkyLayers;
  quality: RendererQuality;
  searchTerm: string;
  setCityId: (cityId: string) => void;
  setCustomCity: (city: City) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setSelectedId: (selectedId: string | null) => void;
  setViewAzimuth: (viewAzimuth: number) => void;
  setZoom: (zoom: number) => void;
  toggleLayer: (layer: keyof SkyLayers) => void;
  setQuality: (quality: RendererQuality) => void;
  setSearchTerm: (searchTerm: string) => void;
};

export const useSkyStore = create<SkyStore>((set) => ({
  cityId: "addis",
  customCity: null,
  date: "2026-11-12",
  time: "21:00",
  selectedId: "sirius",
  viewAzimuth: 180,
  zoom: 1,
  layers: {
    constellations: true,
    planets: true,
    grid: true,
    labels: true,
  },
  quality: "HIGH",
  searchTerm: "",
  setCityId: (cityId) => set({ cityId, customCity: null }),
  setCustomCity: (city) => set({ customCity: city, cityId: city.id }),
  setDate: (date) => set({ date }),
  setTime: (time) => set({ time }),
  setSelectedId: (selectedId) => set({ selectedId }),
  setViewAzimuth: (viewAzimuth) => set({ viewAzimuth }),
  setZoom: (zoom) => set({ zoom }),
  toggleLayer: (layer) => set((state) => ({ layers: { ...state.layers, [layer]: !state.layers[layer] } })),
  setQuality: (quality) => set({ quality }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
}));
