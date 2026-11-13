import Link from "next/link";

export function RouteHeader() {
  return (
    <header className="route-header">
      <Link className="route-brand" href="/">SkyLore<span>.</span></Link>
      <nav aria-label="Primary navigation">
        <Link href="/">Tonight</Link>
        <Link href="/birth-sky">Birth sky</Link>
        <Link href="/create">Create</Link>
        <Link href="/studio">Story studio</Link>
      </nav>
    </header>
  );
}
