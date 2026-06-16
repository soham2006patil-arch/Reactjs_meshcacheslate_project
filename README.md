# School of Future Tech

# Case Study Report

## on

# MeshCache Slate – Distributed Cache Management Dashboard

### by

SOHAM PATIL

---

# INDEX

1. Introduction to the Case Study
2. Problem Statement / Case Background (Abstract)
3. Case Study Design
4. Methods & Algorithms Technology Applied
5. Implementation Details and Snapshots
6. Results and Conclusion
7. References

---

# 1. Introduction to the Case Study

Modern distributed applications depend heavily on caching systems to improve performance, reduce database load, and provide faster response times. In large-scale systems, multiple cache servers work together to store and retrieve data efficiently.

Managing cache servers involves monitoring server health, tracking write operations, processing read requests, balancing memory usage, removing stale data, and visualizing network relationships. Manual monitoring becomes difficult as the number of servers increases.

This case study presents MeshCache Slate, a distributed cache management dashboard developed using React JS. The system simulates real-world cache server operations and demonstrates the practical application of Data Structures and Algorithms through an interactive visualization platform.

---

# 2. Problem Statement / Case Background (Abstract)

## Background

Distributed cache systems require efficient management of memory, request handling, data placement, server monitoring, and cache eviction. Traditional monitoring approaches often lack visualization and real-time operational insights.

## Abstract

MeshCache Slate is a React-based cache management dashboard that integrates multiple DSA concepts to simulate modern distributed caching systems.

The system provides:

• Data Location Mapping for cache visualization.

• Write History Tracking using Stack.

• Read Request Processing using Queue.

• Server Health Monitoring.

• Compression-Based Memory Sorting.

• Network Topology Visualization using Graph concepts.

• Cache Eviction using LRU (Least Recently Used).

• Real-time Dashboard Updates using React State Management.

The project demonstrates how fundamental DSA concepts can be applied to solve practical problems in distributed computing environments.

---

# 3. Case Study Design

The MeshCache Slate system consists of the following modules:

Server Cluster

↓

Data Location Map

↓

Write History Manager

↓

Read Request Queue

↓

Server Status Checker

↓

Compression Sorter

↓

Network Map Hub

↓

Old Data Remover (LRU)

## Workflow

1. Cache servers are initialized.
2. Mock data is written into cache nodes.
3. Write operations are recorded in history.
4. Read requests enter the processing queue.
5. Server status is continuously monitored.
6. Compression statistics are sorted.
7. Network relationships are visualized.
8. Old cache entries are removed using LRU.

---

# 4. Methods & Algorithms Technology Applied

## Data Structures Used

### 1. Stack

Purpose:

Track write operations and support Undo functionality.

Reason:

Undo follows Last In First Out (LIFO).

Example:

Write Key A

Write Key B

Write Key C

Undo removes Key C first.

Complexity:

Push = O(1)

Pop = O(1)

---

### 2. Queue

Purpose:

Manage incoming read requests.

Reason:

Requests should be processed in arrival order.

Example:

Request A

Request B

Request C

Processing Order:

A → B → C

Complexity:

Enqueue = O(1)

Dequeue = O(1)

---

### 3. Array

Purpose:

Store server information and cache data.

Reason:

Provides efficient traversal and rendering.

Complexity:

Access = O(1)

Traversal = O(n)

---

### 4. Sorting

Purpose:

Sort memory sections according to compression ratio.

Example:

80%

50%

30%

Sorted Output:

80%

50%

30%

Complexity:

O(n log n)

---

### 5. Graph

Purpose:

Represent relationships between cache servers.

Node = Cache Server

Edge = Network Connection

Example:

Server 1 ---- Server 2

|

Server 3

Reason:

Graph structures naturally model distributed systems.

---

### 6. LRU (Least Recently Used)

Purpose:

Remove outdated cache entries.

Reason:

Old unused data consumes memory.

Example:

Cache Full

↓

Remove Least Recently Accessed Entry

Complexity:

O(1) with optimized implementation.

---

## React Concepts Used

### useState

Used to manage:

• Servers

• Queue

• Write History

• Compression Data

• Active Nodes

### useEffect

Used for:

• Periodic updates

• Server monitoring

• Simulation cycles

### Custom Hook

useCacheSimulation()

Purpose:

Centralized business logic and state management.

---

## Technology Stack

Frontend:

React JS

Build Tool:

Vite

Styling:

Tailwind CSS

Icons:

Lucide React

Graph Visualization:

React Flow

Charts:

Recharts

Language:

JavaScript

---

# 5. Implementation Details and Snapshots

## Core Modules

### 1. Data Location Map

Displays cache entries stored inside each server.

### 2. Write History

Tracks cache write operations.

Supports Undo using Stack.

### 3. Request Queue

Processes read requests using FIFO Queue.

### 4. Server Status List

Displays ONLINE and FAILED server states.

### 5. Compression Sorter

Sorts memory sections according to compression efficiency.

### 6. Network Map Hub

Visualizes server relationships using Graph concepts.

### 7. Old Data Remover

Implements LRU eviction strategy.

### 8. Cache Simulation Engine

Implemented through useCacheSimulation custom hook.

(Add project screenshots here)

---

# 6. Results and Conclusion

## Results

• Successfully simulated distributed cache servers.

• Implemented Write History using Stack.

• Implemented Request Queue using Queue.

• Visualized server-data relationships.

• Monitored server health dynamically.

• Sorted memory sections efficiently.

• Simulated LRU cache eviction.

• Demonstrated graph-based network topology.

## Conclusion

MeshCache Slate successfully demonstrates the practical implementation of Data Structures and Algorithms in distributed cache management systems. By combining Stack, Queue, Arrays, Sorting, Graphs, and LRU caching with modern React development practices, the project provides an interactive simulation of real-world cache infrastructure.

The dashboard improves understanding of distributed systems while showcasing efficient data organization, request handling, memory management, and network visualization techniques.

---

# 7. References

1. React JS Documentation

2. Vite Documentation

3. Tailwind CSS Documentation

4. Lucide React Documentation

5. React Flow Documentation

6. Recharts Documentation

7. Data Structures and Algorithms Concepts

8. Distributed Caching System Fundamentals

9. Cache Eviction Policies (LRU)

10. Graph Theory Fundamentals

