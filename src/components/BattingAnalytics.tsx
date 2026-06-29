import React, { useState } from 'react';
import { 
  Flame, Target, Activity, Compass, Info, AlertCircle, ChevronDown, Award
} from 'lucide-react';
import { BattingSession, PlayerProfile } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

interface BattingAnalyticsProps {
  activePlayer: PlayerProfile;
  battingSessions: BattingSession[];
}

export default function BattingAnalytics({ activePlayer, battingSessions }: BattingAnalyticsProps) {
  const sessions = battingSessions.filter(s => s.playerLevel === activePlayer.level);
  
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    sessions.length ? sessions[sessions.length - 1].id : ''
  );

  // If active tab has changed or sessions changed, ensure we have a valid selection
  const currentSession = sessions.find(s => s.id === selectedSessionId) || sessions[sessions.length - 1];

  if (!currentSession) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl text-center text-slate-400">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <p className="text-sm font-semibold">No batting sessions found for {activePlayer.level} profile.</p>
        <p className="text-xs text-slate-500 mt-1">Please use the Live Sensor Simulator to create batting sessions first.</p>
      </div>
    );
  }

  // Wagon wheel chart data
  const wagonWheelData = [
    { name: 'Covers', value: currentSession.wagonWheel.covers, color: '#10b981' },
    { name: 'Off Side', value: currentSession.wagonWheel.offSide, color: '#34d399' },
    { name: 'Straight', value: currentSession.wagonWheel.straight, color: '#a3e635' },
    { name: 'Mid-Wicket', value: currentSession.wagonWheel.midWicket, color: '#fbbf24' },
    { name: 'Leg Side', value: currentSession.wagonWheel.legSide, color: '#f59e0b' },
    { name: 'Behind', value: currentSession.wagonWheel.behind, color: '#64748b' },
  ].filter(d => d.value > 0);

  // Shot types distribution data
  const shotTypesData = [
    { name: 'Drive', count: currentSession.shotTypes.drive },
    { name: 'Pull', count: currentSession.shotTypes.pull },
    { name: 'Cut', count: currentSession.shotTypes.cut },
    { name: 'Sweep', count: currentSession.shotTypes.sweep },
    { name: 'Defensive', count: currentSession.shotTypes.defensive },
    { name: 'Flick', count: currentSession.shotTypes.flick },
  ];

  // Sweet spot contact points simulation (coordinates based on sweet spot rate)
  const generateContactPoints = (count: number, sweetSpotRate: number) => {
    const points = [];
    for (let i = 0; i < count; i++) {
      const isSweet = Math.random() * 100 < sweetSpotRate;
      let x, y;
      if (isSweet) {
        // Centered around the middle of the bat (sweet spot)
        x = 45 + (Math.random() - 0.5) * 15; // 37.5 to 52.5%
        y = 45 + (Math.random() - 0.5) * 20; // 35 to 55%
      } else {
        // Outside, edge or bottom
        const isEdge = Math.random() > 0.5;
        if (isEdge) {
          x = Math.random() > 0.5 ? 15 + Math.random() * 10 : 75 + Math.random() * 10;
          y = 20 + Math.random() * 60;
        } else {
          x = 25 + Math.random() * 50;
          y = Math.random() > 0.5 ? 5 + Math.random() * 15 : 75 + Math.random() * 15;
        }
      }
      points.push({ x, y, isSweet });
    }
    return points;
  };

  const contactPoints = generateContactPoints(currentSession.totalShots, currentSession.avgSweetSpot);

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Top Session Selector & High-level Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded uppercase tracking-wider">str8bat Sensor</span>
            <span className="text-slate-400 text-xs">Connected via Bluetooth Smart</span>
          </div>
          <h2 className="font-sans font-extrabold text-xl text-white mt-1.5 flex items-center">
            <Flame className="w-5 h-5 text-emerald-400 mr-2" />
            <span>Batting Performance Analysis</span>
          </h2>
        </div>

        {/* Session Dropdown Selector */}
        <div className="relative">
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="cursor-pointer appearance-none bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {new Date(s.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — {s.sessionType} ({s.totalShots} shots)
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main KPI Stats Block */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Bat Speed</p>
          <p className="text-2xl font-black text-white font-mono mt-1.5">{currentSession.avgBatSpeed} <span className="text-xs text-slate-400 font-bold">km/h</span></p>
          <p className="text-[9px] text-slate-500 font-medium mt-1">Target benchmark: {activePlayer.level === 'Professional' ? '85+' : '60+'} km/h</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sweet Spot %</p>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-1.5">{currentSession.avgSweetSpot}%</p>
          <p className="text-[9px] text-slate-500 font-medium mt-1">Pro players maintain &gt;80%</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Timing Index</p>
          <p className="text-2xl font-black text-lime-400 font-mono mt-1.5">{currentSession.timingAccuracy}%</p>
          <p className="text-[9px] text-slate-500 font-medium mt-1">Excellent speed-to-impact delay</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Peak Speed</p>
          <p className="text-2xl font-black text-amber-400 font-mono mt-1.5">{currentSession.maxBatSpeed} <span className="text-xs text-slate-400 font-bold">km/h</span></p>
          <p className="text-[9px] text-slate-500 font-medium mt-1">Maximum downswing acceleration</p>
        </div>
      </div>

      {/* Sweet Spot Mapping vs Wagon Wheel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sweet Spot Heatmap Visualizer */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-white flex items-center">
              <Target className="w-4.5 h-4.5 text-emerald-400 mr-2" />
              <span>str8bat Sweet Spot Mapping</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Live grid showing impact distribution across the face of your bat.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 mt-6 py-2">
            {/* Bat Canvas */}
            <div className="relative w-36 h-72 bg-slate-800/60 border-2 border-slate-700/80 rounded-t-3xl rounded-b-xl flex items-center justify-center overflow-hidden shadow-inner shadow-slate-900/50">
              {/* Bat handle representation */}
              <div className="absolute top-0 w-8 h-8 bg-amber-700/40 border-b border-slate-700 rounded-t-xl" />
              {/* Sweet spot oval overlay */}
              <div className="absolute top-[35%] left-[15%] w-[70%] h-[35%] bg-emerald-500/5 border border-dashed border-emerald-500/20 rounded-full flex items-center justify-center">
                <span className="text-[8px] font-bold text-emerald-500/40 font-mono tracking-widest">SWEET SPOT</span>
              </div>
              {/* Dynamic contact dots */}
              {contactPoints.map((pt, index) => (
                <div
                  key={index}
                  className={`absolute w-2 h-2 rounded-full border border-slate-950/40 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                    pt.isSweet 
                      ? 'bg-emerald-400 shadow-md shadow-emerald-400/50' 
                      : 'bg-rose-500 shadow-md shadow-rose-500/30'
                  }`}
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  title={pt.isSweet ? "Sweet spot contact!" : "Off-center impact"}
                />
              ))}
            </div>

            {/* Heatmap Legend and coaching advice */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2 bg-slate-800/30 border border-slate-800/50 p-3.5 rounded-xl">
                <p className="text-xs font-bold text-slate-200">Contact Point Metrics</p>
                <div className="grid grid-cols-2 gap-3 pt-1.5">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Sweet Spot Hits</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      {Math.round(currentSession.totalShots * (currentSession.avgSweetSpot / 100))} shots
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Edge/Mishits</span>
                    <span className="text-sm font-bold text-rose-400 font-mono">
                      {Math.round(currentSession.totalShots * (1 - currentSession.avgSweetSpot / 100))} shots
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/20 p-3.5 rounded-xl border border-slate-800/60">
                <p className="font-bold text-slate-300 flex items-center mb-1">
                  <Info className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                  <span>Bio-Mechanical Coaching Insight</span>
                </p>
                {currentSession.avgSweetSpot >= 80 ? (
                  <span>Superb bat face presentation! Your swing plane remains perfectly aligned with the line of the ball, resulting in high sweet-spot percentage and massive power transfer.</span>
                ) : (
                  <span>You are occasionally playing away from your body, causing edge hits. Try to bring the backlift from a first-slip path and present a straight bat face at point of impact.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Wagon Wheel Field Selector */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-white flex items-center">
              <Compass className="w-4.5 h-4.5 text-lime-400 mr-2" />
              <span>Interactive Wagon Wheel</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Shot placement layout mapped directly from IoT swing path indicators.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
            {/* Field Plot Diagram */}
            <div className="relative w-44 h-44 bg-emerald-950/30 border-2 border-emerald-800/50 rounded-full flex items-center justify-center overflow-hidden">
              {/* Cricket Crease */}
              <div className="absolute top-[45%] w-full h-1 bg-emerald-800/40" />
              <div className="absolute w-8 h-4 border-2 border-slate-700/40 top-[40%] bg-emerald-900/30" />
              
              {/* Interactive Segment Vectors */}
              <div className="absolute top-2 text-[9px] font-bold text-emerald-400/50">STRAIGHT</div>
              <div className="absolute bottom-2 text-[9px] font-bold text-emerald-400/50">BEHIND</div>
              <div className="absolute left-2 text-[9px] font-bold text-emerald-400/50">OFF SIDE</div>
              <div className="absolute right-2 text-[9px] font-bold text-emerald-400/50">LEG SIDE</div>

              {/* Dynamic Overlaying placement percentages */}
              {wagonWheelData.map((seg, i) => (
                <span key={i} className="hidden" />
              ))}

              <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={wagonWheelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {wagonWheelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Placement List details */}
            <div className="flex-1 w-full space-y-2">
              {wagonWheelData.map((seg, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-1.5 border-b border-slate-800/50">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                    <span className="text-slate-300 font-medium">{seg.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-100">{seg.value} shots ({Math.round((seg.value / currentSession.totalShots) * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Swing Path & Shot Frequency Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shot Frequency chart */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 rounded-2xl">
          <h3 className="font-sans font-bold text-base text-white flex items-center mb-4">
            <Activity className="w-4.5 h-4.5 text-emerald-400 mr-2" />
            <span>Shot Frequency Breakdown</span>
          </h3>
          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shotTypesData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  itemStyle={{ fontSize: 12, color: '#10b981' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Shots Executed">
                  {shotTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#a3e635'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3D Swing Angles readout */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-white flex items-center">
              <Compass className="w-4.5 h-4.5 text-lime-400 mr-2" />
              <span>str8bat 3D Swing Planes</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Swing angles calculated from integrated accelerometer data.</p>
          </div>

          <div className="space-y-4 mt-6">
            <div className="bg-slate-800/30 border border-slate-800/50 p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Backlift Angle</span>
                <span className="text-slate-100 font-medium text-xs mt-0.5 block">Angle at the peak of backlift</span>
              </div>
              <span className="text-xl font-bold font-mono text-emerald-400">{currentSession.backliftAngle}°</span>
            </div>

            <div className="bg-slate-800/30 border border-slate-800/50 p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Downswing Plane</span>
                <span className="text-slate-100 font-medium text-xs mt-0.5 block">Blade downswing trajectory</span>
              </div>
              <span className="text-xl font-bold font-mono text-lime-400">{currentSession.downswingAngle}°</span>
            </div>

            <div className="bg-slate-800/30 border border-slate-800/50 p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Impact Stance</span>
                <span className="text-slate-100 font-medium text-xs mt-0.5 block">Blade twist at ball impact</span>
              </div>
              <span className="text-xl font-bold font-mono text-amber-400">
                {currentSession.impactAngle === 0 ? 'Square (0°)' : currentSession.impactAngle > 0 ? `Open (+${currentSession.impactAngle}°)` : `Closed (${currentSession.impactAngle}°)`}
              </span>
            </div>
          </div>

          <div className="text-[10px] bg-slate-950/30 text-slate-500 border border-slate-800 p-2.5 rounded-lg text-center mt-4">
            *Ensure bat sensor is calibrated before starting nets to maintain 0.5-degree precision.
          </div>
        </div>
      </div>
    </div>
  );
}
