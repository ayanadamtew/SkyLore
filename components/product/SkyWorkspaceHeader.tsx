import { MoonStar } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type SkyWorkspaceHeaderProps = {
  active: "tonight" | "birth" | "create";
  children?: ReactNode;
};

export function SkyWorkspaceHeader({ active, children }: SkyWorkspaceHeaderProps) {
  return (
    <header className="sky-workspace-header">
      <Link className="sky-workspace-brand" href="/" aria-label="SkyLore, home">
        <MoonStar aria-hidden="true" />
        <span>SkyLore</span>
      </Link>

      <nav className="sky-workspace-modes" aria-label="Sky modes">
        <Link href="/sky/addis-ababa" data-active={active === "tonight"}>Tonight</Link>
        <Link href="/birth-sky" data-active={active === "birth"}>Birth sky</Link>
        <Link href="/create" data-active={active === "create"}>Create</Link>
      </nav>

      <div className="sky-workspace-meta">{children}</div>
    </header>
  );
}
