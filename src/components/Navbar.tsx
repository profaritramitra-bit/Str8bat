import React from 'react';
import { Activity, Shield, Flame, Award, HelpCircle } from 'lucide-react';
import { PlayerProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activePlayer: PlayerProfile;
  onToggleLevel: () => void;
}

export default function Navbar({ activeTab, setActiveTab, activePlayer, onToggleLevel }: NavbarProps) {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'batting', label: 'Batting Analytics (str8bat)', icon: Flame },
    { id: 'bowling', label: 'Bowling Analytics', icon: Shield },
    { id: 'simulator', label: 'Live Sensor Simulator', icon: Award },
    { id: 'comparison', label: 'Amateur vs Pro Benchmarks', icon: HelpCircle },
    { id: 'history', label: 'Career History', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#12141a]/95 backdrop-blur-md border-b border-[#2a2f3a] px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand Logo & Identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="text-2xl font-black tracking-tighter text-[#00ff88]">
              STR8BAT<span className="text-white">.</span>
            </div>
            <div className="hidden sm:block border-l border-[#2a2f3a] pl-3">
              <span className="text-[10px] font-mono font-semibold text-slate-400 block tracking-widest leading-none">IOT PERFORMANCE</span>
              <span className="text-[9px] text-[#00ff88] font-bold uppercase tracking-wider block mt-0.5">CORE STATUS: ONLINE</span>
            </div>
          </div>

          {/* Quick player toggle for smaller screens */}
          <button 
            onClick={onToggleLevel}
            className="md:hidden text-xs font-semibold bg-[#1e222b] text-[#00ff88] border border-[#2a2f3a] hover:bg-[#2a2f3a] px-3 py-1.5 rounded-lg transition-all duration-200"
          >
            {activePlayer.level} Profile
          </button>
        </div>

        {/* Navigation Tabs (Working, Clickable Links) */}
        <nav className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-[#0a0c10] border-[#00ff88]/30 text-[#00ff88] shadow-sm shadow-[#00ff88]/5'
                    : 'text-slate-400 hover:bg-[#1e222b] hover:text-slate-200 border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00ff88]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card & Level Toggle */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-[#0a0c10] border border-[#2a2f3a] p-1.5 pr-4 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#1e222b] border border-[#00ff88] flex items-center justify-center font-bold text-xs text-[#00ff88]">
              {activePlayer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-1.5">
                <span className="font-sans font-semibold text-slate-100 text-xs">{activePlayer.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20`}>
                  {activePlayer.level === 'Professional' ? 'Pro' : 'Amateur'}
                </span>
              </div>
              <p className="font-mono text-[10px] text-slate-400">{activePlayer.role} • {activePlayer.battingStyle}</p>
            </div>
          </div>

          <button
            onClick={onToggleLevel}
            className={`cursor-pointer font-sans text-xs font-bold px-4 py-2.5 rounded-xl border transition-all duration-300 shadow-md hover:scale-[1.02] ${
              activePlayer.level === 'Professional'
                ? 'bg-[#00ff88] text-black border-[#00ff88] hover:bg-[#00e577] hover:shadow-[0_0_15px_rgba(0,255,136,0.25)]'
                : 'bg-[#1e222b] text-[#e0e0e0] border-[#2a2f3a] hover:bg-[#2a2f3a]'
            }`}
          >
            Switch to {activePlayer.level === 'Professional' ? 'Amateur' : 'Professional'}
          </button>
        </div>
      </div>
    </header>
  );
}
