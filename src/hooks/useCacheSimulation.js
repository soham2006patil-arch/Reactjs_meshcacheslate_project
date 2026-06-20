import { useState, useEffect } from 'react';

const INITIAL_SERVERS = Array.from({ length: 8 }, (_, i) => ({
  id: `Srv 0${i + 1}`,
  status: 'ONLINE',
  memoryUsed: Math.floor(Math.random() * 20) + 15, // 15-35%
  memoryCapacity: 1024,
  ping: Math.floor(Math.random() * 50) + 10,
  cachedKeys: [] // Array of { key: string, lastAccessed: number }
}));

const generateKey = () => `key_${Math.random().toString(36).substring(2, 7)}`;
const generateRequestId = () => `Req #${Math.floor(Math.random() * 1000)}`;

const generateInitialHistory = () => {
  const data = [];
  const now = Date.now();
  for (let i = 14; i >= 0; i--) {
    const timeStr = new Date(now - i * 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    data.push({
      time: timeStr,
      memory: Math.floor(Math.random() * 10) + 22, // 22-32%
      throughput: Math.floor(Math.random() * 30) + 95, // 95-125
      hits: Math.floor(Math.random() * 20) + 88,
      misses: Math.floor(Math.random() * 4) + 2
    });
  }
  return data;
};

export function useCacheSimulation() {
  const [servers, setServers] = useState(INITIAL_SERVERS);
  const [readQueue, setReadQueue] = useState([generateRequestId(), generateRequestId(), generateRequestId()]);
  const [writeStack, setWriteStack] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [evictions, setEvictions] = useState([]);
  
  // Feature E data (Compression)
  const [compressionSegments, setCompressionSegments] = useState([
    { id: 'M1', name: 'Memory Segment 1', ratio: 92 },
    { id: 'M2', name: 'Memory Segment 2', ratio: 65 },
    { id: 'M3', name: 'Memory Segment 3', ratio: 84 },
  ]);

  const [history, setHistory] = useState(() => generateInitialHistory());
  const [cumulativeStats, setCumulativeStats] = useState({
    totalRequests: 18450,
    cacheHits: 17390,
    cacheMisses: 1060
  });

  // Simulation Tick
  useEffect(() => {
    const tick = setInterval(() => {
      // 1. Shift read queue
      setReadQueue(prev => {
        const next = [...prev];
        if (next.length > 0) next.shift(); // remove from head
        next.push(generateRequestId()); // add to tail
        return next;
      });

      // 2 & 3. Memory increase, pings, and LRU eviction
      let avgMemory = 25;
      setServers(prev => {
        const onlineServers = prev.filter(s => s.status === 'ONLINE');
        if (onlineServers.length === 0) return prev;

        const targetServerIndex = Math.floor(Math.random() * onlineServers.length);
        const targetServerId = onlineServers[targetServerIndex].id;

        const updated = prev.map(server => {
          let currentMem = server.memoryUsed;
          let currentKeys = [...server.cachedKeys];
          
          if (server.id === targetServerId) {
            currentMem = server.memoryUsed + (Math.random() * 3 + 2); // 2-5%
            
            if (currentMem > 95) {
              currentKeys.sort((a, b) => a.lastAccessed - b.lastAccessed);
              const evicted = currentKeys.slice(0, 3);
              currentKeys = currentKeys.slice(3);
              currentMem = 70;
              
              if (evicted.length > 0) {
                setEvictions(prevEv => [{
                  id: Math.random().toString(),
                  keys: evicted,
                  serverId: targetServerId,
                  timestamp: Date.now()
                }, ...prevEv].slice(0, 5));
              }
            }
          }

          let newPing;
          if (server.status === 'FAILED') {
            newPing = 0;
            currentMem = 0;
          } else {
            newPing = Math.max(5, server.ping + (Math.floor(Math.random() * 11) - 5));
          }

          return { ...server, memoryUsed: currentMem, cachedKeys: currentKeys, ping: newPing };
        });

        const activeServers = updated.filter(s => s.status === 'ONLINE');
        avgMemory = activeServers.length 
          ? activeServers.reduce((sum, s) => sum + s.memoryUsed, 0) / activeServers.length 
          : 0;

        return updated;
      });

      // Update history and cumulative stats
      const hitsInc = Math.floor(Math.random() * 20) + 85;
      const missesInc = Math.floor(Math.random() * 4) + 1;
      const totalInc = hitsInc + missesInc;

      setCumulativeStats(prev => ({
        totalRequests: prev.totalRequests + totalInc,
        cacheHits: prev.cacheHits + hitsInc,
        cacheMisses: prev.cacheMisses + missesInc
      }));

      setHistory(prevHistory => {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newPoint = {
          time: timeStr,
          memory: Math.round(avgMemory || 25),
          throughput: totalInc,
          hits: hitsInc,
          misses: missesInc
        };
        const nextHistory = [...prevHistory];
        if (nextHistory.length >= 15) nextHistory.shift();
        nextHistory.push(newPoint);
        return nextHistory;
      });

    }, 2500);

    return () => clearInterval(tick);
  }, []);

  const addMockData = (serverId) => {
    const server = servers.find(s => s.id === serverId);
    if (!server || server.status !== 'ONLINE') return;

    const newKeyObj = { key: generateKey(), lastAccessed: Date.now() };
    const newMemory = Math.min(100, server.memoryUsed + 5);
    const memoryAdded = newMemory - server.memoryUsed;

    const writeId = `write-${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = Date.now();

    // 1. Update writeStack history
    setWriteStack(stack => {
      // Safeguard: Prevent identical history entry from being inserted twice within same operation
      if (stack.length > 0 && 
          stack[0].key === newKeyObj.key && 
          stack[0].serverId === server.id && 
          timestamp - stack[0].timestamp < 1000) {
        return stack;
      }
      return [{
        id: writeId,
        key: newKeyObj.key,
        serverId: server.id,
        timestamp,
        memoryAdded
      }, ...stack];
    });

    // 2. Update servers cache
    setServers(prev => prev.map(s => {
      if (s.id === serverId) {
        return { ...s, cachedKeys: [...s.cachedKeys, newKeyObj], memoryUsed: newMemory };
      }
      return s;
    }));
  };

  const writeData = (keyStr) => {
    const onlineServers = servers.filter(s => s.status === 'ONLINE');
    if (onlineServers.length === 0) return;

    const targetServer = onlineServers[Math.floor(Math.random() * onlineServers.length)];
    const newKeyObj = { key: keyStr, lastAccessed: Date.now() };
    const newMemory = Math.min(100, targetServer.memoryUsed + 5);
    const memoryAdded = newMemory - targetServer.memoryUsed;

    const writeId = `write-${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = Date.now();

    // 1. Update writeStack history
    setWriteStack(stack => {
      // Safeguard: Prevent identical history entry from being inserted twice within same operation
      if (stack.length > 0 && 
          stack[0].key === keyStr && 
          stack[0].serverId === targetServer.id && 
          timestamp - stack[0].timestamp < 1000) {
        return stack;
      }
      return [{
        id: writeId,
        key: keyStr,
        serverId: targetServer.id,
        timestamp,
        memoryAdded
      }, ...stack];
    });

    // 2. Update servers cache
    setServers(prev => prev.map(s => {
      if (s.id === targetServer.id) {
        return { ...s, cachedKeys: [...s.cachedKeys, newKeyObj], memoryUsed: newMemory };
      }
      return s;
    }));
  };

  const undoWrite = (actionId) => {
    const action = writeStack.find(a => a.id === actionId);
    if (!action) return;

    // 1. Remove from writeStack
    setWriteStack(stack => stack.filter(a => a.id !== actionId));

    // 2. Remove key from server and adjust memory
    setServers(prev => prev.map(s => {
      if (s.id === action.serverId) {
        return { 
          ...s, 
          cachedKeys: s.cachedKeys.filter(k => k.key !== action.key),
          memoryUsed: Math.max(0, s.memoryUsed - (action.memoryAdded || 5))
        };
      }
      return s;
    }));
  };

  const injectReadRequest = () => {
    setReadQueue(prev => [...prev, generateRequestId()]);
  };

  const toggleServerStatus = (serverId) => {
    setServers(prev => prev.map(s => {
      if (s.id === serverId) {
        return { 
          ...s, 
          status: s.status === 'ONLINE' ? 'FAILED' : 'ONLINE',
          memoryUsed: s.status === 'ONLINE' ? 0 : s.memoryUsed,
          cachedKeys: s.status === 'ONLINE' ? [] : s.cachedKeys,
          ping: s.status === 'ONLINE' ? 0 : 20
        };
      }
      return s;
    }));
  };

  const sortCompression = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setCompressionSegments(prev => {
      const sorted = [...prev].sort((a, b) => {
        return newOrder === 'asc' ? a.ratio - b.ratio : b.ratio - a.ratio;
      });
      return sorted;
    });
  };

  return {
    servers,
    readQueue,
    writeStack,
    sortOrder,
    activeNodeId,
    setActiveNodeId,
    compressionSegments,
    addMockData,
    writeData,
    undoWrite,
    injectReadRequest,
    toggleServerStatus,
    sortCompression,
    evictions,
    history,
    cumulativeStats
  };
}
