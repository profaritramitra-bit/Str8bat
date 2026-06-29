import React, { useState } from 'react';
import { 
  Award, TrendingUp, Shield, Flame, Compass, ChevronRight, CheckCircle, Info 
} from 'lucide-react';
import { PlayerProfile } from '../types';
import { BENCHMARKS } from '../data/mockData';

interface AnalyticsComparisonProps {
  activePlayer: PlayerProfile;
}

export default function AnalyticsComparison({ activePlayer }: AnalyticsComparisonProps) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<'Batting' | 'Bowling'>('Batting');

  const battingTips = [
    {
      metric: 'Bat Speed (km/h)',
      amateur: `${BENCHMARKS.Amateur.batting.avgSpeed} - ${BENCHMARKS.Amateur.batting.maxSpeed} km/h`,
      pro: `${BENCHMARKS.Professional.batting.avgSpeed} - ${BENCHMARKS.Professional.batting.maxSpeed} km/h`,
      tip: 'To increase speed, focus on a high backlift path from first-slip. Accelerate late during downswing instead of tensing your shoulders at start of stance.'
    },
    {
      metric: 'Sweet Spot Accuracy',
      amateur: `${BENCHMARKS.Amateur.batting.sweetSpot}%`,
      pro: `${BENCHMARKS.Professional.batting.sweetSpot}%`,
      tip: 'Keep your head positioned directly over the ball at point of contact. Align your front foot to line of ball. Minimizing body drift improves impact centering by 20%.'
    },
    {
      metric: 'Backlift Angle (deg)',
      amateur: '35° - 48°',
      pro: '60° - 75°',
      tip: 'A higher backlift acts as potential energy. Cock your wrists at stance, and let the bat drop along a straight vertical plane to generate peak speed.'
    },
    {
      metric: 'Timing Accuracy',
      amateur: `${BENCHMARKS.Amateur.batting.timing}%`,
      pro: `${BENCHMARKS.Professional.batting.timing}%`,
      tip: 'Wait for the ball. Early downswing is the #1 amateur timing mistake, which results in leading edges or playing across the line. Let ball pitch before initiating snap.'
    }
  ];

  const bowlingTips = [
    {
      metric: 'Release Velocity (km/h)',
      amateur: `${BENCHMARKS.Amateur.bowling.avgSpeed} - ${BENCHMARKS.Amateur.bowling.maxSpeed} km/h`,
      pro: `${BENCHMARKS.Professional.bowling.avgSpeed} - ${BENCHMARKS.Professional.bowling.maxSpeed} km/h`,
      tip: 'Maximize momentum transfer during run-up. Maintain a firm front-foot landing brace to transfer kinetic velocity upward from ground through your core.'
    },
    {
      metric: 'Length Consistency',
      amateur: `${BENCHMARKS.Amateur.bowling.accuracy}%`,
      pro: `${BENCHMARKS.Professional.bowling.accuracy}%`,
      tip: 'Focus on a consistent release height and angle. Release the ball slightly earlier for short pitches and delay release for full lengths/yorkers.'
    },
    {
      metric: 'Seam / Spin Rotation',
      amateur: '900 - 1,200 RPM',
      pro: '2,000 - 2,400 RPM',
      tip: 'For spinners, snap the wrists hard at point of release. For seamers, keep your index and middle fingers tight, pushing down hard over the seam.'
    }
  ];

  const tips = selectedDiscipline === 'Batting' ? battingTips : bowlingTips;

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Overview Intro */}
      <div className="bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans font-extrabold text-xl text-white flex items-center">
            <Award className="w-5 h-5 text-emerald-400 mr-2" />
            <span>Professional Standards Comparison</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">Select a discipline below to audit where your statistics stand against the elite pro benchmark thresholds.</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-slate-800/60 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => setSelectedDiscipline('Batting')}
            className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedDiscipline === 'Batting' 
                ? 'bg-emerald-500 text-slate-950 shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Batting Standards
          </button>
          <button
            onClick={() => setSelectedDiscipline('Bowling')}
            className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedDiscipline === 'Bowling' 
                ? 'bg-lime-400 text-slate-950 shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bowling Standards
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metric Comparison Cards */}
        <div className="space-y-4">
          <h3 className="font-sans font-bold text-sm text-slate-400 uppercase tracking-widest">Benchmark Metrics Breakdown</h3>
          
          {tips.map((item, index) => (
            <div key={index} className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white">{item.metric}</span>
                <span className="text-[10px] font-bold bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700/60">str8bat calibration</span>
              </div>

              {/* Side-by-side comparative bars */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/20 border border-slate-800/50 p-3 rounded-lg text-left">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Amateur Standard</span>
                  <span className="text-sm font-bold text-slate-300 font-mono mt-1 block">{item.amateur}</span>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg text-left">
                  <span className="text-[9px] text-emerald-500/50 font-bold uppercase tracking-wider block">Pro Benchmark</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono mt-1 block">{item.pro}</span>
                </div>
              </div>

              {/* Coach tips */}
              <div className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800/60">
                <p className="font-semibold text-slate-300 flex items-center mb-1">
                  <Info className="w-3.5 h-3.5 text-lime-400 mr-1.5 shrink-0" />
                  <span>Interactive Coach Advice</span>
                </p>
                {item.tip}
              </div>
            </div>
          ))}
        </div>

        {/* Professional Standard Visual Gauges */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">Professional Level Trajectory</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Based on the aggregate telemetry logged under your current <strong>{activePlayer.level} Profile</strong>, here is how close your statistics are to qualifying for elite cricket standard bands.
            </p>
          </div>

          <div className="space-y-8 flex-1 flex flex-col justify-center">
            {/* Gauge 1 */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-200">
                  {selectedDiscipline === 'Batting' ? 'Avg Downswing Velocity' : 'Release Velocity Consistency'}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {activePlayer.level === 'Professional' ? '92%' : '65%'}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full transition-all duration-500" 
                  style={{ width: activePlayer.level === 'Professional' ? '92%' : '65%' }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>Amateur Threshold</span>
                <span className="font-bold text-emerald-500/50">Pro Baseline</span>
                <span>Elite Professional</span>
              </div>
            </div>

            {/* Gauge 2 */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-200">
                  {selectedDiscipline === 'Batting' ? 'Sweet Spot Precision Contact' : 'Length Target Placement'}
                </span>
                <span className="text-xs font-mono font-bold text-lime-400">
                  {activePlayer.level === 'Professional' ? '88%' : '58%'}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <div 
                  className="h-full bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full transition-all duration-500" 
                  style={{ width: activePlayer.level === 'Professional' ? '88%' : '58%' }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>Amateur Threshold</span>
                <span className="font-bold text-lime-500/50">Pro Baseline</span>
                <span>Elite Professional</span>
              </div>
            </div>

            {/* Gauge 3 */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-200">
                  {selectedDiscipline === 'Batting' ? 'Stance Impact Stability' : 'Seam Angle Axis Deviation'}
                </span>
                <span className="text-xs font-mono font-bold text-sky-400">
                  {activePlayer.level === 'Professional' ? '84%' : '50%'}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <div 
                  className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-500" 
                  style={{ width: activePlayer.level === 'Professional' ? '84%' : '50%' }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>Amateur Threshold</span>
                <span className="font-bold text-sky-500/50">Pro Baseline</span>
                <span>Elite Professional</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-950/40 rounded-xl border border-slate-800 flex items-start space-x-3.5">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400 leading-normal">
              <strong>Interactive Scout Report</strong>: Scouts prioritize high swing speed and high sweet-spot rates. Switch player profiles in the header to view both amateur and pro datasets.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
