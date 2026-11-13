import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";
import { RouteHeader } from "@/components/product/RouteHeader";

type ObjectStoryPageProps = {
  name: string;
  kind: string;
  subtitle: string;
  story: string;
  accent: string;
  facts: Array<[string, string]>;
};

export function ObjectStoryPage({ name, kind, subtitle, story, accent, facts }: ObjectStoryPageProps) {
  return (
    <main className="route-page object-story-page" style={{ "--route-accent": accent } as CSSProperties}>
      <RouteHeader />
      <section className="object-story-shell">
        <div className="object-story-copy">
          <Link className="back-command" href="/"><ArrowLeft aria-hidden="true" /> Back to tonight</Link>
          <span className="route-eyebrow">Celestial archive / {kind}</span>
          <h1>{name}<span>.</span></h1>
          <p className="object-subtitle">{subtitle}</p>
          <p className="object-story-text">{story}</p>
          <Link className="route-primary-link" href="/">Find it in tonight&apos;s sky <ChevronRight aria-hidden="true" /></Link>
        </div>
        <div className="object-orbit" aria-hidden="true">
          <div className="orbit-ring ring-one" />
          <div className="orbit-ring ring-two" />
          <div className="object-core" />
          <span className="orbit-star star-one" />
          <span className="orbit-star star-two" />
          <span className="orbit-star star-three" />
        </div>
        <dl className="object-facts">
          {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
      </section>
    </main>
  );
}
