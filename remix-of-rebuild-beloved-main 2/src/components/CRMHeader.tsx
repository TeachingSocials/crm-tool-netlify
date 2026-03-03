import { useState, useEffect } from "react";
import logo from "@/assets/teaching-socials-logo.png";

interface NavItem {
  label: string;
  active: boolean;
}

const navItems: NavItem[] = [
  { label: "CONSOLE", active: true },
  { label: "CONTACTS", active: false },
  { label: "CAMPAIGNS", active: false },
  { label: "ANALYTICS", active: false },
  { label: "SETTINGS", active: false },
];

interface CRMHeaderProps {
  visible: boolean;
}

export function CRMHeader({ visible }: CRMHeaderProps) {
  const [time, setTime] = useState(new Date().toLocaleTimeString("de-DE", { hour12: false }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString("de-DE", { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      style={{
        padding: "20px 40px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        background: "rgba(23, 40, 56, 0.8)",
        borderBottom: "1px solid rgba(192, 173, 148, 0.25)",
        backdropFilter: "blur(20px)",
        position: "relative",
        zIndex: 10,
        opacity: visible ? 1 : 0,
        animation: visible ? "headerSlide 0.5s ease both" : "none",
      }}
    >
      {/* Logo */}
      <div
        style={{
          filter: "drop-shadow(0 0 10px rgba(192,173,148,0.5))",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease 0.3s",
          whiteSpace: "nowrap",
        }}
      >
        <img src={logo} alt="Teaching Socials" style={{ height: "32px", width: "auto" }} />
      </div>

      {/* Divider */}
      <div
        style={{
          width: "1px",
          height: "25px",
          background: "linear-gradient(180deg, transparent, hsl(38 28% 67%), transparent)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease 0.4s",
        }}
      />

      {/* Nav */}
      <nav
        style={{
          display: "flex",
          gap: "30px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease 0.5s",
        }}
      >
        {navItems.map((item) => (
          <span
            key={item.label}
            style={{
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: item.active ? "hsl(38 28% 67%)" : "rgba(221, 227, 235, 0.4)",
              cursor: "pointer",
              position: "relative",
              transition: "color 0.3s ease",
            }}
          >
            {item.label}
            {item.active && (
              <span
                style={{
                  position: "absolute",
                  bottom: "-5px",
                  left: 0,
                  width: "100%",
                  height: "1px",
                  background: "hsl(38 28% 67%)",
                  boxShadow: "0 0 10px rgba(192,173,148,0.5)",
                }}
              />
            )}
          </span>
        ))}
      </nav>

      {/* Status */}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease 0.6s",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            color: "rgba(221,227,235,0.4)",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "0.05em",
          }}
        >
          {time}
        </span>
        <div
          style={{
            padding: "5px 12px",
            background: "rgba(192, 173, 148, 0.1)",
            border: "1px solid hsl(38 28% 67%)",
            fontSize: "9px",
            letterSpacing: "0.15em",
            color: "hsl(38 28% 67%)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              background: "hsl(38 28% 67%)",
              borderRadius: "50%",
              boxShadow: "0 0 10px rgba(192,173,148,0.5)",
              animation: "pulse 1s ease-in-out infinite",
            }}
          />
          SYSTEM ONLINE
        </div>
      </div>
    </header>
  );
}
