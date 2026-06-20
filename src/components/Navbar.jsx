import { useEffect, useState } from 'react';
import { DatabaseZap, Bell, Sun, Moon, Clock } from 'lucide-react';

export default function Navbar({ theme, setTheme }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dashboard-border bg-dashboard-bg/85 backdrop-blur-md transition-colors duration-300">
      <div className="flex h-16 items-center justify-between px-6 md:px-8 max-w-[1600px] mx-auto">
        {/* Left Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <DatabaseZap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-dashboard-text-primary">
              MeshCache <span className="font-light text-dashboard-text-secondary">Slate</span>
            </h1>
          </div>
        </div>

        {/* Center: System Status */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-full border border-emerald-500/20 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Cluster: ACTIVE
          </div>

          <div className="flex items-center gap-1.5 text-xs text-dashboard-text-secondary font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>UTC: {formattedTime}</span>
          </div>
        </div>

        {/* Right Side Icons & Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-dashboard-text-secondary hover:text-dashboard-text-primary hover:bg-dashboard-card rounded-lg border border-dashboard-border transition-all duration-200"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-dashboard-text-secondary hover:text-dashboard-text-primary hover:bg-dashboard-card rounded-lg border border-dashboard-border transition-all duration-200">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-dashboard-bg" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-dashboard-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 p-[1.5px] shadow-sm">
              <div className="w-full h-full rounded-full bg-dashboard-card flex items-center justify-center text-xs font-bold text-dashboard-text-primary">
                OP
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
