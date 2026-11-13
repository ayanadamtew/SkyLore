"use client";

import { Check, RefreshCw, Sparkles, WandSparkles } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { CONSTELLATIONS, PLANETS, STAR_CATALOG } from "@/data/catalog";

type StudioCategory = "Star" | "Planet" | "Constellation";

type StudioRecord = {
  id: string;
  name: string;
  kind: StudioCategory;
  hook: string;
  story: string;
  color: string;
  image?: string;
  facts: Array<[string, string]>;
  funFacts: string[];
};

const STAR_FACTS: Record<string, string> = {
  sirius: "Sirius is a binary system; its faint companion is a dense white dwarf.",
  betelgeuse: "Its brightness changes as its enormous outer layers expand and contract.",
  rigel: "Rigel looks like one star to the eye, but it belongs to a multiple-star system.",
  bellatrix: "Its Latin name means female warrior, matching its place on Orion's shoulder.",
  saiph: "Saiph is hotter than Rigel even though it appears dimmer from Earth.",
  alnilam: "The middle star of Orion's Belt is also the most distant of the three belt stars.",
  alnitak: "The Flame and Horsehead nebulae lie close to Alnitak in our line of sight.",
  mintaka: "Mintaka sits almost exactly on the celestial equator.",
};

const PLANET_DETAILS: Record<string, { facts: Array<[string, string]>; funFacts: string[] }> = {
  mercury: {
    facts: [["Year", "88 Earth days"], ["Day", "59 Earth days"], ["Moons", "None"], ["Type", "Rocky world"]],
    funFacts: ["Mercury is the smallest planet in the Solar System.", "Its cratered surface preserves a long record of impacts.", "Sunrise to sunrise lasts about 176 Earth days."],
  },
  venus: {
    facts: [["Year", "225 Earth days"], ["Rotation", "Retrograde"], ["Moons", "None"], ["Type", "Rocky world"]],
    funFacts: ["A day on Venus is longer than its year.", "Venus rotates in the opposite direction to most planets.", "Its thick carbon-dioxide atmosphere makes it the hottest planet."],
  },
  mars: {
    facts: [["Year", "687 Earth days"], ["Day", "24.6 hours"], ["Moons", "Phobos, Deimos"], ["Type", "Rocky world"]],
    funFacts: ["Olympus Mons is the largest volcano in the Solar System.", "Iron minerals in the soil give Mars its rust-red color.", "Ancient river valleys show that liquid water once flowed there."],
  },
  jupiter: {
    facts: [["Year", "11.9 Earth years"], ["Day", "9.9 hours"], ["Feature", "Great Red Spot"], ["Type", "Gas giant"]],
    funFacts: ["Jupiter has the shortest day of any planet.", "Its Great Red Spot is a vast, long-lived storm.", "The planet is more than twice as massive as all the other planets combined."],
  },
  saturn: {
    facts: [["Year", "29.5 Earth years"], ["Day", "10.7 hours"], ["Rings", "Ice and rock"], ["Type", "Gas giant"]],
    funFacts: ["Saturn is less dense than liquid water.", "Its rings are broad but remarkably thin.", "The Cassini Division is a dark gap shaped by orbital resonances."],
  },
};

const RECORDS: StudioRecord[] = [
  ...STAR_CATALOG.slice(0, 8).map((item) => ({
    id: item.id,
    name: item.name,
    kind: "Star" as const,
    hook: item.hook,
    story: item.story,
    color: item.color,
    image: starImage(item.spectral),
    facts: [["Distance", item.distanceLabel], ["Spectral class", item.spectral], ["Magnitude", item.magnitude.toFixed(2)], ["Constellation", item.constellation]] as Array<[string, string]>,
    funFacts: [
      STAR_FACTS[item.id] ?? `${item.name} is catalogued as a ${item.spectral} star.`,
      `The light reaching you tonight began its journey about ${item.distanceLabel} ago.`,
      `Its color is a visible clue to its surface temperature and stellar class.`,
    ],
  })),
  ...PLANETS.map((item) => ({
    id: item.id,
    name: item.name,
    kind: "Planet" as const,
    hook: "A wandering world in our local sky.",
    story: item.story,
    color: item.color,
    image: `/celestial/${item.id}.png`,
    facts: PLANET_DETAILS[item.id].facts,
    funFacts: PLANET_DETAILS[item.id].funFacts,
  })),
  ...CONSTELLATIONS.map((item) => ({
    id: item.id,
    name: item.name,
    kind: "Constellation" as const,
    hook: item.subtitle,
    story: item.story,
    color: item.color,
    facts: [["Pattern", item.subtitle], ["Catalog stars", String(item.stars.length)], ["Segments", String(item.segments.length)], ["Nature", item.subtitle === "Asterism" ? "Asterism" : "Constellation"]] as Array<[string, string]>,
    funFacts: [
      "The stars in the pattern only appear close together from Earth's point of view.",
      "Each member can sit at a very different distance from us.",
      "The familiar outline is a cultural map laid over real stellar positions.",
    ],
  })),
];

const CATEGORIES: StudioCategory[] = ["Star", "Planet", "Constellation"];

