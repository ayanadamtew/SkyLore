"use client";

import { HeroSkyScene } from "@/components/astronomy/HeroSkyScene";
import { GitHubMark } from "@/components/ui/GitHubMark";
import Link from "next/link";
import { ArrowDown, ArrowRight, Menu, MoonStar, Sparkles, Telescope, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  ["Tonight", "/sky/addis-ababa"],
  ["Birth sky", "/birth-sky"],
  ["Create", "/create"],
  ["Studio", "/studio"],
] as const;

export function HomeHero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="home-landing">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-scene" aria-hidden="true">
          <HeroSkyScene />
        </div>
        <div className="home-hero-shade" aria-hidden="true" />
        <div className="home-hero-frame" aria-hidden="true" />
        <div className="home-altitude-scale" aria-hidden="true">
          {[90, 75, 60, 45, 30, 15, 0].map((altitude, index) => (
            <span key={altitude} style={{ top: `${15 + index * 10.2}%` }}>{altitude}°</span>
          ))}
        </div>
        <div className="home-bearing-scale" aria-hidden="true">
          {["300°", "330°", "0°", "30°", "60°"].map((bearing) => <span key={bearing}>{bearing}</span>)}
        </div>

        <header className="home-nav">
          <Link className="home-brand" href="/" aria-label="SkyLore, home">
            <MoonStar aria-hidden="true" />
            <span>SkyLore</span>
          </Link>

          <nav className="home-nav-links" data-open={menuOpen} aria-label="Primary navigation">
            {NAV_LINKS.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="home-nav-actions">
            <Link className="home-observatory-link" href="/sky/addis-ababa">
              <Telescope aria-hidden="true" />
              <span>Enter observatory</span>
            </Link>
            <a
              className="github-repository-link"
              href="https://github.com/ayanadamtew/SkyLore"
              target="_blank"
              rel="noreferrer"
              aria-label="View SkyLore on GitHub"
              title="View SkyLore on GitHub"
            >
              <GitHubMark />
            </a>
            <button
              className="home-menu-button"
              type="button"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </header>

        <div className="home-hero-copy">
          <p className="home-hero-kicker">Live celestial observatory</p>
          <span className="home-hero-rule" aria-hidden="true" />
          <h1 id="home-title">
            Sky
            <br />
            Lore<span>.</span>
          </h1>
          <p className="home-hero-promise">Look up. Know what you see.</p>
          <div className="home-hero-actions">
            <Link className="home-primary-action" href="/sky/addis-ababa">
              Open tonight&apos;s sky <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="home-secondary-action" href="/birth-sky">
              Find your birth sky
            </Link>
          </div>
        </div>

        <aside className="home-telemetry" aria-label="Hero sky field details">
          <span>Sky field / 001</span>
          <dl>
            <div><dt>Grid</dt><dd>ALT / AZ</dd></div>
            <div><dt>Map</dt><dd>NASA LRO</dd></div>
            <div><dt>Field</dt><dd>78.0°</dd></div>
          </dl>
        </aside>

        <a className="home-scroll-cue" href="#portals" aria-label="Explore the site">
          <ArrowDown aria-hidden="true" />
        </a>
      </section>

      <section className="home-portals" id="portals" aria-label="Explore SkyLore">
        <Link href="/sky/addis-ababa">
          <span>01</span>
          <div><strong>Tonight&apos;s sky</strong><small>The live observatory</small></div>
          <Telescope aria-hidden="true" />
        </Link>
        <Link href="/birth-sky">
          <span>02</span>
          <div><strong>Your birth sky</strong><small>A moment written overhead</small></div>
          <Sparkles aria-hidden="true" />
        </Link>
        <Link href="/create">
          <span>03</span>
          <div><strong>Draw your sky</strong><small>Connect real stars into your story</small></div>
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
