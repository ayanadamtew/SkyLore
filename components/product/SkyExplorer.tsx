"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Crosshair,
  Download,
  LocateFixed,
  Search,
  Settings2,
  Share2,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CITIES, cityById, cityBySlug } from "@/data/catalog";
import { calculateSky, findTarget, lookAzimuthForTarget, useableCityFromLocation } from "@/lib/astronomy";
import {
  currentLocalDateTime,
  formatAzimuth,
  formatDate,
  formatTime,
  normalizeAngle,
  targetDirection,
  visibilityText,
} from "@/lib/format";
import { useSkyStore } from "@/store/sky-store";
import type { SkyTarget } from "@/types/sky";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SkyScene } from "@/components/astronomy/SkyScene";
import { SkyWorkspaceHeader } from "@/components/product/SkyWorkspaceHeader";

const QUICK_TARGETS = ["moon", "sirius", "orion"];
const LAYER_COPY = {
  constellations: ["Constellations", "Connect familiar star patterns"],
  planets: ["Planets", "Show the visible wandering worlds"],
  grid: ["Celestial grid", "Altitude and bearing guides"],
  labels: ["Object labels", "Name the brightest objects"],
} as const;

type SkyExplorerProps = {
  initialCitySlug?: string;
};

export function SkyExplorer({ initialCitySlug }: SkyExplorerProps) {
  const store = useSkyStore();
  const initialized = useRef(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const initialCity = initialCitySlug ? cityBySlug(initialCitySlug) : cityById(store.cityId);
    if (initialCitySlug) store.setCityId(initialCity.id);
    const now = currentLocalDateTime(initialCity);
    store.setDate(now.date);
    store.setTime(now.time);
  }, [initialCitySlug, store]);

  const city = store.customCity ?? cityById(store.cityId);
  const skyQuery = useQuery({
    queryKey: ["sky", city.id, city.lat, city.lon, city.utcOffset, store.date, store.time],
    queryFn: () => calculateSky({ city, date: store.date, time: store.time }),
    staleTime: Number.POSITIVE_INFINITY,
  });
  const sky = skyQuery.data ?? calculateSky({ city, date: store.date, time: store.time });

  const selected = findTarget(sky, store.selectedId) ?? sky.highlights[0] ?? null;
  const visibleCount = sky.objects.filter((object) => object.altitude > 0 && object.type !== "sun").length;

  const searchableTargets = useMemo(() => {
    return [...sky.objects.filter((object) => object.type !== "sun"), ...sky.constellations];
  }, [sky]);

  const searchResults = useMemo(() => {
    const query = store.searchTerm.trim().toLowerCase();
    if (!query) return [];
    return searchableTargets
      .filter((target) => `${target.name} ${"visibility" in target ? target.subtitle : target.type}`.toLowerCase().includes(query))
      .slice(0, 5);
  }, [searchableTargets, store.searchTerm]);

  function selectTarget(id: string, openStory = false) {
    const target = findTarget(sky, id);
    if (!target) return;
    store.setSelectedId(target.id);
    store.setViewAzimuth(lookAzimuthForTarget(target));
    store.setSearchTerm("");
    if (openStory) setStoryOpen(true);
  }

  function surpriseMe() {
    const candidates = sky.highlights.length ? sky.highlights : sky.objects;
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    if (next) selectTarget(next.id);
  }

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setLocationStatus("Location is unavailable in this browser.");
      return;
    }
    setLocationStatus("Locating observer...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const offset = -new Date().getTimezoneOffset() / 60;
        const location = useableCityFromLocation(coords.latitude, coords.longitude, offset);
        store.setCustomCity(location);
        const now = currentLocalDateTime(location);
        store.setDate(now.date);
        store.setTime(now.time);
        setLocationStatus("Using current coordinates.");
      },
      () => setLocationStatus("Location permission was not granted."),
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }

  function setNow() {
    const now = currentLocalDateTime(city);
    store.setDate(now.date);
    store.setTime(now.time);
  }

  const targetAltitude = selected ? ("visibility" in selected ? selected.averageAltitude : selected.altitude) : 0;
  const targetAzimuth = selected ? ("visibility" in selected ? selected.averageAzimuth : selected.azimuth) : store.viewAzimuth;
  const shareImage = `/api/og/sky?city=${encodeURIComponent(city.name)}&date=${encodeURIComponent(store.date)}&time=${encodeURIComponent(store.time)}&target=${encodeURIComponent(selected?.name ?? "Tonight's sky")}`;

  async function copyShareLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="sky-workspace observatory-workspace" aria-label="Interactive night sky observatory">
      <div className="sky-workspace-scene" data-testid="sky-canvas">
        <SkyScene
          sky={sky}
          selectedId={selected?.id ?? null}
          viewAzimuth={store.viewAzimuth}
          zoom={store.zoom}
          layers={store.layers}
          quality={store.quality}
          onSelect={(id) => selectTarget(id)}
          onRotate={(azimuth) => store.setViewAzimuth(normalizeAngle(azimuth))}
        />
      </div>
      <div className="sky-workspace-vignette" aria-hidden="true" />
      <div className="sky-workspace-frame" aria-hidden="true" />

      <SkyWorkspaceHeader active="tonight">
        <span className="sky-meta-date">{formatDate(store.date, { day: "numeric", month: "short", year: "numeric" })}</span>
        <strong>{formatTime(store.time)}</strong>
        <small>LOCAL</small>
        <button type="button" className="sky-icon-button" aria-label="Observation settings" onClick={() => setControlsOpen(true)}>
          <Settings2 aria-hidden="true" />
        </button>
      </SkyWorkspaceHeader>

      <div className="sky-workspace-hud">
        <section className="sky-hud-tools" aria-label="Sky controls">
          <div className="sky-hud-location">
            <Crosshair aria-hidden="true" />
            <label className="sr-only" htmlFor="observatory-city">Observer location</label>
            <select id="observatory-city" value={city.id} onChange={(event) => store.setCityId(event.target.value)}>
              {store.customCity ? <option value={store.customCity.id}>Current location</option> : null}
              {CITIES.map((item) => (
                <option value={item.id} key={item.id}>{item.name}, {item.country}</option>
              ))}
            </select>
            <button type="button" title="Use current location" aria-label="Use current location" onClick={useCurrentLocation}>
              <LocateFixed aria-hidden="true" />
            </button>
          </div>
          {locationStatus ? <p className="sky-hud-message" role="status">{locationStatus}</p> : null}

          <div className="sky-hud-targets" aria-label="Quick targets">
            {QUICK_TARGETS.map((id) => {
              const target = findTarget(sky, id);
              return target ? (
                <button key={id} type="button" onClick={() => selectTarget(id)} data-active={selected?.id === id}>
                  {target.name}
                </button>
              ) : null;
            })}
            <button type="button" onClick={surpriseMe}><Sparkles aria-hidden="true" /> Surprise</button>
          </div>

          <div className="sky-hud-search">
          <Search aria-hidden="true" />
          <input
            aria-label="Search stars, planets, and constellations"
            placeholder="Search the visible sky"
            value={store.searchTerm}
            onChange={(event) => store.setSearchTerm(event.target.value)}
          />
            <kbd>/</kbd>
          <AnimatePresence>
            {searchResults.length ? (
                <motion.div className="sky-hud-results" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}>
                {searchResults.map((target) => (
                  <button type="button" key={target.id} onClick={() => selectTarget(target.id, true)}>
                    <i style={{ background: target.color }} />
                    <span><strong>{target.name}</strong><small>{targetKind(target)}</small></span>
                    <ChevronRight aria-hidden="true" />
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        </section>

        <AnimatePresence mode="wait">
          <motion.aside
            key={selected?.id ?? "open-sky"}
            className="sky-object-inspector"
            aria-live="polite"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <span className="sky-inspector-kicker">{targetKind(selected)}</span>
            <strong>{selected?.name ?? "Open sky"}</strong>
            <p>{targetHook(selected)}</p>
            <dl>
              <div><dt>Altitude</dt><dd>{targetAltitude.toFixed(1)}°</dd></div>
              <div><dt>Bearing</dt><dd>{formatAzimuth(targetAzimuth)} {targetAzimuth.toFixed(0)}°</dd></div>
              <div><dt>View</dt><dd>{visibilityText(selected)}</dd></div>
            </dl>
            <div className="sky-inspector-actions">
              <button type="button" onClick={() => setStoryOpen(true)}><Sparkles aria-hidden="true" /> Story</button>
              <button type="button" title="Share this sky" aria-label="Share this sky" onClick={() => setShareOpen(true)}><Share2 aria-hidden="true" /></button>
            </div>
          </motion.aside>
        </AnimatePresence>
      </div>

      <div className="sky-workspace-statusline" aria-label="Sky status">
        <span><strong>{visibleCount.toString().padStart(2, "0")}</strong> above horizon</span>
        <span>{sky.darkness} · Sun {sky.sunAltitude.toFixed(1)}° · Moon {Math.round(sky.moonIllumination * 100)}%</span>
      </div>

      <Dialog open={storyOpen} onOpenChange={setStoryOpen}>
        <DialogContent className="observatory-dialog story-dialog">
          <span className="dialog-eyebrow">Celestial story / {targetKind(selected)}</span>
          <DialogTitle>{selected?.name ?? "Open sky"}</DialogTitle>
          <DialogDescription>{targetHook(selected)}</DialogDescription>
          {selected ? (
            <>
              <div className="story-facts">
                <div><span>Direction</span><strong>{targetDirection(selected)}</strong></div>
                <div><span>Visibility</span><strong>{visibilityText(selected)}</strong></div>
                <div><span>Altitude</span><strong>{targetAltitude.toFixed(1)}°</strong></div>
              </div>
              <div className="story-prose"><span>Why it matters</span><p>{selected.story}</p></div>
              <div className="dialog-command-row">
                <button type="button" className="dialog-primary" onClick={() => setShareOpen(true)}><Share2 aria-hidden="true" /> Share this sky</button>
                <Link href={targetRoute(selected)}>Open object page <ChevronRight aria-hidden="true" /></Link>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={controlsOpen} onOpenChange={setControlsOpen}>
        <DialogContent className="observatory-dialog controls-dialog">
          <span className="dialog-eyebrow">Observation controls</span>
          <DialogTitle>Set your sky</DialogTitle>
          <DialogDescription>Every position is calculated for this observer, local date, and local time.</DialogDescription>
          <div className="observation-fields">
            <label><span>Date</span><input type="date" value={store.date} onChange={(event) => event.target.value && store.setDate(event.target.value)} /></label>
            <label><span>Local time</span><input type="time" value={store.time} onChange={(event) => event.target.value && store.setTime(event.target.value)} /></label>
            <button type="button" onClick={setNow}><Clock3 aria-hidden="true" /> Now in {city.name}</button>
          </div>
          <div className="control-block">
            <span className="dialog-eyebrow">Chart layers</span>
            <div className="dialog-layer-list">
              {(Object.keys(store.layers) as Array<keyof typeof store.layers>).map((layer) => (
                <label key={layer}>
                  <span><strong>{LAYER_COPY[layer][0]}</strong><small>{LAYER_COPY[layer][1]}</small></span>
                  <input type="checkbox" checked={store.layers[layer]} onChange={() => store.toggleLayer(layer)} />
                  <i aria-hidden="true" />
                </label>
              ))}
            </div>
          </div>
          <div className="control-block quality-block">
            <span className="dialog-eyebrow">Renderer quality</span>
            <div>{(["LOW", "MEDIUM", "HIGH"] as const).map((quality) => <button type="button" key={quality} data-active={store.quality === quality} onClick={() => store.setQuality(quality)}>{quality}</button>)}</div>
          </div>
          <p className="calculation-note">Positions are computed locally with Astronomy Engine. The story layer never invents coordinates.</p>
        </DialogContent>
      </Dialog>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="observatory-dialog share-dialog">
          <span className="dialog-eyebrow">Shareable sky card</span>
          <DialogTitle>Send tonight upward</DialogTitle>
          <DialogDescription>A 1200 × 675 card generated from the current place, time, and selected object.</DialogDescription>
          <img className="share-card-preview" src={shareImage} alt={`Share card for ${selected?.name ?? "tonight's sky"} above ${city.name}`} />
          <div className="share-actions">
            <a className="dialog-primary" href={shareImage} download="skylore.png"><Download aria-hidden="true" /> Download</a>
            <button type="button" onClick={copyShareLink}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied ? "Copied" : "Copy link"}</button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function targetKind(target?: SkyTarget | null) {
  if (!target) return "sky";
  return "visibility" in target ? "constellation" : target.type;
}

function targetHook(target?: SkyTarget | null) {
  if (!target) return "Drag the sky and select a light.";
  if ("visibility" in target) return `${target.subtitle}. ${Math.round(target.visibility * 100)}% of its catalog stars are above the horizon.`;
  return target.hook;
}

function targetRoute(target: SkyTarget) {
  if ("visibility" in target) return `/constellations/${target.slug}`;
  if (target.type === "star") return `/stars/${target.slug}`;
  if (target.type === "planet") return `/planets/${target.slug}`;
  return `/sky/addis-ababa?target=${target.slug}`;
}
