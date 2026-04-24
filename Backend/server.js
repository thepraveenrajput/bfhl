const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/bfhl", (req, res) => {
 
  const data = Array.isArray(req.body?.data) ? req.body.data : [];

  let invalid_entries = [];
  let duplicate_edges = [];
  let validEdges = [];

  const seen = new Set();

  //  VALIDATION + DUPLICATES
  for (let item of data) {
    item = item.trim();

    if (!/^[A-Z]->[A-Z]$/.test(item) || item[0] === item[3]) {
      invalid_entries.push(item);
      continue;
    }

    if (seen.has(item)) {
      if (!duplicate_edges.includes(item)) {
        duplicate_edges.push(item);
      }
    } else {
      seen.add(item);
      validEdges.push(item);
    }
  }

  // BUILD GRAPH (with multi-parent fix)
  const graph = {};
  const childSet = new Set();
  const nodes = new Set();

  validEdges.forEach((edge) => {
    const [p, c] = edge.split("->");

    nodes.add(p);
    nodes.add(c);

    if (!graph[p]) graph[p] = [];

    //  multi-parent fix (only first parent allowed)
    if (!childSet.has(c)) {
      graph[p].push(c);
      childSet.add(c);
    }
  });

  //  CYCLE DETECTION (DFS)
  function hasCycle(node, visited, stack) {
    if (!visited[node]) {
      visited[node] = true;
      stack[node] = true;

      for (let nei of graph[node] || []) {
        if (!visited[nei] && hasCycle(nei, visited, stack)) return true;
        if (stack[nei]) return true;
      }
    }
    stack[node] = false;
    return false;
  }

  //  BUILD TREE
  function buildTree(node) {
    let obj = {};
    for (let child of graph[node] || []) {
      obj[child] = buildTree(child);
    }
    return obj;
  }

  //  DEPTH
  function getDepth(node) {
    if (!graph[node] || graph[node].length === 0) return 1;
    return 1 + Math.max(...graph[node].map(getDepth));
  }

  let hierarchies = [];
  let total_trees = 0;
  let total_cycles = 0;
  let maxDepth = 0;
  let largest_tree_root = "";

  const visitedGlobal = new Set();



//  Find real roots (nodes that are not children)
let roots = [...nodes].filter((n) => !childSet.has(n));

// Process ROOTS first
for (let node of roots) {
  if (visitedGlobal.has(node)) continue;

  let visited = {};
  let stack = {};

  const isCycle = hasCycle(node, visited, stack);
  Object.keys(visited).forEach((n) => visitedGlobal.add(n));

  if (isCycle) {
    total_cycles++;
    hierarchies.push({
      root: node,
      tree: {},
      has_cycle: true,
    });
  } else {
    let tree = {};
    tree[node] = buildTree(node);

    let depth = getDepth(node);
    total_trees++;

    if (depth > maxDepth || (depth === maxDepth && node < largest_tree_root)) {
      maxDepth = depth;
      largest_tree_root = node;
    }

    hierarchies.push({
      root: node,
      tree,
      depth,
    });
  }
}

//  Then process remaining nodes (cycles / disconnected)
for (let node of nodes) {
  if (visitedGlobal.has(node)) continue;

  let visited = {};
  let stack = {};

  const isCycle = hasCycle(node, visited, stack);
  Object.keys(visited).forEach((n) => visitedGlobal.add(n));

  total_cycles++;

  hierarchies.push({
    root: node,
    tree: {},
    has_cycle: true,
  });
}

  res.json({
    user_id: "praveensingh_23082004",
    email_id: "ps9395@srmist.edu.in",
    college_roll_number: "RA2311003010944",
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root,
    },
  });
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);