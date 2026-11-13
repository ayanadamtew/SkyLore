"use client";

import {
  Check,
  CircleDotDashed,
  Copy,
  Download,
  Eye,
  EyeOff,
  Pencil,
  Play,
  Plus,
  Redo2,
  Search,
  Share2,
  Sparkles,
  Trash2,
  Undo2,
  WandSparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SkyScene } from "@/components/astronomy/SkyScene";
import { SkyWorkspaceHeader } from "@/components/product/SkyWorkspaceHeader";
import { CITIES, STAR_CATALOG, cityById } from "@/data/catalog";
import { calculateSky } from "@/lib/astronomy";
import { currentLocalDateTime, formatAzimuth, formatDate, formatTime, normalizeAngle } from "@/lib/format";
import { useConstellationStore } from "@/store/constellation-store";
import type { ConstellationStore } from "@/store/constellation-store";
import type { ConstellationTheme, SharedConstellationDraft } from "@/types/constellation";
import type { SkyObject } from "@/types/sky";

const THEMES: ConstellationTheme[] = ["Memory", "Journey", "Promise", "Dream", "Discovery"];
const MAX_STARS = 8;
const MIN_STARS = 3;

export function DrawSkyExperience() {
  const draft = useConstellationStore();
  const [viewAzimuth, setViewAzimuth] = useState(180);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [showOfficial, setShowOfficial] = useState(false);
  const [replayStarCount, setReplayStarCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [starQuery, setStarQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const replayTimer = useRef<number | null>(null);

  const city = cityById(draft.cityId);
  const sky = useMemo(() => calculateSky({ city, date: draft.date, time: draft.time }), [city, draft.date, draft.time]);
  const selectedStars = useMemo(
    () => draft.starIds.map((id) => sky.stars.find((star) => star.id === id)).filter((star): star is SkyObject => Boolean(star)),
    [draft.starIds, sky.stars],
  );
  const activeStar = sky.stars.find((star) => star.id === activeId) ?? selectedStars.at(-1) ?? null;
  const visibleStars = useMemo(
    () => sky.stars.filter((star) => star.altitude > 5).sort((a, b) => a.magnitude - b.magnitude),
    [sky.stars],
  );
  const filteredStars = useMemo(() => {
    const query = starQuery.trim().toLowerCase();
    if (!query) return visibleStars;
    return visibleStars.filter((star) => `${star.name} ${star.constellation ?? ""} ${star.spectral ?? ""}`.toLowerCase().includes(query));
  }, [starQuery, visibleStars]);
  const canFinish = selectedStars.length >= MIN_STARS && Boolean(draft.name.trim());
  const cardUrl = constellationCardUrl({ draft, cityName: city.name, stars: selectedStars });

  useEffect(() => {
    let cancelled = false;
    const restore = async () => {
      const hasSavedDraft = Boolean(localStorage.getItem("the-sky-constellation-draft"));
      await useConstellationStore.persist.rehydrate();
      if (cancelled) return;

      const shared = draftFromSearchParams(new URLSearchParams(window.location.search));
      if (shared) {
        useConstellationStore.getState().importDraft(shared);
      } else if (!hasSavedDraft) {
        const initialCity = cityById("addis");
        const now = currentLocalDateTime(initialCity);
        useConstellationStore.getState().importDraft({
          cityId: initialCity.id,
          date: now.date,
          time: now.time,
          starIds: [],
          closed: false,
          name: "",
          theme: "Discovery",
          meaning: "",
        });
      }
      setHydrated(true);
    };
    void restore();
    return () => {
      cancelled = true;
      if (replayTimer.current) window.clearInterval(replayTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!draft.completed || replayStarCount !== null) return;
    const timer = window.setTimeout(() => replay(), 180);
    return () => window.clearTimeout(timer);
  }, [draft.completed]);

  function selectStar(id: string, center = false) {
    if (draft.completed || replayStarCount !== null) return;
    const star = sky.stars.find((item) => item.id === id);
    if (!star || star.altitude <= 5) return;
    if (center) setViewAzimuth(star.azimuth);
    if (draft.starIds.includes(id)) {
      const remaining = draft.starIds.filter((starId) => starId !== id);
      draft.removeStar(id);
      setActiveId(remaining.at(-1) ?? null);
    } else {
      draft.addStar(id);
      setActiveId(id);
    }
  }

  function surpriseStar() {
    const candidates = visibleStars.filter((star) => !draft.starIds.includes(star.id));
    const star = candidates[Math.floor(Math.random() * candidates.length)];
    if (!star) return;
    draft.addStar(star.id);
    setActiveId(star.id);
    setViewAzimuth(star.azimuth);
  }

  function updateSky(field: "cityId" | "date" | "time", value: string) {
    draft.setSky(field, value);
    setActiveId(null);
    setComposerOpen(false);
    setReplayStarCount(null);
    setStarQuery("");
  }

  function clearConstellation() {
    draft.clear();
    setActiveId(null);
    setComposerOpen(false);
  }

  function startNewConstellation() {
    draft.importDraft({
      cityId: draft.cityId,
      date: draft.date,
      time: draft.time,
      starIds: [],
      closed: false,
      name: "",
      theme: "Discovery",
      meaning: "",
    });
    setActiveId(null);
    setComposerOpen(false);
    setReplayStarCount(null);
    setStarQuery("");
  }

  function completeConstellation() {
    if (!canFinish) return;
    draft.finish();
    setComposerOpen(false);
  }

  function replay() {
    if (replayTimer.current) window.clearInterval(replayTimer.current);
    setReplayStarCount(1);
    let count = 1;
    replayTimer.current = window.setInterval(() => {
      count += 1;
      setReplayStarCount(count);
      if (count >= draft.starIds.length) {
        if (replayTimer.current) window.clearInterval(replayTimer.current);
        replayTimer.current = null;
        window.setTimeout(() => setReplayStarCount(null), 650);
      }
    }, 480);
  }

  async function copyShareLink() {
    const link = buildShareUrl(draft);
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareConstellation() {
    const link = buildShareUrl(draft);
    if (navigator.share) {
      await navigator.share({ title: draft.name, text: draft.meaning || `${draft.name}, drawn in the real sky.`, url: link });
      return;
    }
    await copyShareLink();
  }

  return (
    <main className="sky-workspace draw-sky-workspace" data-hydrated={hydrated} aria-label="Draw your own constellation">
      <div className="sky-workspace-scene" data-testid="draw-sky-canvas">
        <SkyScene
          sky={sky}
          selectedId={activeStar?.id ?? null}
          selectedIds={draft.starIds}
          replayStarCount={replayStarCount}
          closeSelectionLoop={draft.closed}
          minimumStarAltitude={5}
          viewAzimuth={viewAzimuth}
          zoom={1}
          layers={{ constellations: showOfficial, planets: false, grid: true, labels: true }}
          quality="HIGH"
          onSelect={selectStar}
          onRotate={(azimuth) => setViewAzimuth(normalizeAngle(azimuth))}
        />
      </div>
      <div className="sky-workspace-vignette" aria-hidden="true" />
      <div className="sky-workspace-frame" aria-hidden="true" />

      <SkyWorkspaceHeader active="create">
        <span className="sky-meta-date">{formatDate(draft.date)}</span>
        <strong>{formatTime(draft.time)}</strong>
        <small>LOCAL</small>
      </SkyWorkspaceHeader>

      <div className="sky-workspace-hud draw-sky-hud">
        <section className="sky-hud-tools draw-builder-tools" aria-label="Constellation builder controls">
          <div className="draw-sky-fields">
            <label><span>Place</span><select value={draft.cityId} onChange={(event) => updateSky("cityId", event.target.value)}>{CITIES.map((item) => <option value={item.id} key={item.id}>{item.name}, {item.country}</option>)}</select></label>
            <label><span>Date</span><input type="date" value={draft.date} onChange={(event) => event.target.value && updateSky("date", event.target.value)} /></label>
            <label><span>Time</span><input type="time" value={draft.time} onChange={(event) => event.target.value && updateSky("time", event.target.value)} /></label>
          </div>

          <div className="draw-builder-toolbar">
            <span className="draw-builder-count"><strong>{draft.starIds.length}</strong> / {MAX_STARS}</span>
            <button type="button" title="Undo" aria-label="Undo" disabled={!draft.history.length || draft.completed} onClick={draft.undo}><Undo2 aria-hidden="true" /></button>
            <button type="button" title="Redo" aria-label="Redo" disabled={!draft.future.length || draft.completed} onClick={draft.redo}><Redo2 aria-hidden="true" /></button>
            <button type="button" title="Add a surprise star" aria-label="Add a surprise star" disabled={draft.starIds.length >= MAX_STARS || draft.completed} onClick={surpriseStar}><Sparkles aria-hidden="true" /></button>
            <button type="button" title={draft.closed ? "Open constellation" : "Close constellation"} aria-label={draft.closed ? "Open constellation" : "Close constellation"} disabled={draft.starIds.length < MIN_STARS || draft.completed} data-active={draft.closed} onClick={() => draft.setClosed(!draft.closed)}><CircleDotDashed aria-hidden="true" /></button>
            <button type="button" title={showOfficial ? "Hide official constellations" : "Show official constellations"} aria-label={showOfficial ? "Hide official constellations" : "Show official constellations"} data-active={showOfficial} onClick={() => setShowOfficial((visible) => !visible)}>{showOfficial ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button>
            <button type="button" title="Clear constellation" aria-label="Clear constellation" disabled={!draft.starIds.length || draft.completed} onClick={clearConstellation}><Trash2 aria-hidden="true" /></button>
          </div>

          <div className="draw-star-picker">
            <label>
              <Search aria-hidden="true" />
              <input value={starQuery} onChange={(event) => setStarQuery(event.target.value)} placeholder="Find a visible star" aria-label="Find a visible star" />
            </label>
            <div aria-label="Visible stars">
              {filteredStars.map((star) => {
                const selected = draft.starIds.includes(star.id);
                return (
                  <button
                    type="button"
                    key={star.id}
                    data-selected={selected}
                    aria-pressed={selected}
                    disabled={draft.completed || (!selected && draft.starIds.length >= MAX_STARS)}
                    title={`${selected ? "Remove" : "Add"} ${star.name}`}
                    onClick={() => selectStar(star.id, true)}
                  >
                    <i style={{ background: star.color, boxShadow: `0 0 8px ${star.color}` }} />
                    <strong>{star.name}</strong>
                    {selected ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
                  </button>
                );
              })}
              {!filteredStars.length ? <span>No visible match</span> : null}
            </div>
          </div>

          <div className="draw-selection-track" aria-label="Selected stars">
            {Array.from({ length: MAX_STARS }, (_, index) => {
              const id = draft.starIds[index];
              const star = id ? sky.stars.find((item) => item.id === id) : null;
              return star ? (
                <button key={star.id} type="button" title={`Remove ${star.name}`} aria-label={`Remove ${star.name}`} disabled={draft.completed} onClick={() => selectStar(star.id)}>
                  <span>{index + 1}</span><strong>{star.name}</strong><X aria-hidden="true" />
                </button>
              ) : <i key={index} aria-hidden="true"><span>{index + 1}</span></i>;
            })}
          </div>

          <button className="draw-finish-command" type="button" disabled={draft.starIds.length < MIN_STARS || draft.completed} onClick={() => setComposerOpen(true)}>
            <WandSparkles aria-hidden="true" /> Name this constellation
          </button>
        </section>

        <AnimatePresence mode="wait">
          <motion.aside
            key={composerOpen ? "composer" : draft.completed ? "complete" : activeStar?.id ?? "empty"}
            className="sky-object-inspector draw-sky-inspector"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {composerOpen ? (
              <ConstellationComposer draft={draft} canFinish={canFinish} onCancel={() => setComposerOpen(false)} onComplete={completeConstellation} />
            ) : draft.completed ? (
              <CompletedConstellation
                draft={draft}
                copied={copied}
                cardUrl={cardUrl}
                onReplay={replay}
                onEdit={() => draft.reopen()}
                onCopy={copyShareLink}
                onShare={shareConstellation}
                onNew={startNewConstellation}
              />
            ) : (
              <StarInspector star={activeStar} selectedCount={draft.starIds.length} />
            )}
          </motion.aside>
        </AnimatePresence>
      </div>

      <div className="sky-workspace-statusline" aria-label="Builder status">
        <span><strong>{visibleStars.length}</strong> selectable stars</span>
        <span>{city.name} · {sky.darkness}</span>
      </div>
    </main>
  );
}

function StarInspector({ star, selectedCount }: { star: SkyObject | null; selectedCount: number }) {
  if (!star) {
    return (
      <>
        <span className="sky-inspector-kicker">Your constellation</span>
        <strong>Untitled</strong>
        <p>{selectedCount} / {MIN_STARS} minimum</p>
        <div className="draw-empty-meter" aria-hidden="true">{Array.from({ length: MIN_STARS }, (_, index) => <i key={index} data-filled={index < selectedCount} />)}</div>
      </>
    );
  }

  const catalogStar = STAR_CATALOG.find((item) => item.id === star.id);
  return (
    <>
      <span className="sky-inspector-kicker">Selected star</span>
      <strong>{star.name}</strong>
      <p>{star.hook}</p>
      <dl>
        <div><dt>Altitude</dt><dd>{star.altitude.toFixed(1)}°</dd></div>
        <div><dt>Bearing</dt><dd>{formatAzimuth(star.azimuth)} {star.azimuth.toFixed(0)}°</dd></div>
        <div><dt>Distance</dt><dd>{catalogStar?.distanceLabel ?? "Catalogued"}</dd></div>
      </dl>
      <div className="draw-star-note"><span>{star.spectral}</span><p>{star.story}</p></div>
    </>
  );
}

function ConstellationComposer({
  draft,
  canFinish,
  onCancel,
  onComplete,
}: {
  draft: ConstellationStore;
  canFinish: boolean;
  onCancel: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="draw-composer">
      <span className="sky-inspector-kicker">Name the pattern</span>
      <label><span>Name</span><input autoFocus value={draft.name} maxLength={40} placeholder="The Lantern" onChange={(event) => draft.setName(event.target.value)} /></label>
      <fieldset><legend>Meaning</legend><div>{THEMES.map((theme) => <button type="button" key={theme} data-active={draft.theme === theme} onClick={() => draft.setTheme(theme)}>{theme}</button>)}</div></fieldset>
      <label><span>One line</span><textarea value={draft.meaning} maxLength={160} placeholder="A small light for every road home." onChange={(event) => draft.setMeaning(event.target.value)} /><small>{draft.meaning.length} / 160</small></label>
      <div className="draw-composer-actions"><button type="button" onClick={onCancel}>Cancel</button><button type="button" disabled={!canFinish} onClick={onComplete}><Check aria-hidden="true" /> Complete</button></div>
    </div>
  );
}

function CompletedConstellation({
  draft,
  copied,
  cardUrl,
  onReplay,
  onEdit,
  onCopy,
  onShare,
  onNew,
}: {
  draft: ConstellationStore;
  copied: boolean;
  cardUrl: string;
  onReplay: () => void;
  onEdit: () => void;
  onCopy: () => void;
  onShare: () => void;
  onNew: () => void;
}) {
  return (
    <>
      <span className="sky-inspector-kicker">User-created · {draft.theme}</span>
      <strong>{draft.name}</strong>
      <p>{draft.meaning || `${draft.starIds.length} real stars connected above ${cityById(draft.cityId).name}.`}</p>
      <div className="draw-complete-meta"><span>{draft.starIds.length} stars · {draft.closed ? "closed" : "open"}</span><span>{formatDate(draft.date)}</span></div>
      <div className="draw-complete-actions">
        <button type="button" title="New constellation" aria-label="Start a new constellation" onClick={onNew}><Plus aria-hidden="true" /></button>
        <button type="button" title="Replay" aria-label="Replay constellation" onClick={onReplay}><Play aria-hidden="true" /></button>
        <button type="button" title="Edit" aria-label="Edit constellation" onClick={onEdit}><Pencil aria-hidden="true" /></button>
        <button type="button" title="Copy link" aria-label="Copy share link" onClick={onCopy}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}</button>
        <button type="button" title="Share" aria-label="Share constellation" onClick={onShare}><Share2 aria-hidden="true" /></button>
        <a href={`${cardUrl}&download=1`} title="Download card" aria-label="Download constellation card"><Download aria-hidden="true" /></a>
      </div>
    </>
  );
}

function draftFromSearchParams(params: URLSearchParams): SharedConstellationDraft | null {
  const starIds = (params.get("stars") ?? "").split(",").filter((id) => STAR_CATALOG.some((star) => star.id === id)).slice(0, MAX_STARS);
  const cityId = params.get("city") ?? "";
  const date = params.get("date") ?? "";
  const time = params.get("time") ?? "";
  const theme = params.get("theme") as ConstellationTheme | null;
  if (starIds.length < MIN_STARS || !CITIES.some((city) => city.id === cityId) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
  return {
    cityId,
    date,
    time,
    starIds,
    closed: params.get("closed") === "1",
    name: (params.get("name") ?? "My constellation").slice(0, 40),
    theme: theme && THEMES.includes(theme) ? theme : "Discovery",
    meaning: (params.get("meaning") ?? "").slice(0, 160),
  };
}

function buildShareUrl(draft: SharedConstellationDraft) {
  const params = new URLSearchParams({
    city: draft.cityId,
    date: draft.date,
    time: draft.time,
    stars: draft.starIds.join(","),
    closed: draft.closed ? "1" : "0",
    name: draft.name,
    theme: draft.theme,
  });
  if (draft.meaning) params.set("meaning", draft.meaning);
  return `${window.location.origin}/create?${params.toString()}`;
}

function constellationCardUrl({ draft, cityName, stars }: { draft: SharedConstellationDraft; cityName: string; stars: SkyObject[] }) {
  const params = new URLSearchParams({
    city: cityName,
    date: draft.date,
    time: draft.time,
    name: draft.name || "My constellation",
    theme: draft.theme,
    meaning: draft.meaning,
    stars: stars.map((star) => star.name).join("|"),
    points: stars.map(projectCardPoint).join("|"),
    closed: draft.closed ? "1" : "0",
  });
  return `/api/og/constellation?${params.toString()}`;
}

function projectCardPoint(star: SkyObject) {
  const angle = (star.azimuth * Math.PI) / 180;
  const radius = ((90 - Math.max(0, star.altitude)) / 90) * 225;
  const x = Math.round(860 + Math.sin(angle) * radius);
  const y = Math.round(338 - Math.cos(angle) * radius);
  return `${x},${y}`;
}
