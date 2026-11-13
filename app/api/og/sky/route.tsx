import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const city = params.get("city")?.slice(0, 48) || "Addis Ababa";
  const date = params.get("date")?.slice(0, 20) || "Tonight";
  const time = params.get("time")?.slice(0, 12) || "21:00";
  const target = params.get("target")?.slice(0, 48) || "Tonight's sky";

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#050708",
        color: "#f2f0e8",
        fontFamily: "Arial, sans-serif",
        padding: "54px 58px",
      }}
    >
      <div style={{ position: "absolute", inset: 18, border: "1px solid #383c3b", display: "flex" }} />
      {[
        [690, 104, 8, "#d8e6ff"],
        [918, 152, 15, "#f0cf8a"],
        [1068, 310, 7, "#d8e6ff"],
        [770, 446, 10, "#e36e43"],
        [1000, 548, 5, "#d8e6ff"],
        [610, 342, 5, "#d8e6ff"],
      ].map(([left, top, size, color], index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left,
            top,
            width: size,
            height: size,
            borderRadius: 999,
            background: color,
            boxShadow: `0 0 ${Number(size) * 2}px ${color}`,
            display: "flex",
          }}
        />
      ))}
      <div style={{ position: "absolute", right: 74, top: 76, width: 430, height: 430, border: "1px solid #283332", borderRadius: 999, display: "flex" }} />
      <div style={{ position: "absolute", right: -10, top: 190, width: 620, height: 1, background: "#283332", transform: "rotate(-18deg)", display: "flex" }} />

      <div style={{ display: "flex", width: 580, flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 29 }}>SkyLore<span style={{ color: "#e36e43" }}>.</span></div>
          <div style={{ marginTop: 4, color: "#737875", fontSize: 12, letterSpacing: 3 }}>LIVE CELESTIAL OBSERVATORY</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 58, color: "#7e8380", fontSize: 14, letterSpacing: 3 }}>
          TONIGHT <span style={{ width: 42, height: 1, background: "#484d4b" }} /> {date.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 24, fontSize: 74, lineHeight: 0.94, fontWeight: 700 }}>
          <span>Look up.</span><span>Know what</span><span>you see.</span>
        </div>
        <div style={{ marginTop: 30, color: "#a4a7a1", fontSize: 19 }}>{`A verified sky story above ${city}.`}</div>
      </div>

      <div style={{ position: "absolute", right: 58, bottom: 54, display: "flex", width: 410, flexDirection: "column", alignItems: "flex-end" }}>
        <div style={{ color: "#737875", fontSize: 12, letterSpacing: 3 }}>SELECTED OBJECT</div>
        <div style={{ marginTop: 8, fontFamily: "Georgia, serif", fontSize: 52 }}>{target}</div>
        <div style={{ marginTop: 10, color: "#e36e43", fontSize: 14, letterSpacing: 2 }}>{`${time} LOCAL · ${city.toUpperCase()}`}</div>
      </div>
    </div>,
    { width: 1200, height: 675 },
  );
}
