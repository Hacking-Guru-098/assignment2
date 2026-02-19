import { useState } from "react";

export default function App() {
  const [output, setOutput] = useState("");

  const fetchData = async (endpoint) => {
    const res = await fetch(`http://localhost:5000/${endpoint}`);
    const data = await res.json();
    setOutput(JSON.stringify(data.data, null, 2));
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h2>Work with OS</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => fetchData("free-mem")}>
          Free Memory
        </button>

        <button onClick={() => fetchData("total-mem")} style={{ marginLeft: 10 }}>
          Total Memory
        </button>

        <button onClick={() => fetchData("cpu-arch")} style={{ marginLeft: 10 }}>
          CPU Arch
        </button>

        <button onClick={() => fetchData("user-info")} style={{ marginLeft: 10 }}>
          User Info
        </button>
      </div>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: "20px",
          minHeight: "200px",
        }}
      >
        {output}
      </pre>
    </div>
  );
}
