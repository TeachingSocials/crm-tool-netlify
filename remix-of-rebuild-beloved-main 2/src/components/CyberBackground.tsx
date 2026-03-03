import { useEffect, useRef, useState } from "react";

interface Node {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

export function CyberGrid() {
  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-0"
      style={{
        width: "200%",
        height: "200%",
        background: `
          linear-gradient(90deg, rgba(192, 173, 148, 0.03) 1px, transparent 1px),
          linear-gradient(rgba(192, 173, 148, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        transform: "rotateX(60deg) translateY(-50%)",
        transformOrigin: "center center",
        animation: "gridMove 20s linear infinite",
      }}
    />
  );
}

export function FloatingNodes() {
  const [nodes] = useState<Node[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 6 + Math.random() * 4,
    }))
  );

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]">
      {nodes.map((node) => (
        <div
          key={node.id}
          style={{
            position: "absolute",
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: "4px",
            height: "4px",
            background: "hsl(38 28% 67%)",
            borderRadius: "50%",
            boxShadow: "0 0 10px rgba(192,173,148,0.5), 0 0 20px rgba(192,173,148,0.5)",
            animation: `nodeFloat ${node.duration}s ease-in-out ${node.delay}s infinite`,
          }}
        >
          <div
            style={{
              content: "",
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "20px",
              height: "20px",
              border: "1px solid hsl(38 28% 67%)",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.3,
              animation: `nodePulse 2s ease-out ${node.delay}s infinite`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function Scanlines() {
  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[998]"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            rgba(192, 173, 148, 0.008) 1px,
            transparent 2px
          )`,
          animation: "scanlineFlicker 0.1s infinite",
        }}
      />
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[997]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.02,
        }}
      />
    </>
  );
}
