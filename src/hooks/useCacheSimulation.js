import { useState, useEffect } from 'react';

const INITIAL_SERVERS = Array.from({ length: 8 }, (_, i) => ({
  id: `Srv 0${i + 1}`,
  status: 'ONLINE',
  memoryUsed: Math.floor(Math.random() * 20) + 10, // 10-30%
  memoryCapacity: 1024,
  ping: Math.floor(Math.random() * 50) + 10,
  cachedKeys: [] // Array of { key: string, lastAccessed: number }
}));

const generateKey = () => `key_${Math.random().toString(36).substring(2, 7)}`;
const generateRequestId = () => `Req #${Math.floor(Math.random() * 1000)}`;

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

      // 2 & 3. Memory increase and LRU eviction
      setServers(prev => prev.map(server => {
        if (server.status === 'FAILED') return server;
        
        // Randomly pick this server to increase? The prompt says "Randomly pick an ONLINE server", 
        // to simplify in state update we'll just pick one.
        return server; 
      }));

      // Let's do the random server pick separately to ensure only one is picked, or randomly increase all slightly.
      // "Randomly pick an ONLINE server and increase its memoryUsed by 2-5%."
      setServers(prev => {
        const onlineServers = prev.filter(s => s.status === 'ONLINE');
        if (onlineServers.length === 0) return prev;

        const targetServerIndex = Math.floor(Math.random() * onlineServers.length);
        const targetServerId = onlineServers[targetServerIndex].id;

        return prev.map(server => {
          if (server.id === targetServerId) {
            let newMemory = server.memoryUsed + (Math.random() * 3 + 2); // 2-5%
            let newKeys = [...server.cachedKeys];
            
            // "If any server's memoryUsed exceeds 95%, automatically trigger the 'Old Data Remover (LRU)' function 
            // to evict the oldest 3 keys... drop back to 70%"
            if (newMemory > 95) {
              // Sort by lastAccessed ascending
              newKeys.sort((a, b) => a.lastAccessed - b.lastAccessed);
              // Evict oldest 3
              const evicted = newKeys.slice(0, 3);
              newKeys = newKeys.slice(3);
              newMemory = 70;
              
              if (evicted.length > 0) {
                setEvictions(prev => [{
                  id: Math.random().toString(),
                  keys: evicted,
                  serverId: targetServerId,
                  timestamp: Date.now()
                }, ...prev].slice(0, 5)); // Keep last 5 evictions
              }
            }
            return { ...server, memoryUsed: newMemory, cachedKeys: newKeys };
          }
          return server;
        });
      });
      
      // Update pings randomly
      setServers(prev => prev.map(server => {
        if (server.status === 'FAILED') return { ...server, ping: 0 };
        return { ...server, ping: Math.max(5, server.ping + (Math.floor(Math.random() * 11) - 5)) };
      }));

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
    evictions
  };
}
