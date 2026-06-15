import { useCacheSimulation } from './hooks/useCacheSimulation';
import DataLocationMap from './components/DataLocationMap';
import WriteHistoryUndo from './components/WriteHistoryUndo';
import ReadRequestQueue from './components/ReadRequestQueue';
import ServerStatusChecker from './components/ServerStatusChecker';
import CompressionSorter from './components/CompressionSorter';
import NetworkMapHub from './components/NetworkMapHub';
import OldDataRemover from './components/OldDataRemover';
import { DatabaseZap } from 'lucide-react';

function App() {
  const {
    servers,
    readQueue,
    writeStack,
    sortOrder,
    activeNodeId,
    setActiveNodeId,
    compressionSegments
    addMockData,
    writeData,
    undoWrite,
    injectReadRequest,
    toggleServerStatus,
    sortCompression,
    evictions
  } = useCacheSimulation();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 flex flex-col max-w-[1600px] mx-auto">
      <header className="mb-6 flex items-center justify-between border-b border-dashboard-border pb-4">
        <div className="flex items-center gap-3">
          <DatabaseZap className="w-8 h-8 text-dashboard-accent" />
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            MeshCache <span className="font-light text-slate-400">Slate</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full border border-green-500/20 text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          System Check: Stable
        </div>
      </header>

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-200">Live Mesh Overview - Cluster</h2>
        <p className="text-sm text-slate-400">High-speed distributed memory dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr flex-1">
        {/* Top Left: Map */}
        <div className="col-span-1 md:col-span-2 row-span-2">
          <DataLocationMap 
            servers={servers} 
            activeNodeId={activeNodeId} 
            setActiveNodeId={setActiveNodeId}
            addMockData={addMockData}
          />
        </div>

        {/* Top Right Col 1: History & Queue */}
        <div className="col-span-1 row-span-1 h-[280px]">
          <WriteHistoryUndo 
            writeStack={writeStack} 
            writeData={writeData} 
            undoWrite={undoWrite} 
          />
        </div>

        {/* Network Map Hub */}
        <div className="col-span-1 row-span-2">
          <NetworkMapHub servers={servers} />
        </div>

        {/* Request Queue */}
        <div className="col-span-1 row-span-1 h-[180px]">
          <ReadRequestQueue 
            readQueue={readQueue} 
            injectReadRequest={injectReadRequest} 
          />
        </div>

        {/* Bottom Left: Server Status */}
        <div className="col-span-1 md:col-span-2 row-span-1">
          <ServerStatusChecker 
            servers={servers} 
            toggleServerStatus={toggleServerStatus} 
          />
        </div>

        {/* Bottom Middle: Compression */}
        <div className="col-span-1 row-span-1 h-full">
          <CompressionSorter 
            segments={compressionSegments}
            sortOrder={sortOrder}
            sortCompression={sortCompression}
          />
        </div>

        {/* Bottom Right: Old Data Remover */}
        <div className="col-span-1 row-span-1 h-full">
          <OldDataRemover evictions={evictions} />
        </div>
      </div>
    </div>
  );
}

export default App;
