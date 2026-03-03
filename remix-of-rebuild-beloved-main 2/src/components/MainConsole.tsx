import { useState, useRef, useEffect } from "react";


interface LogEntry {
  id: number;
  ts: string;
  type: "info" | "success" | "error" | "warn";
  prefix: string;
  message: string;
}

const initialLogs: LogEntry[] = [
  { id: 1, ts: "00:00:01", type: "info", prefix: "SYS", message: "CRM Console initialized. Waiting for input." },
];

let logIdCounter = 2;



export function MainConsole({ visible }: { visible: boolean }) {
  const [apiKey, setApiKey] = useState("");
  const [keyError, setKeyError] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [running, setRunning] = useState(false);
  const [logActive, setLogActive] = useState(false);
  const logBodyRef = useRef<HTMLDivElement>(null);

  const isValidKey = apiKey.trim().startsWith("api_") && apiKey.trim().length > 4;

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setApiKey(val);
    if (val && !val.startsWith("api_")) {
      setKeyError("KEY MUST START WITH api_");
    } else {
      setKeyError("");
    }
  };

  useEffect(() => {
    if (logBodyRef.current) {
      logBodyRef.current.scrollTop = logBodyRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (entry: Omit<LogEntry, "id" | "ts">) => {
    const ts = new Date().toLocaleTimeString("de-DE", { hour12: false });
    setLogs((prev) => [...prev, { ...entry, id: logIdCounter++, ts }]);
  };

  const handleExecute = async () => {
    if (running || !isValidKey) return;
    setRunning(true);
    setLogActive(true);

    addLog({ type: "info", prefix: "API", message: `VALIDATING KEY: ${apiKey.slice(0, 8)}${"*".repeat(Math.max(0, apiKey.length - 8))}` });
    addLog({ type: "info", prefix: "NET", message: "ESTABLISHING SECURE TUNNEL..." });

    try {
      const response = await fetch("/.netlify/functions/webhook-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });
      const data = await response.json();
      const error = !response.ok ? { message: data.error || "Request failed" } : null;

      if (error) {
        addLog({ type: "error", prefix: "ERR", message: `REQUEST FAILED: ${error.message}` });
      } else {
        const total = data?.total ?? 9;
        const succeeded = data?.results?.filter((r: { ok: boolean }) => r.ok).length ?? 0;
        const failed = total - succeeded;

        addLog({ type: "success", prefix: "AUTH", message: "SECURE TUNNEL ESTABLISHED" });
        addLog({ type: "info", prefix: "HOOK", message: `DISPATCHING TO ${total} WEBHOOKS IN PARALLEL...` });

        if (data?.results) {
          data.results.forEach((r: { webhook: number; ok: boolean; status?: number; error?: string }) => {
            if (r.ok) {
              addLog({ type: "success", prefix: `WH${String(r.webhook).padStart(2, "0")}`, message: `WEBHOOK ${r.webhook} — STATUS ${r.status} OK` });
            } else {
              addLog({ type: "error", prefix: `WH${String(r.webhook).padStart(2, "0")}`, message: `WEBHOOK ${r.webhook} — FAILED${r.error ? `: ${r.error}` : ""}` });
            }
          });
        }

        if (failed === 0) {
          addLog({ type: "success", prefix: "SYNC", message: `ALL ${total} WEBHOOKS ACKNOWLEDGED. TRANSMISSION COMPLETE.` });
        } else {
          addLog({ type: "warn", prefix: "SYNC", message: `${succeeded}/${total} WEBHOOKS OK — ${failed} FAILED` });
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "UNKNOWN ERROR";
      addLog({ type: "error", prefix: "ERR", message: `CRITICAL FAILURE: ${msg}` });
    }

    setRunning(false);
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case "success": return { color: "hsl(0 0% 96%)", textShadow: "0 0 10px rgba(192,173,148,0.5)" };
      case "error": return { color: "#ff6b6b" };
      case "warn": return { color: "hsl(38 28% 67%)" };
      default: return { color: "hsl(210 25% 83%)" };
    }
  };

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "50px 40px",
        position: "relative",
        zIndex: 10,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Page title */}
      <h1
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "32px",
          fontWeight: 400,
          letterSpacing: "0.1em",
          color: "hsl(0 0% 96%)",
          marginBottom: "10px",
          textShadow: "0 0 30px rgba(192,173,148,0.5)",
        }}
      >
        CRM CONSOLE
      </h1>
      <p style={{ fontSize: "12px", color: "rgba(221,227,235,0.4)", letterSpacing: "0.05em" }}>
        TEACHING SOCIALS — CONTACT RELATIONSHIP MANAGEMENT SYSTEM v3.2.1
      </p>



      {/* Input Card */}
      <div
        style={{
          marginTop: "40px",
          background: "rgba(23, 40, 56, 0.8)",
          border: "1px solid rgba(192, 173, 148, 0.25)",
          padding: "30px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "3px",
            background: "linear-gradient(90deg, hsl(210 41% 12%), hsl(38 28% 67%), hsl(210 25% 83%))",
          }}
        />
        {/* Shine */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "50%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(192,173,148,0.03), transparent)",
            animation: "cardShine 3s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "hsl(38 28% 67%)",
            marginBottom: "15px",
          }}
        >
          <span style={{ opacity: 0.5 }}>//</span>
          API KEY AUTHENTICATION
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <input
            type="text"
            value={apiKey}
            onChange={handleKeyChange}
            onKeyDown={(e) => e.key === "Enter" && handleExecute()}
            placeholder="api_xxxxxxxxxxx"
            style={{
              flex: 1,
              padding: "18px 20px",
              background: "rgba(0, 0, 0, 0.4)",
              border: `1px solid ${keyError ? "#ff6b6b" : "rgba(192, 173, 148, 0.25)"}`,
              color: "hsl(0 0% 96%)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = keyError ? "#ff6b6b" : "hsl(38 28% 67%)";
              e.target.style.boxShadow = keyError
                ? "0 0 20px rgba(255,107,107,0.2)"
                : "0 0 30px rgba(192,173,148,0.3), inset 0 0 20px rgba(192,173,148,0.05)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = keyError ? "#ff6b6b" : "rgba(192, 173, 148, 0.25)";
              e.target.style.boxShadow = "none";
            }}
          />
          <button
            onClick={handleExecute}
            disabled={!isValidKey || running}
            style={{
              padding: "18px 40px",
              background: running ? "hsl(38 28% 67%)" : "transparent",
              border: "1px solid hsl(38 28% 67%)",
              color: running ? "hsl(210 41% 12%)" : "hsl(38 28% 67%)",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.2em",
              cursor: isValidKey && !running ? "pointer" : "not-allowed",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              animation: running ? "btnPulse 0.5s ease-in-out infinite" : "none",
              opacity: !isValidKey && !running ? 0.4 : 1,
            }}
          >
            {running ? "RUNNING..." : "EXECUTE"}
          </button>
        </div>
        {keyError && (
          <div style={{
            marginTop: "8px",
            fontSize: "10px",
            color: "#ff6b6b",
            letterSpacing: "0.15em",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}>
            <span>⚠</span> {keyError}
          </div>
        )}
      </div>

      {/* Log Panel */}
      <div
        style={{
          marginTop: "30px",
          background: "rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(192, 173, 148, 0.25)",
        }}
      >
        <div
          style={{
            padding: "12px 20px",
            background: "rgba(192, 173, 148, 0.05)",
            borderBottom: "1px solid rgba(192, 173, 148, 0.25)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "hsl(38 28% 67%)" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: logActive ? "hsl(38 28% 67%)" : "rgba(221,227,235,0.4)",
                boxShadow: logActive ? "0 0 15px rgba(192,173,148,0.5)" : "none",
                animation: logActive ? "pulse 0.3s ease-in-out infinite" : "none",
                transition: "all 0.3s ease",
              }}
            />
            SYSTEM LOG
          </div>
          <span style={{ fontSize: "10px", color: "rgba(221,227,235,0.4)", fontVariantNumeric: "tabular-nums" }}>
            {new Date().toLocaleTimeString("de-DE", { hour12: false })}
          </span>
        </div>

        <div
          ref={logBodyRef}
          style={{
            padding: "20px",
            maxHeight: "280px",
            overflowY: "auto",
            fontSize: "12px",
            lineHeight: "2",
          }}
        >
          {logs.map((entry) => (
            <div
              key={entry.id}
              style={{
                animation: "logIn 0.25s ease forwards",
                ...getLogColor(entry.type),
              }}
            >
              <span style={{ color: "rgba(221,227,235,0.4)", marginRight: "15px", fontSize: "10px" }}>{entry.ts}</span>
              <span style={{ color: "hsl(38 28% 67%)", marginRight: "10px" }}>[{entry.prefix}]</span>
              {entry.message}
            </div>
          ))}
          {running && (
            <div style={{ color: "rgba(221,227,235,0.4)", animation: "pulse 1s ease-in-out infinite" }}>
              <span style={{ color: "rgba(221,227,235,0.4)", marginRight: "15px", fontSize: "10px" }}>
                {new Date().toLocaleTimeString("de-DE", { hour12: false })}
              </span>
              ▌
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "30px",
          fontSize: "10px",
          color: "rgba(221,227,235,0.4)",
          letterSpacing: "0.1em",
          opacity: 0.5,
        }}
      >
        TEACHING SOCIALS CRM CONSOLE — RESTRICTED ACCESS — ALL ACTIVITY LOGGED
      </div>
    </main>
  );
}
