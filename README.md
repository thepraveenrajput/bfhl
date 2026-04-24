# 🌳 BFHL Hierarchy Visualizer

A full-stack web application that processes hierarchical relationships and visualizes them as tree structures. Built as part of the Bajaj Finserv Health (BFHL) assessment.

---

* Deployment (Render + Vercel)
* UI improvements (optional)

---

## ✨ Features

* 📥 Input format: `A->B, A->C, B->D`
* 🌲 Tree hierarchy visualization
* 🔁 Cycle detection
* ⚠️ Invalid input detection
* ♻️ Duplicate edge detection
* 📊 Summary metrics:

  * Total Trees
  * Total Cycles
  * Largest Root

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* JavaScript
* Custom UI (CSS)

### Backend

* Node.js
* Express.js
* CORS

---

## 📂 Project Structure

```
bfhl/
├── Backend/
│   ├── server.js
│   ├── package.json
│
├── Frontend/
│   ├── frontend/
│   │   ├── src/
│   │   ├── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/thepraveenrajput/bfhl.git
cd bfhl
```

---

### 2️⃣ Run Backend

```
cd Backend
npm install
npm run dev   # or node server.js
```

Server runs at:

```
http://localhost:3000
```

---

### 3️⃣ Run Frontend

```
cd Frontend/frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🔗 API Endpoint

### POST `/bfhl`

**Base URL:**

```
http://localhost:3000
```

---

### 📥 Request

```
{
  "data": ["A->B", "A->C", "B->D"]
}
```

---

### 📤 Response

```
{
  "hierarchies": [...],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

---

## 🧪 Example Input

```
A->B, A->C, B->D, C->E, E->F, X->Y, Y->Z, Z->X
```

---

## 🎯 Key Logic

* Graph construction using adjacency list
* DFS for cycle detection
* Recursive tree building
* Depth calculation using max path



---
## 👤 Author

**Praveen Singh**


---

## ⭐ Notes

* Only uppercase nodes (A–Z) allowed
* Self-loops (A->A) are invalid
* Only one parent per node

---



---

⭐ If you like this project, give it a star!