export function StoryStudio() {
  const [category, setCategory] = useState<StudioCategory>("Star");
  const [recordId, setRecordId] = useState("sirius");
  const [tone, setTone] = useState("Field guide");
  const [audience, setAudience] = useState("Curious adult");
  const [revision, setRevision] = useState(0);
  const record = useMemo(() => RECORDS.find((item) => item.id === recordId) ?? RECORDS[0], [recordId]);
  const visibleRecords = useMemo(() => RECORDS.filter((item) => item.kind === category), [category]);

  const openings = tone === "Poetic"
    ? [`${record.name} arrives as an old message written in light.`, `${record.name} holds its place while the night turns around it.`, `Look long enough and ${record.name} becomes more than a point of light.`]
    : tone === "For children"
      ? [`Find ${record.name}, then imagine how far its light has travelled to meet you.`, `Point to ${record.name}: you have just found one of the sky's oldest stories.`, `${record.name} looks tiny from here, but the real object is wonderfully immense.`]
      : [`${record.name} is a reliable landmark for tonight's observer.`, `${record.name} rewards a few quiet minutes of careful observation.`, `${record.name} turns a familiar patch of sky into a precise astronomical place.`];
  const opening = openings[revision % openings.length];

  function changeCategory(nextCategory: StudioCategory) {
    setCategory(nextCategory);
    const nextRecord = RECORDS.find((item) => item.kind === nextCategory);
    if (nextRecord) setRecordId(nextRecord.id);
  }

  return (
    <div className="studio-experience">
      <aside className="studio-controls">
        <div className="studio-controls-head">
          <span className="route-eyebrow">Editorial instrument</span>
          <h1>Story studio<span>.</span></h1>
          <p>Select an object, then shape its verified facts into a voice that fits your reader.</p>
        </div>

        <section className="studio-picker" aria-label="Celestial object selection">
          <div className="studio-category-tabs" role="tablist" aria-label="Object category">
            {CATEGORIES.map((item) => (
              <button key={item} type="button" role="tab" aria-selected={category === item} data-active={category === item} onClick={() => changeCategory(item)}>
                {item}s
              </button>
            ))}
          </div>

          <div className="studio-object-list" role="listbox" aria-label={`${category} selection`}>
            {visibleRecords.map((item) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={record.id === item.id}
                data-active={record.id === item.id}
                onClick={() => setRecordId(item.id)}
              >
                <span className="studio-option-visual" data-kind={item.kind.toLowerCase()}>
                  {item.image ? <Image src={item.image} alt="" width={54} height={54} sizes="54px" /> : <ConstellationMark />}
                </span>
                <span><strong>{item.name}</strong><small>{item.hook}</small></span>
                <Check aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>

        <div className="studio-language-controls">
          <label><span>Tone</span><select value={tone} onChange={(event) => setTone(event.target.value)}><option>Field guide</option><option>Poetic</option><option>For children</option></select></label>
          <label><span>Audience</span><select value={audience} onChange={(event) => setAudience(event.target.value)}><option>Curious adult</option><option>Family</option><option>Classroom</option></select></label>
        </div>

        <button className="studio-regenerate" type="button" onClick={() => setRevision((value) => value + 1)}><RefreshCw aria-hidden="true" /> Regenerate language</button>
      </aside>

      <article className="studio-output" key={`${record.id}-${tone}-${revision}`} style={{ "--studio-object-color": record.color } as CSSProperties}>
        <div className="studio-output-head"><span>Draft {String(revision + 1).padStart(2, "0")}</span><span>{tone} / {audience}</span></div>

        <div className="studio-draft-hero">
          <div className="studio-celestial-stage" data-kind={record.kind.toLowerCase()}>
            <i className="studio-orbit orbit-a" aria-hidden="true" />
            <i className="studio-orbit orbit-b" aria-hidden="true" />
            {record.image ? (
              <Image className="studio-celestial-image" src={record.image} alt={`${record.name} celestial portrait`} width={720} height={720} sizes="(max-width: 900px) 72vw, 34vw" priority />
            ) : <ConstellationMark large />}
          </div>
          <div className="studio-draft-title">
            <span className="route-eyebrow">Tonight&apos;s story / {record.kind}</span>
            <h2>{record.name}</h2>
            <p className="studio-opening">{opening}</p>
          </div>
        </div>

        <dl className="studio-fact-strip">
          {record.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>

        <div className="studio-story-columns">
          <section><h3>What you are seeing</h3><p>{record.story}</p></section>
          <section className="studio-fun-facts"><h3>Little wonders</h3><ul>{record.funFacts.map((fact) => <li key={fact}><Sparkles aria-hidden="true" /><span>{fact}</span></li>)}</ul></section>
        </div>

        <footer><WandSparkles aria-hidden="true" /><span>Positional claims come from the astronomy result; the editor changes language, never coordinates.</span></footer>
      </article>
    </div>
  );
}

function starImage(spectral: string) {
  if (spectral.startsWith("M")) return "/celestial/star-red.png";
  if (["F", "G", "K"].includes(spectral.charAt(0))) return "/celestial/star-gold.png";
  return "/celestial/star-blue.png";
}

function ConstellationMark({ large = false }: { large?: boolean }) {
  return (
    <span className="studio-constellation-mark" data-large={large} aria-hidden="true">
      <i /><i /><i /><i /><i /><i />
    </span>
  );
}
