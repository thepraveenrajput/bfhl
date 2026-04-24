import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");

    try {
      const data = input.split(",").map(i => i.trim());

      const res = await fetch("https://bfhl-backend-bqt2.onrender.com/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data })
      });

      const result = await res.json();
      setOutput(result);
    } catch (err) {
      setError("⚠️ Backend not reachable");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h1 style={styles.title}>🌳 BFHL Visualizer</h1>

        <textarea
          value={input}
          placeholder="Enter nodes: A->B, A->C, B->D"
          rows="1"
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          style={styles.textarea}
        />

        <button onClick={handleSubmit} style={styles.button}>
          {loading ? "Processing..." : "Analyze"}
        </button>

        {error && <p style={styles.error}>{error}</p>}

        {output && (
          <div style={styles.output}>

            {/* SUMMARY */}
            <div style={styles.summary}>
              <Card title="Trees" value={output.summary.total_trees} />
              <Card title="Cycles" value={output.summary.total_cycles} />
              <Card title="Largest Root" value={output.summary.largest_tree_root} />
            </div>

            {/* HIERARCHIES */}
            <h3 style={styles.sectionTitle}>Hierarchies</h3>

            {output.hierarchies.map((h, i) => (
              <div key={i} style={styles.box}>
                <p><b>Root:</b> {h.root}</p>

                {h.has_cycle ? (
                  <p style={{ color: "red" }}>⚠ Cycle detected</p>
                ) : (
                  <>
                    <p>Depth: {h.depth}</p>

                    <Tree
                      node={h.root}
                      childrenMap={buildChildrenMap(h.tree)}
                    />
                  </>
                )}
              </div>
            ))}

            {/* INVALID */}
            {output.invalid_entries.length > 0 && (
              <>
                <h4 style={styles.sectionTitle}>Invalid Entries</h4>
                <p style={{ color: "red" }}>
                  {output.invalid_entries.join(", ")}
                </p>
              </>
            )}

            {/* DUPLICATES */}
            {output.duplicate_edges.length > 0 && (
              <>
                <h4 style={styles.sectionTitle}>Duplicate Edges</h4>
                <p style={{ color: "orange" }}>
                  {output.duplicate_edges.join(", ")}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/*  CARD */
function Card({ title, value }) {
  return (
    <div style={styles.cardItem}>
      <p style={styles.cardTitle}>{title}</p>
      <h2 style={styles.cardValue}>{value}</h2>
    </div>
  );
}
function Tree({ node, childrenMap }) {
  return (
    <ul style={{ paddingLeft: "20px", margin: 0 }}>
      <li style={{ margin: "4px 0" }}>
        <span style={{ fontWeight: "600" }}>{node}</span>

        {childrenMap[node] && childrenMap[node].length > 0 && (
          <ul style={{ paddingLeft: "20px" }}>
            {childrenMap[node].map((child) => (
              <Tree
                key={child}
                node={child}
                childrenMap={childrenMap}
              />
            ))}
          </ul>
        )}
      </li>
    </ul>
  );
}

/*  BUILD MAP FROM TREE */
function buildChildrenMap(tree) {
  const map = {};

  function dfs(node, obj) {
    if (!map[node]) map[node] = [];

    for (let child in obj) {
      map[node].push(child);
      dfs(child, obj[child]);
    }
  }

  const root = Object.keys(tree)[0];
  dfs(root, tree[root]);

  return map;
}

/*  STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif"
  },
  
  card: {
    width: "100%",
    maxWidth: "800px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    color: "#000",
    textAlign: "left"   
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "26px",
    fontWeight: "700",
    color: "#000"
  },

  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    resize: "none",
    fontSize: "14px",
    minHeight: "50px",
    marginBottom: "15px",
    background: "#fff",
    color: "#000"
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px"
  },

  error: {
    color: "red",
    marginTop: "10px"
  },

  output: {
    marginTop: "25px"
  },

  summary: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },

  cardItem: {
    flex: 1,
    background: "#ffffff",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    border: "1px solid #ddd"
  },

  cardTitle: {
    fontSize: "13px",
    color: "#555"
  },

  cardValue: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    color: "#000"
  },

  sectionTitle: {
    marginTop: "15px",
    color: "#000"
  },

  box: {
    padding: "15px",
    marginTop: "10px",
    borderRadius: "10px",
    background: "#f9f9f9",
    border: "1px solid #ddd"
  }
};

export default App;
