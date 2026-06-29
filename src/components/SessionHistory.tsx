import React, { useState } from 'react';
import { 
  Calendar, Flame, Shield, Search, Filter, Trash2, 
  RotateCcw, Info, ChevronDown, ChevronUp, AlertTriangle, FileText
} from 'lucide-react';
import { BattingSession, BowlingSession, SessionType } from '../types';

interface SessionHistoryProps {
  battingSessions: BattingSession[];
  bowlingSessions: BowlingSession[];
  onDeleteBattingSession: (id: string) => void;
  onDeleteBowlingSession: (id: string) => void;
  onResetDatabase: () => void;
}

export default function SessionHistory({
  battingSessions,
  bowlingSessions,
  onDeleteBattingSession,
  onDeleteBowlingSession,
  onResetDatabase
}: SessionHistoryProps) {

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [disciplineFilter, setDisciplineFilter] = useState<'All' | 'Batting' | 'Bowling'>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Combine batting and bowling sessions into a single timeline sorted chronologically
  const allSessions = [
    ...battingSessions.map(s => ({ ...s, discipline: 'Batting' as const })),
    ...bowlingSessions.map(s => ({ ...s, discipline: 'Bowling' as const }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Filter combined timeline
  const filteredSessions = allSessions.filter(session => {
    // Search matching
    const matchesSearch = session.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          session.playerLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          session.sessionType.toLowerCase().includes(searchTerm.toLowerCase());

    // Discipline filter
    const matchesDiscipline = disciplineFilter === 'All' || session.discipline === disciplineFilter;

    // Session Type filter
    const matchesType = typeFilter === 'All' || session.sessionType === typeFilter;

    return matchesSearch && matchesDiscipline && matchesType;
  });

  const toggleExpand = (id: string) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Search and Filters Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-sans font-extrabold text-xl text-white flex items-center">
              <Calendar className="w-5 h-5 text-emerald-400 mr-2" />
              <span>Career Session History Logs</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1">Search, audit, and analyze raw IoT sensor recordings accumulated over time.</p>
          </div>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all sessions back to the default historical mock values?")) {
                onResetDatabase();
              }
            }}
            className="cursor-pointer self-start md:self-auto flex items-center space-x-2 text-xs font-semibold bg-slate-800 text-emerald-400 border border-slate-700/60 hover:bg-slate-750 px-3.5 py-2 rounded-xl transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default Database</span>
          </button>
        </div>

        {/* Filter bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by player, level, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800/40 border border-slate-800 focus:border-slate-700 text-slate-200 placeholder-slate-500 text-xs py-2.5 pl-10 pr-4 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>

          {/* Discipline filter select */}
          <div className="flex bg-slate-800/40 border border-slate-800 rounded-xl p-1">
            {(['All', 'Batting', 'Bowling'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDisciplineFilter(d)}
                className={`cursor-pointer flex-1 text-center text-xs font-semibold py-1.5 rounded-lg transition-all ${
                  disciplineFilter === d 
                    ? 'bg-slate-800 text-emerald-300 shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Session type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="cursor-pointer bg-slate-800/40 border border-slate-800 text-slate-300 text-xs font-semibold py-2.5 px-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
          >
            <option value="All">All Practice Modes</option>
            <option value="Net Practice">Net Practice</option>
            <option value="Match">Match</option>
            <option value="Sensor Simulation">Sensor Simulation</option>
          </select>
        </div>
      </div>

      {/* Sessions Timeline List */}
      <div className="space-y-3">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => {
            const isBatting = session.discipline === 'Batting';
            const isExpanded = expandedSessionId === session.id;
            const formattedDate = new Date(session.timestamp).toLocaleDateString(undefined, {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div 
                key={session.id} 
                className={`border bg-slate-900/40 border-slate-800/80 rounded-2xl overflow-hidden transition-all duration-200 ${
                  isExpanded ? 'ring-1 ring-emerald-500/20 border-slate-700/80 bg-slate-900/80 shadow-lg' : 'hover:border-slate-700/60'
                }`}
              >
                {/* Session Summary Header row */}
                <div 
                  onClick={() => toggleExpand(session.id)}
                  className="cursor-pointer p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2.5 rounded-xl ${
                      isBatting 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-lime-500/10 text-lime-400'
                    }`}>
                      {isBatting ? <Flame className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-bold text-sm text-slate-100">{isBatting ? 'Batting Session' : 'Bowling Session'}</span>
                        <span className="text-[10px] font-bold bg-slate-800/80 text-slate-400 border border-slate-700/50 px-2 py-0.5 rounded">
                          {session.sessionType}
                        </span>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          session.playerLevel === 'Professional' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {session.playerLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Player: <strong className="text-slate-300">{session.playerName}</strong> • {formattedDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 border-slate-800/50 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-mono font-bold text-slate-200">
                        {isBatting 
                          ? `${(session as BattingSession).avgBatSpeed} km/h avg` 
                          : `${(session as BowlingSession).avgReleaseSpeed} km/h avg`}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">
                        {isBatting 
                          ? `${(session as BattingSession).totalShots} total shots` 
                          : `${(session as BowlingSession).totalDeliveries} deliveries`}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3.5">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Session Detail metrics panel */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-slate-800/60 bg-slate-950/20 space-y-4 animate-slide-down">
                    {isBatting ? (
                      // Expanded Batting Details
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                        <div className="bg-slate-900/50 p-3 rounded-xl">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Peak Bat Speed</span>
                          <span className="text-base font-bold text-slate-200 font-mono mt-1 block">{(session as BattingSession).maxBatSpeed} km/h</span>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-xl">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Sweet Spot Rate</span>
                          <span className="text-base font-bold text-emerald-400 font-mono mt-1 block">{(session as BattingSession).avgSweetSpot}%</span>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-xl">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Timing Index</span>
                          <span className="text-base font-bold text-lime-400 font-mono mt-1 block">{(session as BattingSession).timingAccuracy}%</span>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-xl">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Backlift Stance</span>
                          <span className="text-base font-bold text-amber-400 font-mono mt-1 block">{(session as BattingSession).backliftAngle}°</span>
                        </div>
                      </div>
                    ) : (
                      // Expanded Bowling Details
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                        <div className="bg-slate-900/50 p-3 rounded-xl">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Peak Delivery Speed</span>
                          <span className="text-base font-bold text-slate-200 font-mono mt-1 block">{(session as BowlingSession).maxReleaseSpeed} km/h</span>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-xl">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Target Accuracy</span>
                          <span className="text-base font-bold text-lime-400 font-mono mt-1 block">{(session as BowlingSession).accuracyPercentage}%</span>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-xl">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Release Stator Height</span>
                          <span className="text-base font-bold text-sky-400 font-mono mt-1 block">{(session as BowlingSession).avgReleaseHeight} m</span>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-xl">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Seam Orientation</span>
                          <span className="text-base font-bold text-amber-400 font-mono mt-1 block">{(session as BowlingSession).seamAngle}°</span>
                        </div>
                      </div>
                    )}

                    {/* Expandable footer actions (e.g. Delete) */}
                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-2">
                      <div className="flex items-center text-[10px] text-slate-500 font-semibold space-x-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>UUID Ref: {session.id}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Are you sure you want to delete this session from your local storage history?")) {
                            if (isBatting) {
                              onDeleteBattingSession(session.id);
                            } else {
                              onDeleteBowlingSession(session.id);
                            }
                          }
                        }}
                        className="cursor-pointer flex items-center space-x-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Recording</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-slate-900/20 border border-slate-800/60 rounded-2xl p-8 text-center text-slate-500 text-xs">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50 text-slate-400" />
            No sessions match your search/filter parameters. Use "Reset Default Database" to restore initial sessions.
          </div>
        )}
      </div>
    </div>
  );
}
