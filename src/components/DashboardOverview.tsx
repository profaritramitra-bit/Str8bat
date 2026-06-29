import React from 'react';
import { 
  Flame, Award, TrendingUp, Calendar, 
  Target, ChevronRight, BarChart2, Zap, Trophy, ShieldAlert
} from 'lucide-react';
import { BattingSession, BowlingSession, PlayerProfile } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

interface DashboardOverviewProps {
  activePlayer: PlayerProfile;
  battingSessions: BattingSession[];
  bowlingSessions: BowlingSession[];
  setActiveTab: (tab: string) => void;
}

export default function DashboardOverview({ 
  activePlayer, 
  battingSessions, 
  bowlingSessions, 
  setActiveTab 
}: DashboardOverviewProps) {
  
  // Filter sessions by active player
  const playerBatting = battingSessions.filter(s => s.playerLevel === activePlayer.level);
  const playerBowling = bowlingSessions.filter(s => s.playerLevel === activePlayer.level);

  // Batting aggregates
  const totalShots = playerBatting.reduce((acc, s) => acc + s.totalShots, 0);
  const avgBatSpeed = playerBatting.length 
    ? Math.round((playerBatting.reduce((acc, s) => acc + s.avgBatSpeed, 0) / playerBatting.length) * 10) / 10
    : 0;
  const maxBatSpeed = playerBatting.length
    ? Math.round(Math.max(...playerBatting.map(s => s.maxBatSpeed)) * 10) / 10
    : 0;
  const avgSweetSpot = playerBatting.length
    ? Math.round(playerBatting.reduce((acc, s) => acc + s.avgSweetSpot, 0) / playerBatting.length)
    : 0;
  const avgTiming = playerBatting.length
    ? Math.round(playerBatting.reduce((acc, s) => acc + s.timingAccuracy, 0) / playerBatting.length)
    : 0;

  // Bowling aggregates
  const totalDeliveries = playerBowling.reduce((acc, s) => acc + s.totalDeliveries, 0);
  const avgReleaseSpeed = playerBowling.length
    ? Math.round((playerBowling.reduce((acc, s) => acc + s.avgReleaseSpeed, 0) / playerBowling.length) * 10) / 10
    : 0;
  const maxReleaseSpeed = playerBowling.length
    ? Math.round(Math.max(...playerBowling.map(s => s.maxReleaseSpeed)) * 10) / 10
    : 0;
  const avgAccuracy = playerBowling.length
    ? Math.round(playerBowling.reduce((acc, s) => acc + s.accuracyPercentage, 0) / playerBowling.length)
    : 0;

  // Recent Sessions
  const recentSessions = [
    ...playerBatting.map(s => ({ ...s, type: 'Batting' as const })),
    ...playerBowling.map(s => ({ ...s, type: 'Bowling' as const }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 4);

  // Progress chart data
  const progressData = [...playerBatting, ...playerBowling]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(session => {
      const date = new Date(session.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      return {
        date,
        'Batting Speed': 'avgBatSpeed' in session ? (session as BattingSession).avgBatSpeed : null,
        'Bowling Speed': 'avgReleaseSpeed' in session ? (session as BowlingSession).avgReleaseSpeed : null,
        'Sweet Spot %': 'avgSweetSpot' in session ? (session as BattingSession).avgSweetSpot : null,
        'Accuracy %': 'accuracyPercentage' in session ? (session as BowlingSession).accuracyPercentage : null,
      };
    });

  // Radar data for holistic skills breakdown
  const radarData = [
    { subject: 'Bat Speed', value: avgBatSpeed > 80 ? 95 : avgBatSpeed > 60 ? 70 : 45, fullMark: 100 },
    { subject: 'Sweet Spot', value: avgSweetSpot, fullMark: 100 },
    { subject: 'Timing', value: avgTiming, fullMark: 100 },
    { subject: 'Bowling Speed', value: avgReleaseSpeed > 130 ? 92 : avgReleaseSpeed > 110 ? 72 : 45, fullMark: 100 },
    { subject: 'Accuracy', value: avgAccuracy, fullMark: 100 },
    { subject: 'Power Consistency', value: activePlayer.level === 'Professional' ? 88 : 55, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-[#111e35] to-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="relative">
              <img
                src={activePlayer.avatar}
                alt={activePlayer.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover ring-4 ring-emerald-500/20"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-slate-950 p-1.5 rounded-xl shadow-lg ring-2 ring-slate-900">
                <Trophy className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-white tracking-tight">{activePlayer.name}</h2>
                <span className="text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {activePlayer.level}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                Role: <span className="text-slate-200 font-semibold">{activePlayer.role}</span> • Batting: <span className="text-slate-200 font-semibold">{activePlayer.battingStyle}</span> • Bowling: <span className="text-slate-200 font-semibold">{activePlayer.bowlingStyle}</span>
              </p>
              <div className="flex items-center space-x-2 mt-3 text-xs text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined Cricket Hub on {new Date(activePlayer.joinedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('simulator')}
              className="cursor-pointer bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02]"
            >
              Start Live Sensor Session
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-3 rounded-xl text-xs border border-slate-700 transition-all duration-300"
            >
              View Pro Benchmarks
            </button>
          </div>
        </div>
      </div>

      {/* High-Level Career Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all duration-200">
          <div className="absolute top-4 right-4 text-emerald-400/10 group-hover:text-emerald-400/20 transition-all duration-200">
            <Flame className="w-12 h-12" />
          </div>
          <span className="text-xs text-slate-400 font-semibold">Avg Bat Speed</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-extrabold text-white font-mono">{avgBatSpeed || '—'}</span>
            <span className="text-xs text-slate-500 font-semibold">km/h</span>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-slate-400 font-medium">
            <Zap className="w-3.5 h-3.5 text-emerald-400 mr-1" />
            <span>Max Bat Speed: <strong className="text-slate-200">{maxBatSpeed} km/h</strong></span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all duration-200">
          <div className="absolute top-4 right-4 text-lime-400/10 group-hover:text-lime-400/20 transition-all duration-200">
            <Target className="w-12 h-12" />
          </div>
          <span className="text-xs text-slate-400 font-semibold">Sweet Spot Index</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-extrabold text-white font-mono">{avgSweetSpot ? `${avgSweetSpot}%` : '—'}</span>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-slate-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-lime-400 mr-1" />
            <span>Timing Accuracy: <strong className="text-slate-200">{avgTiming}%</strong></span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all duration-200">
          <div className="absolute top-4 right-4 text-emerald-400/10 group-hover:text-emerald-400/20 transition-all duration-200">
            <Award className="w-12 h-12" />
          </div>
          <span className="text-xs text-slate-400 font-semibold">Avg Bowled Speed</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-extrabold text-white font-mono">{avgReleaseSpeed || '—'}</span>
            <span className="text-xs text-slate-500 font-semibold">km/h</span>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-slate-400 font-medium">
            <Zap className="w-3.5 h-3.5 text-emerald-400 mr-1" />
            <span>Max Release: <strong className="text-slate-200">{maxReleaseSpeed} km/h</strong></span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all duration-200">
          <div className="absolute top-4 right-4 text-lime-400/10 group-hover:text-lime-400/20 transition-all duration-200">
            <BarChart2 className="w-12 h-12" />
          </div>
          <span className="text-xs text-slate-400 font-semibold">Bowling Accuracy</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-extrabold text-white font-mono">{avgAccuracy ? `${avgAccuracy}%` : '—'}</span>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-slate-400 font-medium">
            <Trophy className="w-3.5 h-3.5 text-lime-400 mr-1" />
            <span>Total Deliveries: <strong className="text-slate-200">{totalDeliveries}</strong></span>
          </div>
        </div>
      </div>

      {/* Charts Section: Career Stats Over Time & Skill Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Career Statistics Over Time Chart */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-base text-white">Career Performance Progression</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">str8bat Analytics</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Tracking average speeds and quality percentages over past training sessions.</p>
          </div>

          <div className="h-64 md:h-72 mt-6">
            {progressData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBowl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a3e635" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#a3e635" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} label={{ value: 'Speed (km/h)', angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#64748b', fontSize: 10, fontWeight: 600 } }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 600, fontSize: 11 }}
                    itemStyle={{ fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="Batting Speed" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBat)" name="Batting Speed (km/h)" />
                  <Area type="monotone" dataKey="Bowling Speed" stroke="#a3e635" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBowl)" name="Bowling Speed (km/h)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <BarChart2 className="w-10 h-10 mb-2 opacity-40" />
                <span className="text-xs font-semibold">No sessions logged yet. Use the simulator to add!</span>
              </div>
            )}
          </div>
        </div>

        {/* Holistic Skill Balance Radar Chart */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-white">Player Radar Profile</h3>
            <p className="text-xs text-slate-400 mt-1">Holistic comparison of batting mechanics vs bowling precision.</p>
          </div>

          <div className="h-64 md:h-72 flex items-center justify-center mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" fontSize={8} />
                <Radar name={activePlayer.name} dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Goals & Recent Sessions (Clickable list details) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals & Focus Areas */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 rounded-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <h3 className="font-sans font-bold text-base text-white flex items-center">
              <Target className="w-4.5 h-4.5 text-emerald-400 mr-2" />
              <span>Training Milestones & Goals</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{activePlayer.goals.length} active goals</span>
          </div>

          <div className="mt-4 space-y-4">
            {activePlayer.goals.map((goal, i) => {
              // Calculate simple simulated target checks for fun
              let isAchieved = false;
              if (goal.includes("75") && avgBatSpeed >= 75) isAchieved = true;
              if (goal.includes("80%") && avgSweetSpot >= 80) isAchieved = true;
              if (goal.includes("speed > 90") && maxBatSpeed > 90) isAchieved = true;
              if (goal.includes("92%") && avgTiming >= 92) isAchieved = true;

              return (
                <div key={i} className="flex items-start space-x-3.5 bg-slate-800/30 border border-slate-800/60 p-3.5 rounded-xl">
                  <div className={`mt-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center text-[10px] ${
                    isAchieved 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                      : 'border-slate-600 text-slate-400'
                  }`}>
                    {isAchieved ? '✓' : i + 1}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${isAchieved ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {goal}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {isAchieved ? 'Completed! Metric achieved' : 'In Progress • Keep practicing'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Session Log (Clicking takes you to history or details) */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <h3 className="font-sans font-bold text-base text-white flex items-center">
                <BarChart2 className="w-4.5 h-4.5 text-lime-400 mr-2" />
                <span>Recent Activity Log</span>
              </h3>
              <button 
                onClick={() => setActiveTab('history')} 
                className="cursor-pointer text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center group transition-colors"
              >
                <span>See All History</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {recentSessions.length > 0 ? (
                recentSessions.map((session) => {
                  const isBatting = session.type === 'Batting';
                  const dateString = new Date(session.timestamp).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div 
                      key={session.id} 
                      onClick={() => setActiveTab(isBatting ? 'batting' : 'bowling')}
                      className="cursor-pointer flex items-center justify-between bg-slate-800/20 hover:bg-slate-800/60 border border-slate-800/60 hover:border-slate-700/80 p-3 rounded-xl transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2.5 rounded-lg ${
                          isBatting 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-lime-500/10 text-lime-400'
                        }`}>
                          <Flame className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-100">{isBatting ? 'Batting Session' : 'Bowling Session'}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{dateString} • {session.sessionType}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-mono font-bold text-slate-200">
                          {isBatting 
                            ? `${(session as BattingSession).avgBatSpeed} km/h` 
                            : `${(session as BowlingSession).avgReleaseSpeed} km/h`}
                        </p>
                        <p className="text-[9px] text-slate-500 font-semibold mt-0.5">
                          {isBatting 
                            ? `${(session as BattingSession).totalShots} shots` 
                            : `${(session as BowlingSession).totalDeliveries} balls`}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs">
                  <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                  No recent activity. Click below to start a live session!
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('simulator')}
            className="cursor-pointer mt-5 w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 font-semibold py-2.5 rounded-xl text-xs transition-colors"
          >
            Go to Sensor Simulator
          </button>
        </div>
      </div>
    </div>
  );
}
