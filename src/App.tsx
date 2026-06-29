/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import BattingAnalytics from './components/BattingAnalytics';
import BowlingAnalytics from './components/BowlingAnalytics';
import SessionSimulator from './components/SessionSimulator';
import AnalyticsComparison from './components/AnalyticsComparison';
import SessionHistory from './components/SessionHistory';
import { 
  getStoredData, 
  saveStoredData, 
  INITIAL_PLAYERS, 
  INITIAL_BATTING_SESSIONS, 
  INITIAL_BOWLING_SESSIONS 
} from './data/mockData';
import { PlayerProfile, BattingSession, BowlingSession } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // App data states
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [battingSessions, setBattingSessions] = useState<BattingSession[]>([]);
  const [bowlingSessions, setBowlingSessions] = useState<BowlingSession[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const data = getStoredData();
    setPlayers(data.players);
    setBattingSessions(data.battingSessions);
    setBowlingSessions(data.bowlingSessions);
  }, []);

  // Save to LocalStorage whenever sessions or players change
  useEffect(() => {
    if (players.length > 0) {
      saveStoredData(players, battingSessions, bowlingSessions);
    }
  }, [players, battingSessions, bowlingSessions]);

  const activePlayer = players[activePlayerIndex] || INITIAL_PLAYERS[0];

  // Toggle active player level
  const togglePlayerLevel = () => {
    setActivePlayerIndex((prev) => (prev === 0 ? 1 : 0));
  };

  // Add batting session handler
  const handleAddBattingSession = (session: BattingSession) => {
    setBattingSessions((prev) => [session, ...prev]);
  };

  // Add bowling session handler
  const handleAddBowlingSession = (session: BowlingSession) => {
    setBowlingSessions((prev) => [session, ...prev]);
  };

  // Delete batting session handler
  const handleDeleteBattingSession = (id: string) => {
    setBattingSessions((prev) => prev.filter((s) => s.id !== id));
  };

  // Delete bowling session handler
  const handleDeleteBowlingSession = (id: string) => {
    setBowlingSessions((prev) => prev.filter((s) => s.id !== id));
  };

  // Reset database handler
  const handleResetDatabase = () => {
    setPlayers(INITIAL_PLAYERS);
    setActivePlayerIndex(0);
    setBattingSessions(INITIAL_BATTING_SESSIONS);
    setBowlingSessions(INITIAL_BOWLING_SESSIONS);
    saveStoredData(INITIAL_PLAYERS, INITIAL_BATTING_SESSIONS, INITIAL_BOWLING_SESSIONS);
  };

  // Render core tab views
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardOverview
            activePlayer={activePlayer}
            battingSessions={battingSessions}
            bowlingSessions={bowlingSessions}
            setActiveTab={setActiveTab}
          />
        );
      case 'batting':
        return (
          <BattingAnalytics
            activePlayer={activePlayer}
            battingSessions={battingSessions}
          />
        );
      case 'bowling':
        return (
          <BowlingAnalytics
            activePlayer={activePlayer}
            bowlingSessions={bowlingSessions}
          />
        );
      case 'simulator':
        return (
          <SessionSimulator
            activePlayer={activePlayer}
            onAddBattingSession={handleAddBattingSession}
            onAddBowlingSession={handleAddBowlingSession}
          />
        );
      case 'comparison':
        return (
          <AnalyticsComparison
            activePlayer={activePlayer}
          />
        );
      case 'history':
        return (
          <SessionHistory
            battingSessions={battingSessions}
            bowlingSessions={bowlingSessions}
            onDeleteBattingSession={handleDeleteBattingSession}
            onDeleteBowlingSession={handleDeleteBowlingSession}
            onResetDatabase={handleResetDatabase}
          />
        );
      default:
        return (
          <div className="text-center py-12 text-slate-500">
            Select a tab above to review cricket analytics.
          </div>
        );
    }
  };

  if (players.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center text-slate-400 font-mono text-sm">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#00ff88]/20 border-t-[#00ff88] rounded-full animate-spin mx-auto" />
          <span>Synchronizing str8bat IoT Core Databases...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e0e0e0] flex flex-col justify-between">
      <div>
        {/* Navigation Headboard */}
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          activePlayer={activePlayer}
          onToggleLevel={togglePlayerLevel}
        />

        {/* Content Board */}
        <main className="max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-8">
          {renderTabContent()}
        </main>
      </div>

      {/* Footer Branding block */}
      <footer className="border-t border-[#2a2f3a] bg-[#12141a] px-4 py-6 md:px-8 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 str8bat Performance & Analytics Hub. All rights reserved.</p>
          <div className="flex space-x-4">
            <span className="text-slate-600">Privacy Policy</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-600">Terms of Use</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-600 cursor-pointer hover:text-[#00ff88]" onClick={handleResetDatabase}>Calibration Diagnostic Tools</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

