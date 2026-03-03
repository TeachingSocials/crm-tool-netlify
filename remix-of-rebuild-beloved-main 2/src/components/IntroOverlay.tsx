import { useEffect, useState } from "react";
import logo from "@/assets/teaching-socials-logo.png";

interface IntroOverlayProps {
  onComplete: () => void;
}

const bootLines = [
  { text: "INITIALIZING TEACHING SOCIALS CRM v3.2.1", type: "cmd" },
  { text: "LOADING NEURAL NETWORK MODULES...", type: "data" },
  { text: "DATABASE CONNECTION ESTABLISHED", type: "success" },
  { text: "LOADING CONTACT MATRIX... 12,847 RECORDS", type: "data" },
  { text: "SOCIAL GRAPH SYNC COMPLETE", type: "success" },
  { text: "AUTHENTICATION PROTOCOLS ACTIVE", type: "warn" },
  { text: "SYSTEM READY. WELCOME BACK.", type: "success" },
];

export function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const [logoVisible, setLogoVisible] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [floating, setFloating] = useState(false);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [filledBars, setFilledBars] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Logo appears
    const t1 = setTimeout(() => setLogoVisible(true), 300);
    // Glitch
    const t2 = setTimeout(() => setGlitching(true), 800);
    const t3 = setTimeout(() => setGlitching(false), 1100);
    // Float
    const t4 = setTimeout(() => setFloating(true), 1200);
    // Terminal
    const t5 = setTimeout(() => setTerminalVisible(true), 1500);

    // Boot lines
    bootLines.forEach((_, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
      }, 1700 + i * 220);
    });

    // Loader bars — reveal one at a time, 300ms apart
    const loaderStart = 1700 + bootLines.length * 220;
    Array.from({ length: 8 }, (_, i) => {
      setTimeout(() => setFilledBars(i + 1), loaderStart + i * 300);
    });

    // Fade out
    const t7 = setTimeout(() => setFadeOut(true), 1700 + bootLines.length * 220 + 2200);
    const t8 = setTimeout(() => onComplete(), 1700 + bootLines.length * 220 + 3000);

    return () => [t1, t2, t3, t4, t5, t7, t8].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-[1000]"
      style={{
        background: "hsl(205 30% 8%)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? "scale(1.1)" : "scale(1)",
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      {/* Holo rings */}
      <div className="relative" style={{ perspective: "1000px" }}>
        {[350, 400, 450].map((size, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: size,
              height: size,
              border: "1px solid hsl(38 28% 67%)",
              borderRadius: "50%",
              animation: `holoRing 3s ease-out ${0.5 + i * 0.2}s both`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Logo */}
        <div className="relative z-10">
          <div
            style={{
              textAlign: "center",
              opacity: logoVisible ? 1 : 0,
              transition: "opacity 0.5s ease",
              filter: "drop-shadow(0 0 30px rgba(192,173,148,0.5))",
              animation: glitching
                ? "glitch 0.3s steps(2) infinite"
                : floating
                ? "logoFloat 3s ease-in-out infinite"
                : "none",
              padding: "40px 60px",
            }}
          >
            <img
              src={logo}
              alt="Teaching Socials"
              style={{ width: "280px", height: "auto", display: "block", margin: "0 auto" }}
            />
          </div>
        </div>
      </div>

      {/* Terminal */}
      <div
        style={{
          marginTop: "60px",
          width: "500px",
          maxWidth: "90vw",
          background: "rgba(23, 40, 56, 0.95)",
          border: "1px solid hsl(38 28% 67%)",
          boxShadow: "0 0 30px rgba(192,173,148,0.5), inset 0 0 30px rgba(192,173,148,0.05)",
          opacity: terminalVisible ? 1 : 0,
          transform: terminalVisible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s ease",
        }}
      >
        {/* Terminal header */}
        <div
          style={{
            padding: "10px 15px",
            background: "rgba(192, 173, 148, 0.1)",
            borderBottom: "1px solid rgba(192,173,148,0.25)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {[0.4, 0.6, 1].map((opacity, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "hsl(38 28% 67%)",
                opacity,
                boxShadow: i === 2 ? "0 0 8px rgba(192,173,148,0.5)" : "none",
              }}
            />
          ))}
          <span
            style={{
              marginLeft: "10px",
              fontSize: "10px",
              color: "hsl(38 28% 67%)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            SYSTEM BOOT — CRM_CONSOLE
          </span>
        </div>

        {/* Terminal body */}
        <div style={{ padding: "20px", fontSize: "11px", lineHeight: "1.8", maxHeight: "200px", overflow: "hidden" }}>
          {bootLines.map((line, i) => (
            <div
              key={i}
              style={{
                opacity: visibleLines.includes(i) ? 1 : 0,
                transform: visibleLines.includes(i) ? "translateX(0)" : "translateX(-10px)",
                transition: "all 0.2s ease",
                color:
                  line.type === "success"
                    ? "hsl(0 0% 96%)"
                    : line.type === "data"
                    ? "hsl(210 25% 83%)"
                    : line.type === "warn"
                    ? "hsl(38 28% 67%)"
                    : "rgba(221, 227, 235, 0.4)",
                textShadow: line.type === "success" ? "0 0 10px rgba(192,173,148,0.5)" : "none",
              }}
            >
              <span style={{ color: "rgba(221,227,235,0.4)", marginRight: "12px" }}>
                {String(i).padStart(2, "0")}
              </span>
              <span style={{ color: "hsl(38 28% 67%)", marginRight: "8px" }}>›</span>
              {line.text}
            </div>
          ))}
        </div>
      </div>

      {/* Hex loader */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          gap: "5px",
        }}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            style={{
              width: "30px",
              height: "6px",
              background: "rgba(192,173,148,0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {filledBars > i && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, hsl(38 28% 67%), hsl(0 0% 96%))",
                  animation: "hexFill 0.25s ease forwards",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
