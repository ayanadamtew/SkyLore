"use client";

import { CalendarDays, Clock3, Crosshair, Download } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { SkyScene } from "@/components/astronomy/SkyScene";
import { SkyWorkspaceHeader } from "@/components/product/SkyWorkspaceHeader";
import { CITIES, cityById } from "@/data/catalog";
import { calculateSky, findTarget, lookAzimuthForTarget } from "@/lib/astronomy";
import { formatAzimuth, formatDate, formatTime, normalizeAngle, visibilityText } from "@/lib/format";
import type { SkyTarget } from "@/types/sky";

export function BirthSkyExperience() {
  const [cityId, setCityId] = useState("addis");
  const [date, setDate] = useState("1995-06-15");
  const [time, setTime] = useState("21:00");
  const [viewAzimuth, setViewAzimuth] = useState(180);
  const [selectedId, setSelectedId] = useState("moon");
  const city = cityById(cityId);
  const sky = useMemo(() => calculateSky({ city, date, time }), [city, date, time]);
  const selected = findTarget(sky, selectedId) ?? sky.moon;
  const targetAltitude = "visibility" in selected ? selected.averageAltitude : selected.altitude;
  const targetAzimuth = "visibility" in selected ? selected.averageAzimuth : selected.azimuth;
  const shareImage = `/api/og/sky?city=${encodeURIComponent(city.name)}&date=${date}&time=${time}&target=${encodeURIComponent("Your birth sky")}`;

  const quickTargets = useMemo(() => {
    const unique = new Map<string, SkyTarget>();
    [sky.moon, ...sky.highlights].forEach((target) => unique.set(target.id, target));
    return [...unique.values()].slice(0, 4);
  }, [sky]);

  function selectTarget(id: string) {
    const target = findTarget(sky, id);
    if (!target) return;
    setSelectedId(target.id);
    setViewAzimuth(lookAzimuthForTarget(target));
  }

  return (
    <main className="sky-workspace birth-workspace" aria-label={`Birth sky above ${city.name}`}>
      <div className="sky-workspace-scene" data-testid="birth-sky-canvas">
        <SkyScene
          sky={sky}
          selectedId={selected.id}
          viewAzimuth={viewAzimuth}
          zoom={1}
          layers={{ constellations: true, planets: true, grid: true, labels: true }}
          quality="HIGH"
          onSelect={selectTarget}
          onRotate={(azimuth) => setViewAzimuth(normalizeAngle(azimuth))}
        />
      </div>
      <div className="sky-workspace-vignette" aria-hidden="true" />
      <div className="sky-workspace-frame" aria-hidden="true" />

      <SkyWorkspaceHeader active="birth">
        <span className="sky-meta-date">{formatDate(date)}</span>
        <strong>{formatTime(time)}</strong>
        <small>LOCAL</small>
      </SkyWorkspaceHeader>

      <div className="sky-workspace-hud">
        <section className="sky-hud-tools birth-hud-tools" aria-label="Birth sky controls">
          <div className="birth-hud-fields">
            <label>
              <Crosshair aria-hidden="true" />
              <span className="sr-only">Birth place</span>
              <select value={cityId} onChange={(event) => setCityId(event.target.value)}>
                {CITIES.map((item) => <option value={item.id} key={item.id}>{item.name}, {item.country}</option>)}
              </select>
            </label>
            <label>
              <CalendarDays aria-hidden="true" />
              <span className="sr-only">Birth date</span>
              <input type="date" value={date} onChange={(event) => event.target.value && setDate(event.target.value)} />
            </label>
            <label>
              <Clock3 aria-hidden="true" />
              <span className="sr-only">Birth time</span>
              <input type="time" value={time} onChange={(event) => event.target.value && setTime(event.target.value)} />
            </label>
          </div>

          <div className="sky-hud-targets birth-hud-targets" aria-label="Visible birth sky targets">
            {quickTargets.map((target) => (
              <button key={target.id} type="button" onClick={() => selectTarget(target.id)} data-active={selected.id === target.id}>
                {target.name}
              </button>
            ))}
          </div>
        </section>

        <AnimatePresence mode="wait">
          <motion.aside
            key={selected.id}
            className="sky-object-inspector"
            aria-live="polite"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <span className="sky-inspector-kicker">Birth sky · {targetKind(selected)}</span>
            <strong>{selected.name}</strong>
            <p>{targetHook(selected)}</p>
            <dl>
              <div><dt>Altitude</dt><dd>{targetAltitude.toFixed(1)}°</dd></div>
              <div><dt>Bearing</dt><dd>{formatAzimuth(targetAzimuth)} {targetAzimuth.toFixed(0)}°</dd></div>
              <div><dt>Moonlight</dt><dd>{Math.round(sky.moonIllumination * 100)}%</dd></div>
            </dl>
            <div className="sky-inspector-actions">
              <a href={shareImage} download="my-birth-sky.png"><Download aria-hidden="true" /> Sky card</a>
            </div>
          </motion.aside>
        </AnimatePresence>
      </div>

      <div className="sky-workspace-statusline" aria-label="Birth sky status">
        <span><strong>{sky.moonPhase}</strong> moon</span>
        <span>{visibilityText(selected)} · {city.name}, {city.country}</span>
      </div>
    </main>
  );
}

function targetKind(target: SkyTarget) {
  return "visibility" in target ? "constellation" : target.type;
}

function targetHook(target: SkyTarget) {
  return "visibility" in target ? target.subtitle : target.hook;
}
