import React, { useState } from 'react';
import { 
  Shield, Compass, Target, Info, AlertCircle, ChevronDown, Award
} from 'lucide-react';
import { BowlingSession, PlayerProfile } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, RadialBarChart, RadialBar, Legend
} from 'recharts';

interface BowlingAnalyticsProps {
  activePlayer: PlayerProfile;
  bowlingSessions: BowlingSession[];
}

export default function BowlingAnalytics({ activePlayer, bowlingSessions }: BowlingAnalyticsProps) {
  const sessions = bowlingSessions.filter(s => s.playerLevel === activePlayer.level);
  
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    sessions.length ? sessions[sessions.length - 1].id : ''
  );

  const currentSession = sessions.find(s => s.id === selectedSessionId) || sessions[sessions.length - 1];

  if (!currentSession) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl text-center text-slate-400">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <p className="text-sm font-semibold">No bowling sessions found for {activePlayer.level} profile.</p>
        <p className="text-xs text-slate-500 mt-1">Please use the Live Sensor Simulator to create bowling sessions first.</p>
      </div>
    );
  }

  // Length Distribution
  const lengthData = [
    { name: 'Short', count: currentSession.lengthsDistribution.short, color: '#f87171' },
    { name: 'Good Length', count: currentSession.lengthsDistribution.good, color: '#10b981' },
    { name: 'Full', count: currentSession.lengthsDistribution.full, color: '#34d399' },
    { name: 'Yorker', count: currentSession.lengthsDistribution.yorker, color: '#38bdf8' },
  ];

  // Line Distribution
  const lineData = [
    { name: 'Wide Off', count: currentSession.linesDistribution.wideOff },
    { name: 'Outside Off', count: currentSession.linesDistribution.outsideOff },
    { name: 'On Stumps', count: currentSession.linesDistribution.onStumps },
    { name: 'Down Leg', count: currentSession.linesDistribution.downLeg },
  ];

  // Simulated coordinate mappings of ball landings based on length/line distributions
  const generateBallLandings = (session: BowlingSession) => {
    const balls = [];
    const lengths = ['short', 'good', 'full', 'yorker'] as const;
    const lines = ['wideOff', 'outsideOff', 'onStumps', 'downLeg'] as const;

    // We generate some coordinates for visual representation
    lengths.forEach(len => {
      const lenCount = session.lengthsDistribution[len];
      for (let i = 0; i < lenCount; i++) {
        // Map Y range (Y-axis: top to bottom represents Yorker to Short)
        let yMin = 15, yMax = 30; // Yorker (closer to stumps)
        if (len === 'full') { yMin = 35; yMax = 50; }
        if (len === 'good') { yMin = 55; yMax = 70; }
        if (len === 'short') { yMin = 75; yMax = 90; }

        const randomLine = lines[Math.floor(Math.random() * lines.length)];
        // Map X range (X-axis: left to right represents Wide Off to Down Leg)
        let xMin = 15, xMax = 30; // Wide Off
        if (randomLine === 'outsideOff') { xMin = 35; xMax = 50; }
        if (randomLine === 'onStumps') { xMin = 52; xMax = 68; }
        if (randomLine === 'downLeg') { xMin = 72; xMax = 88; }

        const x = xMin + Math.random() * (xMax - xMin);
        const y = yMin + Math.random() * (yMax - yMin);
        const isAccurate = len === 'good' || len === 'yorker';

        balls.push({ x, y, len, line: randomLine, isAccurate });
      }
    });

    return balls;
  };

  const ballLandings = generateBallLandings(currentSession);

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Top Session Selector & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-lime-400 bg-lime-500/10 px-2.5 py-0.5 rounded uppercase tracking-wider">str8bat Companion</span>
            <span className="text-slate-400 text-xs">Ball tracking & Release dynamics active</span>
          </div>
          <h2 className="font-sans font-extrabold text-xl text-white mt-1.5 flex items-center">
            <Shield className="w-5 h-5 text-lime-400 mr-2" />
            <span>Bowling Performance Analysis</span>
          </h2>
        </div>

        {/* Session Dropdown Selector */}
        <div className="relative">
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="cursor-pointer appearance-none bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500/30 transition-all"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {new Date(s.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — {s.sessionType} ({s.totalDeliveries} balls)
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main KPI Stats Block */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Release Speed</p>
          <p className="text-2xl font-black text-white font-mono mt-1.5">{currentSession.avgReleaseSpeed} <span className="text-xs text-slate-400 font-bold">km/h</span></p>
          <p className="text-[9px] text-slate-500 font-medium mt-1">Class standards: {activePlayer.level === 'Professional' ? '130+' : '100+'} km/h</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Length Accuracy</p>
          <p className="text-2xl font-black text-lime-400 font-mono mt-1.5">{currentSession.accuracyPercentage}%</p>
          <p className="text-[9px] text-slate-500 font-medium mt-1">Balls placed in Good/Yorker sectors</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Release Height</p>
          <p className="text-2xl font-black text-sky-400 font-mono mt-1.5">{currentSession.avgReleaseHeight} <span className="text-xs text-slate-400 font-bold">m</span></p>
          <p className="text-[9px] text-slate-500 font-medium mt-1">Bounce trajectory factor</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Seam Orientation</p>
          <p className="text-2xl font-black text-amber-400 font-mono mt-1.5">{currentSession.seamAngle}°</p>
          <p className="text-[9px] text-slate-500 font-medium mt-1">Swing consistency alignment</p>
        </div>
      </div>

      {/* Pitch map vs Length Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pitch Map Heatmap */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-white flex items-center">
              <Target className="w-4.5 h-4.5 text-lime-400 mr-2" />
              <span>Ball Landing Pitch Map</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Visualizing where your deliveries pitched on the 22-yard track.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 mt-6 py-2">
            {/* The Pitch Canvas (styled to look like a green grass pitch) */}
            <div className="relative w-40 h-72 bg-gradient-to-b from-[#132817] via-[#1a3821] to-[#254f30] border-2 border-amber-800/40 rounded-xl flex flex-col justify-between overflow-hidden shadow-inner shadow-black/60">
              {/* Pitch Zones markings */}
              {/* Yorker Zone (Top) */}
              <div className="absolute top-[10%] w-full h-[22%] border-b border-dashed border-sky-400/20 flex items-center justify-center bg-sky-500/5">
                <span className="text-[8px] font-bold text-sky-400/40 font-mono tracking-widest">YORKER</span>
              </div>
              {/* Full Zone */}
              <div className="absolute top-[32%] w-full h-[18%] border-b border-dashed border-emerald-400/20 flex items-center justify-center bg-emerald-500/5">
                <span className="text-[8px] font-bold text-emerald-400/40 font-mono tracking-widest">FULL</span>
              </div>
              {/* Good Length Zone */}
              <div className="absolute top-[50%] w-full h-[22%] border-b border-dashed border-emerald-500/30 flex items-center justify-center bg-emerald-500/15">
                <span className="text-[8px] font-bold text-emerald-400/60 font-mono tracking-widest">GOOD LENGTH</span>
              </div>
              {/* Short Zone (Bottom) */}
              <div className="absolute top-[72%] w-full h-[25%] flex items-center justify-center bg-rose-500/5">
                <span className="text-[8px] font-bold text-rose-400/40 font-mono tracking-widest">SHORT</span>
              </div>

              {/* Batsman Crease lines at top */}
              <div className="absolute top-4 w-12 h-6 border-b border-r border-l border-slate-300/30 left-1/2 -translate-x-1/2" />
              {/* Stumps symbol at top */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 flex space-x-1">
                <span className="w-1 h-3 bg-amber-400/50 rounded-full" />
                <span className="w-1 h-3 bg-amber-400/50 rounded-full" />
                <span className="w-1 h-3 bg-amber-400/50 rounded-full" />
              </div>

              {/* Dynamic Deliveries */}
              {ballLandings.map((ball, idx) => (
                <div
                  key={idx}
                  className={`absolute w-3.5 h-3.5 rounded-full border border-black/50 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-[8px] font-black font-mono transition-all duration-300 ${
                    ball.isAccurate 
                      ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/50' 
                      : 'bg-rose-400 text-slate-950 shadow-md shadow-rose-400/30'
                  }`}
                  style={{ left: `${ball.x}%`, top: `${ball.y}%` }}
                  title={`${ball.len} length, landing ${ball.line}`}
                >
                  o
                </div>
              ))}
            </div>

            {/* Heatmap Legend and coaching advice */}
            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-2 bg-slate-800/30 border border-slate-800/50 p-3.5 rounded-xl">
                <p className="text-xs font-bold text-slate-200">Delivery Accuracy Breakdown</p>
                <div className="grid grid-cols-2 gap-3 pt-1.5">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Target Deliveries</span>
                    <span className="text-sm font-bold text-lime-400 font-mono">
                      {currentSession.lengthsDistribution.good + currentSession.lengthsDistribution.yorker} balls
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Stray Deliveries</span>
                    <span className="text-sm font-bold text-rose-400 font-mono">
                      {currentSession.lengthsDistribution.short + currentSession.lengthsDistribution.full} balls
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/20 p-3.5 rounded-xl border border-slate-800/60">
                <p className="font-bold text-slate-300 flex items-center mb-1">
                  <Info className="w-3.5 h-3.5 text-lime-400 mr-1.5" />
                  <span>Coach Release Analysis</span>
                </p>
                {currentSession.accuracyPercentage >= 75 ? (
                  <span>Brilliant wrist work and release consistency. You are keeping the batter under pressure by repeatedly hitting the good-length corridor and mixing in yorkers smoothly.</span>
                ) : (
                  <span>You are occasionally releasing the ball too early, dropping it short of length, or over-pitching. Work on your shoulder follow-through to stabilize your release point.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bowling Length Charts */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-white flex items-center">
              <Compass className="w-4.5 h-4.5 text-lime-400 mr-2" />
              <span>Length Frequency Distribution</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Accurate frequency levels of deliveries across the 4 primary pitch zones.</p>
          </div>

          <div className="h-60 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lengthData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Balls Bowled">
                  {lengthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] bg-slate-950/30 text-slate-500 border border-slate-800 p-2.5 rounded-lg text-center mt-4">
            Good Length delivery percentages are a key professional scout metric.
          </div>
        </div>
      </div>

      {/* Delivery Variation & Line Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line analytics bar list */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 rounded-2xl">
          <h3 className="font-sans font-bold text-base text-white flex items-center mb-4">
            <Target className="w-4.5 h-4.5 text-lime-400 mr-2" />
            <span>Line Distribution Analysis</span>
          </h3>
          <p className="text-xs text-slate-400 mb-6">Percentage of deliveries shifting off-stump compared to off-side traps.</p>
          
          <div className="space-y-4">
            {lineData.map((line, idx) => {
              const percentage = Math.round((line.count / currentSession.totalDeliveries) * 100) || 0;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{line.name}</span>
                    <span className="text-slate-400 font-mono">{line.count} deliveries ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-lime-500 to-emerald-400 rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Variety / Seam Rotation Specs */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-white flex items-center">
              <Compass className="w-4.5 h-4.5 text-sky-400 mr-2" />
              <span>Release Mechanics</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Advanced seam tilt and wrist velocity sensors output.</p>
          </div>

          <div className="space-y-4 mt-6">
            <div className="bg-slate-800/30 border border-slate-800/50 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Fast / Seam Variety</span>
                <span className="text-slate-200 font-semibold text-sm mt-1 block">
                  {currentSession.deliveryTypes.outswing} Outswing / {currentSession.deliveryTypes.inswing} Inswing
                </span>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-800/50 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Average Spin Rotation</span>
                <span className="text-slate-200 font-semibold text-sm mt-1 block">
                  {activePlayer.role === 'Bowler' ? '1,850 RPM' : '1,150 RPM'}
                </span>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-800/50 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Delivery Consistency</span>
                <span className="text-emerald-400 font-black text-sm mt-1 block font-mono">
                  {activePlayer.level === 'Professional' ? '88.5%' : '61.2%'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[9px] bg-slate-950/20 text-slate-500 border border-slate-800 p-2 rounded-center text-center mt-4">
            Calculated over a moving average of recent 6 nets.
          </div>
        </div>
      </div>
    </div>
  );
}
