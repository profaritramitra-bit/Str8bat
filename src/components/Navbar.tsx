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
    <header className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand Logo & Identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="bg-gradient-to-tr from-emerald-400 to-lime-300 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
              <span className="font-mono font-black text-slate-950 text-xl tracking-tighter">str8</span>
            </div>
            <div>
              <h1 className="font-sans font-bold text-white text-lg tracking-tight leading-none">
                bat <span className="text-emerald-400 font-mono font-medium text-xs bg-emerald-500/10 px-2 py-0.5 rounded ml-1">IOT TECH</span>
              </h1>
              <p className="font-sans text-slate-400 text-xs mt-0.5">Cricket Performance Hub</p>
            </div>
          </div>

          {/* Quick player toggle for smaller screens */}
          <button 
            onClick={onToggleLevel}
            className="md:hidden text-xs font-semibold bg-slate-800 text-emerald-400 border border-slate-700 hover:bg-slate-700 hover:text-white px-3 py-1.5 rounded-lg transition-all duration-200"
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
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-lime-500/10 border border-emerald-500/30 text-emerald-300 shadow-md shadow-emerald-500/5'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card & Level Toggle */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800/80 p-1.5 pr-4 rounded-xl">
            <img
              src={activePlayer.avatar}
              alt={activePlayer.name}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/30"
              referrerPolicy="no-referrer"
            />
            <div className="text-left">
              <div className="flex items-center space-x-1.5">
                <span className="font-sans font-semibold text-slate-100 text-xs">{activePlayer.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${
                  activePlayer.level === 'Professional' 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {activePlayer.level}
                </span>
              </div>
              <p className="font-mono text-[10px] text-slate-400">{activePlayer.role} • {activePlayer.battingStyle}</p>
            </div>
          </div>

          <button
            onClick={onToggleLevel}
            className={`cursor-pointer font-sans text-xs font-bold px-4 py-2.5 rounded-xl border transition-all duration-300 shadow-md hover:scale-[1.02] ${
              activePlayer.level === 'Professional'
                ? 'bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 border-emerald-400 shadow-emerald-500/10 hover:shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Switch to {activePlayer.level === 'Professional' ? 'Amateur' : 'Professional'}
          </button>
        </div>
      </div>
    </header>
  );
}
