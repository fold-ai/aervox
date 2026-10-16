import { ImageResponse } from "next/og";

const size = { width: 1200, height: 630 };
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ffffff", color: "#111411", padding: "64px 72px", fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", fontSize: 32, letterSpacing: 8 }}>ACTPROVE</div>
    <div style={{ display: "flex", flexDirection: "column", fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}><span>Intelligence.</span><span>Across the mission.</span></div>
    <div style={{ display: "flex", borderTop: "1px solid #afb2ae", paddingTop: 24, fontSize: 23 }}>DEFENSE TECHNOLOGY / SOFTWARE + HARDWARE</div>
  </div>, size);
}
