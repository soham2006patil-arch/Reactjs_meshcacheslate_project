# MeshCache Slate – Distributed Cache Management Dashboard

##  Project Title

**MeshCache Slate: Distributed Cache Management Dashboard Using React and Data Structures & Algorithms**

---

##  Problem Statement

Distributed systems rely on cache servers to improve application performance and reduce database load. As the number of cache servers increases, managing data placement, request handling, server monitoring, memory optimization, and cache eviction becomes increasingly complex.

The objective of MeshCache Slate is to simulate a distributed caching environment and provide real-time visualization of cache operations while demonstrating the practical application of Data Structures and Algorithms such as Stack, Queue, Sorting, Graphs, and LRU Cache Management.

---

##  Objectives

* Simulate a distributed cache cluster.
* Visualize server-data relationships.
* Track write operations and provide undo functionality.
* Process read requests in FIFO order.
* Monitor server health and memory utilization.
* Sort memory segments by compression efficiency.
* Visualize network topology and routing paths.
* Implement LRU cache eviction.
* Demonstrate real-world applications of Data Structures and Algorithms.

---

##  System Overview / Architecture

The MeshCache Slate system consists of the following modules:

Data Location Map

↓

Write History

↓

Request Queue

↓

Server Status Checker

↓

Compression Sorter

↓

Network Map Hub

↓

Old Data Remover (LRU)

### Workflow

1. User selects a cache server.
2. Data is written into the selected cache node.
3. Write operations are stored in history.
4. Read requests enter the FIFO queue.
5. Server status and memory load are monitored.
6. Compression segments are sorted.
7. Network routes are visualized.
8. Old cache entries are removed using LRU policy.

---

##  Data Structures and Algorithms Used

### 1. Stack

**Purpose:** Maintain write history and support Undo functionality.

**Application:** Write History module.

**Complexity:**

* Push → O(1)
* Pop → O(1)

---

### 2. Queue

**Purpose:** Process read requests in arrival order.

**Application:** Request Queue module.

**Complexity:**

* Enqueue → O(1)
* Dequeue → O(1)

---

### 3. Array

**Purpose:** Store servers, cache keys, memory segments, and request data.

**Application:** Data Location Map and Server Management.

**Complexity:**

* Access → O(1)
* Traversal → O(n)

---

### 4. Sorting

**Purpose:** Sort memory sections based on compression ratio.

**Application:** Compression Sorter.

**Complexity:**

* O(n log n)

---

### 5. Graph

**Purpose:** Represent server network topology.

**Application:** Network Map Hub.

**Components:**

* Node → Server
* Edge → Connection

---

### 6. LRU (Least Recently Used)

**Purpose:** Remove old cache entries when memory exceeds limits.

**Application:** Old Data Remover.

**Complexity:**

* O(1) (Optimized implementation)

---

##  Implementation Approach

### Frontend

* React JS
* Vite

### Styling

* Tailwind CSS

### State Management

* useState
* useEffect
* Custom Hook (`useCacheSimulation`)

### Libraries Used

* Lucide React (Icons)
* React Flow (Graph Visualization)
* Recharts (Charts)

### Core Components

1. DataLocationMap
2. WriteHistory
3. RequestQueue
4. ServerStatusList
5. CompressionSorter
6. NetworkMapHub
7. OldDataRemover

---

## Time and Space Complexity Analysis

| Module             | DSA Used | Time Complexity | Space Complexity |
| ------------------ | -------- | --------------- | ---------------- |
| Write History      | Stack    | O(1)            | O(n)             |
| Request Queue      | Queue    | O(1)            | O(n)             |
| Server Data        | Array    | O(n)            | O(n)             |
| Compression Sorter | Sorting  | O(n log n)      | O(n)             |
| Network Map        | Graph    | O(V + E)        | O(V + E)         |
| LRU Eviction       | Cache    | O(1)            | O(n)             |

---

## Execution Steps

### Step 1

Clone the repository:

```bash
git clone https://github.com/your-repository-link
```

### Step 2

Navigate to project directory:

```bash
cd meshcache-slate
```

### Step 3

Install dependencies:

```bash
npm install
```

### Step 4

Run the application:

```bash
npm run dev
```

### Step 5

Open browser:

```text
http://localhost:5173
```

---

##  Sample Inputs and Outputs

### Input 1

Select Server 02

Click:

```text
Add Mock Data
```

### Output

```text
Srv 02 Cache

key_pt3um
```

---

### Input 2

Click:

```text
Inject Request
```

### Output

```text
Req #449
Req #570
Req #212
```

---

### Input 3

Click:

```text
Undo
```

### Output

```text
Latest write operation removed.
```

---

##  Screenshots

### Dashboard Overview

<img width="1037" height="771" alt="image" src="https://github.com/user-attachments/assets/2d2bab75-5865-405b-b7ae-61290b7c5df9" />


---

##  Results and Observations

### Results

* Successfully simulated distributed cache management.
* Implemented Stack-based write history tracking.
* Implemented Queue-based request processing.
* Visualized server-data relationships.
* Simulated graph-based network topology.
* Implemented memory compression sorting.
* Demonstrated LRU cache eviction.
* Provided real-time server monitoring.

### Observations

* Stack is effective for Undo operations.
* Queue ensures fair request processing.
* Graph structures naturally model server networks.
* LRU efficiently manages memory resources.
* React state management enables real-time UI updates.

---

##  Conclusion

MeshCache Slate successfully demonstrates the practical implementation of Data Structures and Algorithms in a distributed cache management environment. The project integrates Stack, Queue, Arrays, Sorting, Graphs, and LRU caching concepts with React-based state management to create an interactive and educational dashboard.

The system effectively visualizes cache operations, request processing, server monitoring, memory optimization, and network relationships, making it a strong demonstration of DSA concepts applied to modern distributed systems.
