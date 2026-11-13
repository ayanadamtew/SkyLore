import { ImageResponse } from "next/og";

export const runtime = "nodejs";

type CardPoint = { x: number; y: number };

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const city = clean(params.get("city"), 48, "Addis Ababa");
  const date = clean(params.get("date"), 20, "Tonight");
  const time = clean(params.get("time"), 12, "21:00");
  const name = clean(params.get("name"), 40, "My constellation");
  const theme = clean(params.get("theme"), 20, "Discovery");
  const meaning = clean(params.get("meaning"), 160, "A personal pattern drawn through real stars.");
  const stars = (params.get("stars") ?? "").split("|").map((star) => clean(star, 24, "Star")).slice(0, 8);
  const points = parsePoints(params.get("points") ?? "");
  const closed = params.get("closed") === "1" && points.length >= 3;
  const segments = points.slice(1).map((point, index) => [points[index], point] as const);
  if (closed) segments.push([points.at(-1)!, points[0]]);
  const filename = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "my-constellation"}.png`;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#040708",
        color: "#f2f0e8",
        fontFamily: "Arial, sans-serif",
        padding: "58px 62px",
      }}
    >
      <div style={{ position: "absolute", inset: 18, border: "1px solid #3b403e", display: "flex" }} />
      {backgroundStars().map(([left, top, size, color], index) => (
        <div key={index} style={{ position: "absolute", left, top, width: size, height: size, borderRadius: 999, background: color, boxShadow: `0 0 ${Number(size) * 2}px ${color}`, display: "flex" }} />
      ))}

      <div style={{ display: "flex", width: 455, flexDirection: "column" }}>
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 27 }}>SkyLore<span style={{ color: "#e36e43" }}>.</span></div>
        <div style={{ marginTop: 4, color: "#727774", fontSize: 11, letterSpacing: 3 }}>USER-CREATED CONSTELLATION</div>
        <div style={{ marginTop: 74, color: "#e36e43", fontSize: 12, letterSpacing: 3 }}>{theme.toUpperCase()}</div>
        <div style={{ display: "flex", marginTop: 12, fontFamily: "Georgia, serif", fontSize: 66, lineHeight: 0.92 }}>{name}</div>
        <div style={{ display: "flex", marginTop: 24, maxWidth: 410, color: "#aaa9a2", fontFamily: "Georgia, serif", fontSize: 20, lineHeight: 1.45 }}>{meaning}</div>
        <div style={{ display: "flex", marginTop: "auto", color: "#777c78", fontSize: 11, letterSpacing: 2 }}>{`${date.toUpperCase()} · ${time} LOCAL`}</div>
        <div style={{ display: "flex", marginTop: 7, color: "#d6d3ca", fontSize: 13, letterSpacing: 1 }}>{city.toUpperCase()}</div>
      </div>

      <div style={{ position: "absolute", left: 610, top: 88, width: 500, height: 500, border: "1px solid #303a38", borderRadius: 999, display: "flex" }} />
      <div style={{ position: "absolute", left: 654, top: 132, width: 412, height: 412, border: "1px solid #1e2927", borderRadius: 999, display: "flex" }} />

      {segments.map(([previous, point], index) => {
        const dx = point.x - previous.x;
        const dy = point.y - previous.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const left = (previous.x + point.x - length) / 2;
        const top = (previous.y + point.y) / 2 - 1;
        return (
          <div
            key={`line-${index}`}
            style={{
              position: "absolute",
              left,
              top,
              width: length,
              height: 2,
              background: index === segments.length - 1 ? "#f2d59a" : "#e36e43",
              opacity: 0.76,
              transform: `rotate(${angle}deg)`,
              display: "flex",
            }}
          />
        );
      })}

      {points.map((point, index) => (
        <div key={`star-${index}`} style={{ position: "absolute", left: point.x - 7, top: point.y - 7, width: 14, height: 14, borderRadius: 999, background: "#fff3d3", boxShadow: "0 0 18px #fff3d3", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", top: 19, color: "#babbb4", fontSize: 9, letterSpacing: 1, whiteSpace: "nowrap", display: "flex" }}>{stars[index] ?? `STAR ${index + 1}`}</div>
        </div>
      ))}
    </div>,
    {
      width: 1200,
      height: 675,
      headers: params.get("download") === "1" ? { "Content-Disposition": `attachment; filename="${filename}"` } : undefined,
    },
  );
}

function clean(value: string | null, limit: number, fallback: string) {
  const normalized = value?.replace(/[<>]/g, "").trim().slice(0, limit);
  return normalized || fallback;
}

function parsePoints(value: string): CardPoint[] {
  return value.split("|").slice(0, 8).map((pair) => {
    const [rawX, rawY] = pair.split(",").map(Number);
    return {
      x: Number.isFinite(rawX) ? Math.max(620, Math.min(1100, rawX)) : 860,
      y: Number.isFinite(rawY) ? Math.max(90, Math.min(585, rawY)) : 338,
    };
  });
}

function backgroundStars(): Array<[number, number, number, string]> {
  return [
    [544, 77, 4, "#d8e6ff"], [721, 59, 3, "#f0cf8a"], [1140, 108, 5, "#d8e6ff"],
    [559, 274, 3, "#e36e43"], [1166, 402, 4, "#d8e6ff"], [705, 612, 3, "#f0cf8a"],
    [1065, 626, 5, "#d8e6ff"], [978, 64, 3, "#e36e43"], [594, 512, 4, "#d8e6ff"],
  ];
}
