import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCacheSimulation } from './hooks/useCacheSimulation';
import Navbar from './components/Navbar';
import KPIRow from './components/KPIRow';
import NetworkMapHub from './components/NetworkMapHub';
import ChartsSection from './components/ChartsSection';
import ActivityFeed from './components/ActivityFeed';
import WriteHistoryUndo from './components/WriteHistoryUndo';
import ReadRequestQueue from './components/ReadRequestQueue';
import OldDataRemover from './components/OldDataRemover';
import ServerStatusChecker from './components/ServerStatusChecker';
import CompressionSorter from './components/CompressionSorter';

function App() {
  const {
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
  } = useCacheSimulation();

  const [theme, setTheme] = useState('dark');

  // Initialize and persist theme class on the document element
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
  }, []);

  // Framer Motion entry animations
  const pageVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen bg-dashboard-bg text-dashboard-text-primary transition-colors duration-300 font-sans pb-12">
      {/* Top Professional Navigation */}
      <Navbar theme={theme} setTheme={setTheme} />

      {/* Main Core Dashboard Grid */}
      <motion.main
        variants={pageVariants}
        initial="hidden"
        animate="show"
        className="max-w-[1600px] mx-auto px-6 md:px-8 pt-8 flex flex-col gap-6 fade-in"
      >
        {/* Title Block */}
        <motion.div 
          variants={sectionVariants}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dashboard-border/50 pb-5"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-dashboard-text-primary">
              Cluster Control Center
            </h2>
            <p className="text-sm text-dashboard-text-secondary">
              Distributed memory mesh simulation & performance analyzer
            </p>
          </div>
        </motion.div>

        {/* Row 1: Executive KPI Cards */}
        <motion.div variants={sectionVariants}>
          <KPIRow servers={servers} cumulativeStats={cumulativeStats} />
        </motion.div>

        {/* Row 2: Hero Visual Network map & real-time Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={sectionVariants} className="col-span-1 lg:col-span-2">
            <NetworkMapHub 
              servers={servers} 
              activeNodeId={activeNodeId} 
              setActiveNodeId={setActiveNodeId}
              addMockData={addMockData}
            />
          </motion.div>
          
          <motion.div variants={sectionVariants} className="col-span-1">
            <ActivityFeed 
              writeStack={writeStack} 
              evictions={evictions} 
            />
          </motion.div>
        </div>

        {/* Row 3: Observability performance charts */}
        <motion.div variants={sectionVariants} className="w-full">
          <ChartsSection history={history} theme={theme} />
        </motion.div>

        {/* Row 4: Client Playground controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={sectionVariants}>
            <WriteHistoryUndo 
              writeStack={writeStack} 
              writeData={writeData} 
              undoWrite={undoWrite} 
            />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <ReadRequestQueue 
              readQueue={readQueue} 
              injectReadRequest={injectReadRequest} 
            />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <OldDataRemover evictions={evictions} />
          </motion.div>
        </div>

        {/* Row 5: Detailed Data Registries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={sectionVariants} className="col-span-1 lg:col-span-2">
            <ServerStatusChecker 
              servers={servers} 
              toggleServerStatus={toggleServerStatus} 
            />
          </motion.div>

          <motion.div variants={sectionVariants} className="col-span-1">
            <CompressionSorter 
              segments={compressionSegments}
              sortOrder={sortOrder}
              sortCompression={sortCompression}
            />
          </motion.div>
        </div>

      </motion.main>
    </div>
  );
}

export default App;
