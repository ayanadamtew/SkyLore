import { GitHubMark } from "@/components/ui/GitHubMark";
import { SkyLoreMark } from "@/components/ui/SkyLoreMark";
import Link from "next/link";

export function RouteHeader() {
  return (
    <header className="route-header">
      <Link className="route-brand" href="/" aria-label="SkyLore, home">
        <SkyLoreMark />
        <span className="route-brand-word">SkyLore<b>.</b></span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/">Tonight</Link>
        <Link href="/birth-sky">Birth sky</Link>
        <Link href="/create">Create</Link>
        <Link className="route-studio-link" href="/studio">Story studio</Link>
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
      </nav>
    </header>
  );
}
