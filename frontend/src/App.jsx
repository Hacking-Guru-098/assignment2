import { useMemo, useState } from "react";
import "./App.css";

export default function App() {
  const [output, setOutput] = useState("");
  const [active, setActive] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  const actions = useMemo(
    () => [
      {
        id: "free-mem",
        title: "Free memory",
        description: "Available system RAM right now.",
      },
      {
        id: "total-mem",
        title: "Total memory",
        description: "Total installed system RAM.",
      },
      {
        id: "cpu-arch",
        title: "CPU architecture",
        description: "The CPU architecture Node reports.",
      },
      {
        id: "user-info",
        title: "User info",
        description: "Current OS user details (from Node).",
      },
    ],
    [],
  );

  const formatBytes = (bytes) => {
    if (typeof bytes !== "number" || !Number.isFinite(bytes)) return null;
    const units = ["B", "KB", "MB", "GB", "TB"];
    let n = Math.max(0, bytes);
    let i = 0;
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024;
      i += 1;
    }
    return `${n.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
  };

  const fetchData = async (endpoint) => {
    try {
      setActive(endpoint);
      setStatus("loading");
      setError("");

      const res = await fetch(`http://localhost:5000/${endpoint}`);
      if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);

      const payload = await res.json();
      const value = payload?.data;

      // Pretty output for memory endpoints
      if (endpoint === "free-mem" || endpoint === "total-mem") {
        const pretty = formatBytes(value);
        setOutput(
          JSON.stringify(
            {
              bytes: value,
              human: pretty ?? String(value),
            },
            null,
            2,
          ),
        );
      } else {
        setOutput(JSON.stringify(value, null, 2));
      }

      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output || "");
    } catch {
      // ignore; clipboard may be blocked in some contexts
    }
  };

  return (
    <div className="app">
      <header className="appHeader">
        <div>
          <div className="appKicker">System dashboard</div>
          <h1 className="appTitle">Work with OS</h1>
          <p className="appSubtitle">
            Click an action to fetch live information from your Node/Express backend.
          </p>
        </div>

        <div className="appHeaderMeta">
          <div className={`pill ${status}`}>
            <span className="pillDot" aria-hidden="true" />
            <span className="pillText">
              {status === "idle" && "Ready"}
              {status === "loading" && "Loading…"}
              {status === "success" && "Updated"}
              {status === "error" && "Error"}
            </span>
          </div>
        </div>
      </header>

      <main className="appMain">
        <section className="panel">
          <div className="panelHeader">
            <h2 className="panelTitle">Actions</h2>
            <p className="panelHint">Pick one to query the server.</p>
          </div>

          <div className="grid">
            {actions.map((a) => (
              <button
                key={a.id}
                className={`actionCard ${active === a.id ? "active" : ""}`}
                onClick={() => fetchData(a.id)}
                disabled={status === "loading"}
                type="button"
              >
                <div className="actionTitle">{a.title}</div>
                <div className="actionDesc">{a.description}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panelHeader panelHeaderRow">
            <div>
              <h2 className="panelTitle">Output</h2>
              <p className="panelHint">
                {active ? `Endpoint: /${active}` : "Run an action to see results."}
              </p>
            </div>

            <div className="panelActions">
              <button className="secondaryBtn" onClick={copyOutput} type="button" disabled={!output}>
                Copy
              </button>
            </div>
          </div>

          {status === "error" ? (
            <div className="callout error" role="alert">
              <div className="calloutTitle">Request failed</div>
              <div className="calloutBody">{error}</div>
            </div>
          ) : null}

          <pre className="output">
            <code>{output || "// Output will appear here"}</code>
          </pre>
        </section>
      </main>
    </div>
  );
}
