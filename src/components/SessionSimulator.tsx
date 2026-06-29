import React, { useState, useEffect } from 'react';
import { 
  Award, Play, CheckCircle, Wifi, Bluetooth, RotateCcw, 
  Flame, Target, Shield, Compass, HelpCircle, Activity, Info
} from 'lucide-react';
import { BattingSession, BowlingSession, PlayerProfile, SessionType } from '../types';

interface SessionSimulatorProps {
  activePlayer: PlayerProfile;
  onAddBattingSession: (session: BattingSession) => void;
  onAddBowlingSession: (session: BowlingSession) => void;
}

export default function SessionSimulator({ 
  activePlayer, 
  onAddBattingSession, 
  onAddBowlingSession 
}: SessionSimulatorProps) {
  
  // Connection state
  const [sensorStatus, setSensorStatus] = useState<'disconnected' | 'pairing' | 'connected'>('disconnected');
  const [selectedRole, setSelectedRole] = useState<'Batting' | 'Bowling'>('Batting');
  const [sessionType, setSessionType] = useState<SessionType>('Sensor Simulation');

  // Simulation parameters (sliders)
  const [shotType, setShotType] = useState<'drive' | 'pull' | 'cut' | 'sweep' | 'defensive' | 'flick'>('drive');
  const [batSpeed, setBatSpeed] = useState<number>(activePlayer.level === 'Professional' ? 88 : 58);
  const [sweetSpot, setSweetSpot] = useState<number>(75);
  const [timing, setTiming] = useState<number>(70);

  const [bowlType, setBowlType] = useState<'fast' | 'outswing' | 'inswing' | 'offcutter' | 'legcutter'>('fast');
  const [bowlSpeed, setBowlSpeed] = useState<number>(activePlayer.level === 'Professional' ? 132 : 102);
  const [bowlAccuracy, setBowlAccuracy] = useState<number>(70);

  // Active logging state
  const [simulatedShots, setSimulatedShots] = useState<Array<{
    speed: number;
    sweetSpot: number;
    timing: number;
    shotType: string;
    description: string;
  }>>([]);

  const [simulatedDeliveries, setSimulatedDeliveries] = useState<Array<{
    speed: number;
    accuracy: number;
    bowlType: string;
    description: string;
    length: 'short' | 'good' | 'full' | 'yorker';
    line: 'wideOff' | 'outsideOff' | 'onStumps' | 'downLeg';
  }>>([]);

  // Log messages feed
  const [logs, setLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Connect Sensor Simulation
  const connectSensor = () => {
    setSensorStatus('pairing');
    setTimeout(() => {
      setSensorStatus('connected');
      addLog('✓ str8bat Sensor V2 pairing succeeded! Bluetooth Smart active.');
      addLog('✓ Accelerometer and Gyroscope initialized (0.5° tolerance).');
      addLog('✓ Gyroscope stance alignment verified.');
    }, 1500);
  };

  const addLog = (message: string) => {
    setLogs(prev => [message, ...prev]);
  };

  const handleSwing = () => {
    if (sensorStatus !== 'connected') return;
    setIsSimulating(true);
    addLog(`⏳ Swing detected! Analyzing sensor packet...`);

    setTimeout(() => {
      // Determine descriptions based on sweet spot and timing
      let desc = '';
      let hitSweet = sweetSpot >= 70;
      if (sweetSpot >= 85 && timing >= 80) {
        desc = `⚡ CRACK! Clean out of the middle. Supreme timing. (Wagon: Straight/Covers)`;
      } else if (sweetSpot >= 70) {
        desc = `🏏 Neat contact! Solid stroke through the infield.`;
      } else if (sweetSpot >= 45) {
        desc = `💨 Thick edge. Placed in defense or trickled into the gap.`;
      } else {
        desc = `💥 Mishit! Bottom edge or high face contact. Defective timing.`;
      }

      setSimulatedShots(prev => [
        {
          speed: batSpeed,
          sweetSpot,
          timing,
          shotType,
          description: desc
        },
        ...prev
      ]);

      addLog(`[Shot #${simulatedShots.length + 1}] Speed: ${batSpeed} km/h | SweetSpot: ${sweetSpot}% | Timing: ${timing}%`);
      addLog(desc);
      setIsSimulating(false);
    }, 800);
  };

  const handleBowlLaunch = () => {
    if (sensorStatus !== 'connected') return;
    setIsSimulating(true);
    addLog(`⏳ Ball released! Tracking vector speed...`);

    setTimeout(() => {
      // Pick random line and length based on accuracy
      let length: 'short' | 'good' | 'full' | 'yorker' = 'good';
      let line: 'wideOff' | 'outsideOff' | 'onStumps' | 'downLeg' = 'onStumps';

      if (bowlAccuracy >= 80) {
        length = Math.random() > 0.3 ? 'good' : 'yorker';
        line = Math.random() > 0.4 ? 'outsideOff' : 'onStumps';
      } else if (bowlAccuracy >= 50) {
        const lengths: Array<'short' | 'good' | 'full' | 'yorker'> = ['short', 'good', 'full'];
        length = lengths[Math.floor(Math.random() * lengths.length)];
        const lines: Array<'wideOff' | 'outsideOff' | 'onStumps' | 'downLeg'> = ['outsideOff', 'onStumps', 'downLeg'];
        line = lines[Math.floor(Math.random() * lines.length)];
      } else {
        const lengths: Array<'short' | 'good' | 'full' | 'yorker'> = ['short', 'full'];
        length = lengths[Math.floor(Math.random() * lengths.length)];
        const lines: Array<'wideOff' | 'outsideOff' | 'onStumps' | 'downLeg'> = ['wideOff', 'downLeg'];
        line = lines[Math.floor(Math.random() * lines.length)];
      }

      const desc = `🎯 Delivery pitched at ${length.toUpperCase()} length, aiming ${line.replace(/([A-Z])/g, ' $1').toLowerCase()}.`;

      setSimulatedDeliveries(prev => [
        {
          speed: bowlSpeed,
          accuracy: bowlAccuracy,
          bowlType,
          description: desc,
          length,
          line
        },
        ...prev
      ]);

      addLog(`[Ball #${simulatedDeliveries.length + 1}] Speed: ${bowlSpeed} km/h | Acc: ${bowlAccuracy}% | ${bowlType}`);
      addLog(desc);
      setIsSimulating(false);
    }, 800);
  };

  const saveCurrentSession = () => {
    if (selectedRole === 'Batting') {
      if (!simulatedShots.length) return;
      
      const totalSpeed = simulatedShots.reduce((acc, s) => acc + s.speed, 0);
      const totalSweet = simulatedShots.reduce((acc, s) => acc + s.sweetSpot, 0);
      const totalTiming = simulatedShots.reduce((acc, s) => acc + s.timing, 0);

      // Distribute shots visually across wagonWheel
      const wagonWheel = {
        offSide: 0,
        legSide: 0,
        straight: 0,
        covers: 0,
        midWicket: 0,
        behind: 0
      };

      const shotTypes = {
        drive: 0,
        pull: 0,
        cut: 0,
        sweep: 0,
        defensive: 0,
        flick: 0
      };

      simulatedShots.forEach(s => {
        // Increment shot type
        shotTypes[s.shotType as keyof typeof shotTypes]++;

        // visual distribution helper
        if (s.shotType === 'drive' || s.shotType === 'straight') {
          wagonWheel.straight++;
          wagonWheel.covers++;
        } else if (s.shotType === 'pull' || s.shotType === 'sweep') {
          wagonWheel.legSide++;
          wagonWheel.midWicket++;
        } else if (s.shotType === 'cut') {
          wagonWheel.offSide++;
        } else {
          wagonWheel.behind++;
        }
      });

      const newSession: BattingSession = {
        id: `bat_sim_${Date.now()}`,
        playerId: activePlayer.id,
        playerName: activePlayer.name,
        playerLevel: activePlayer.level,
        timestamp: new Date().toISOString(),
        sessionType,
        totalShots: simulatedShots.length,
        avgBatSpeed: Math.round((totalSpeed / simulatedShots.length) * 10) / 10,
        maxBatSpeed: Math.round(Math.max(...simulatedShots.map(s => s.speed)) * 10) / 10,
        avgSweetSpot: Math.round(totalSweet / simulatedShots.length),
        timingAccuracy: Math.round(totalTiming / simulatedShots.length),
        backliftAngle: activePlayer.level === 'Professional' ? 64 : 45,
        downswingAngle: activePlayer.level === 'Professional' ? 60 : 42,
        impactAngle: 0,
        wagonWheel,
        shotTypes
      };

      onAddBattingSession(newSession);
      addLog(`🚀 Batting session SAVED successfully to Career statistics!`);
      setSimulatedShots([]);
    } else {
      if (!simulatedDeliveries.length) return;

      const totalSpeed = simulatedDeliveries.reduce((acc, d) => acc + d.speed, 0);
      const totalAcc = simulatedDeliveries.reduce((acc, d) => acc + d.accuracy, 0);

      const lengthsDistribution = { short: 0, good: 0, full: 0, yorker: 0 };
      const linesDistribution = { wideOff: 0, outsideOff: 0, onStumps: 0, downLeg: 0 };
      const deliveryTypes = { fast: 0, outswing: 0, inswing: 0, offcutter: 0, legcutter: 0 };

      simulatedDeliveries.forEach(d => {
        lengthsDistribution[d.length]++;
        linesDistribution[d.line]++;
        deliveryTypes[d.bowlType as keyof typeof deliveryTypes]++;
      });

      const newSession: BowlingSession = {
        id: `bowl_sim_${Date.now()}`,
        playerId: activePlayer.id,
        playerName: activePlayer.name,
        playerLevel: activePlayer.level,
        timestamp: new Date().toISOString(),
        sessionType,
        totalDeliveries: simulatedDeliveries.length,
        avgReleaseSpeed: Math.round((totalSpeed / simulatedDeliveries.length) * 10) / 10,
        maxReleaseSpeed: Math.round(Math.max(...simulatedDeliveries.map(d => d.speed)) * 10) / 10,
        avgReleaseHeight: activePlayer.level === 'Professional' ? 1.93 : 1.83,
        seamAngle: 15,
        accuracyPercentage: Math.round(totalAcc / simulatedDeliveries.length),
        lengthsDistribution,
        linesDistribution,
        deliveryTypes
      };

      onAddBowlingSession(newSession);
      addLog(`🚀 Bowling session SAVED successfully to Career statistics!`);
      setSimulatedDeliveries([]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Simulation Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-sans font-extrabold text-xl text-white flex items-center">
              <Activity className="w-5 h-5 text-emerald-400 mr-2" />
              <span>str8bat IoT Live Sensor Simulator</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1">Calibrate, trigger live cricket physical gestures, and log real-time telemetry datasets.</p>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`w-2.5 h-2.5 rounded-full ${
              sensorStatus === 'connected' 
                ? 'bg-emerald-500 animate-pulse' 
                : sensorStatus === 'pairing' 
                  ? 'bg-amber-400 animate-ping' 
                  : 'bg-slate-600'
            }`} />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">
              {sensorStatus === 'connected' ? 'CONNECTED' : sensorStatus === 'pairing' ? 'PAIRING...' : 'DISCONNECTED'}
            </span>
          </div>
        </div>
      </div>

      {/* Connection & Calibration step */}
      {sensorStatus === 'disconnected' && (
        <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-2xl text-center space-y-4">
          <Bluetooth className="w-16 h-16 text-emerald-400/40 mx-auto animate-bounce" />
          <div className="max-w-md mx-auto">
            <h3 className="font-sans font-extrabold text-base text-white">Device Pairing Required</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              To trigger batting strokes and log release telemetry data, simulate connecting your str8bat IoT smart band sensor using Bluetooth Smart protocol.
            </p>
          </div>
          <button
            onClick={connectSensor}
            className="cursor-pointer bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs shadow-md shadow-emerald-500/10 hover:scale-[1.02] transition-transform"
          >
            Pair str8bat Sensor
          </button>
        </div>
      )}

      {sensorStatus === 'pairing' && (
        <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full mx-auto animate-spin" />
          <h3 className="font-sans font-extrabold text-sm text-slate-200">Syncing with sensor gyroscope...</h3>
          <p className="text-slate-500 text-xs font-mono">Bypassing BLE GATT encryption layers...</p>
        </div>
      )}

      {sensorStatus === 'connected' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Simulation Controls Panel */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 p-5 md:p-6 rounded-2xl flex flex-col justify-between space-y-6">
            
            {/* Header select of role */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <h3 className="font-sans font-bold text-sm text-white">Step 1: Select Sensor Discipline</h3>
                <div className="flex space-x-2 bg-slate-800/60 p-1 rounded-lg border border-slate-700/80">
                  <button
                    onClick={() => setSelectedRole('Batting')}
                    className={`cursor-pointer px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                      selectedRole === 'Batting' 
                        ? 'bg-emerald-500 text-slate-950 shadow' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Batting
                  </button>
                  <button
                    onClick={() => setSelectedRole('Bowling')}
                    className={`cursor-pointer px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                      selectedRole === 'Bowling' 
                        ? 'bg-lime-400 text-slate-950 shadow' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Bowling
                  </button>
                </div>
              </div>

              {/* Set session practice mode */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Session Mode</label>
                  <select
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value as SessionType)}
                    className="cursor-pointer bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-lg w-full"
                  >
                    <option value="Sensor Simulation">Sensor Simulation</option>
                    <option value="Net Practice">Net Practice</option>
                    <option value="Match">Match</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {selectedRole === 'Batting' ? 'Shot Selection' : 'Delivery Selection'}
                  </label>
                  {selectedRole === 'Batting' ? (
                    <select
                      value={shotType}
                      onChange={(e) => setShotType(e.target.value as any)}
                      className="cursor-pointer bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-lg w-full"
                    >
                      <option value="drive">Cover Drive / Straight</option>
                      <option value="pull">Pull Shot</option>
                      <option value="cut">Late Cut</option>
                      <option value="sweep">Sweep Shot</option>
                      <option value="defensive">Defensive Block</option>
                      <option value="flick">On-Flick</option>
                    </select>
                  ) : (
                    <select
                      value={bowlType}
                      onChange={(e) => setBowlType(e.target.value as any)}
                      className="cursor-pointer bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-lg w-full"
                    >
                      <option value="fast">Fast Seam Straight</option>
                      <option value="outswing">Outswinger</option>
                      <option value="inswing">Inswinger</option>
                      <option value="offcutter">Offcutter</option>
                      <option value="legcutter">Legcutter</option>
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Slider Adjustments */}
            <div className="space-y-5 bg-slate-800/20 p-4 rounded-xl border border-slate-800/60">
              <h3 className="font-sans font-bold text-sm text-white">Step 2: Customize Physical Velocity</h3>
              
              {selectedRole === 'Batting' ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-semibold">Downswing Speed</span>
                      <span className="font-bold text-emerald-400 font-mono">{batSpeed} km/h</span>
                    </div>
                    <input
                      type="range"
                      min="35"
                      max="125"
                      value={batSpeed}
                      onChange={(e) => setBatSpeed(Number(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-semibold">Sweet Spot Alignment</span>
                      <span className="font-bold text-lime-400 font-mono">{sweetSpot}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={sweetSpot}
                      onChange={(e) => setSweetSpot(Number(e.target.value))}
                      className="w-full accent-lime-400 bg-slate-800 h-1.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-semibold">Timing Accuracy</span>
                      <span className="font-bold text-sky-400 font-mono">{timing}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={timing}
                      onChange={(e) => setTiming(Number(e.target.value))}
                      className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-semibold">Release Ball Velocity</span>
                      <span className="font-bold text-lime-400 font-mono">{bowlSpeed} km/h</span>
                    </div>
                    <input
                      type="range"
                      min="75"
                      max="155"
                      value={bowlSpeed}
                      onChange={(e) => setBowlSpeed(Number(e.target.value))}
                      className="w-full accent-lime-400 bg-slate-800 h-1.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-semibold">Release Length Accuracy</span>
                      <span className="font-bold text-emerald-400 font-mono">{bowlAccuracy}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={bowlAccuracy}
                      onChange={(e) => setBowlAccuracy(Number(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Launch Actions */}
            <div className="flex gap-4">
              <button
                onClick={selectedRole === 'Batting' ? handleSwing : handleBowlLaunch}
                disabled={isSimulating}
                className="cursor-pointer flex-1 bg-gradient-to-r from-emerald-500 to-lime-400 disabled:from-slate-700 disabled:to-slate-800 text-slate-950 font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.01] transition-all"
              >
                {isSimulating 
                  ? 'Computing Gyro Packet...' 
                  : selectedRole === 'Batting' 
                    ? 'Execute Swing Gesture' 
                    : 'Launch Ball Release'}
              </button>

              <button
                onClick={saveCurrentSession}
                disabled={selectedRole === 'Batting' ? !simulatedShots.length : !simulatedDeliveries.length}
                className="cursor-pointer bg-slate-800 hover:bg-slate-750 disabled:bg-slate-900 disabled:text-slate-600 disabled:border-slate-800 text-emerald-400 font-bold px-6 py-3.5 rounded-xl text-xs border border-slate-700 shadow transition-all"
              >
                Save Session ({selectedRole === 'Batting' ? simulatedShots.length : simulatedDeliveries.length})
              </button>
            </div>
          </div>

          {/* Simulator Feedback Logs & Monitor Output */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Real-time telemetry monitor */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-black">TELEMETRY MONITOR INPUT</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Real-time packet logs from Bluetooth BLE GATT Server.</p>
              </div>

              {/* Shot list container */}
              <div className="flex-1 bg-slate-900/40 rounded-xl border border-slate-900 p-3 h-52 overflow-y-auto font-mono text-xs text-slate-400 space-y-2 scrollbar-none">
                {selectedRole === 'Batting' ? (
                  simulatedShots.length > 0 ? (
                    simulatedShots.map((shot, i) => (
                      <div key={i} className="border-b border-slate-900 pb-2 last:border-0 last:pb-0">
                        <div className="flex justify-between text-[11px] font-bold text-slate-200">
                          <span>Swing #{simulatedShots.length - i} ({shot.shotType.toUpperCase()})</span>
                          <span className="text-emerald-400">{shot.speed} km/h</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{shot.description}</p>
                        <div className="flex space-x-3 text-[9px] text-slate-500 mt-1 font-bold">
                          <span>SWEET: {shot.sweetSpot}%</span>
                          <span>TIMING: {shot.timing}%</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500">
                      <span>No swings logged. Adjust sliders and click "Execute Swing"</span>
                    </div>
                  )
                ) : (
                  simulatedDeliveries.length > 0 ? (
                    simulatedDeliveries.map((delivery, i) => (
                      <div key={i} className="border-b border-slate-900 pb-2 last:border-0 last:pb-0">
                        <div className="flex justify-between text-[11px] font-bold text-slate-200">
                          <span>Ball #{simulatedDeliveries.length - i} ({delivery.bowlType.toUpperCase()})</span>
                          <span className="text-lime-400">{delivery.speed} km/h</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{delivery.description}</p>
                        <div className="flex space-x-3 text-[9px] text-slate-500 mt-1 font-bold">
                          <span>LENGTH: {delivery.length.toUpperCase()}</span>
                          <span>LINE: {delivery.line.toUpperCase()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500">
                      <span>No releases logged. Adjust sliders and click "Launch Ball"</span>
                    </div>
                  )
                )}
              </div>

              {/* Quick instructions block */}
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex items-start space-x-2">
                <Info className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-400 leading-normal">
                  <strong>Session Saving Note</strong>: Trigger as many gestures as you like. When finished, hit <strong>"Save Session"</strong> to compile these shots and update your career statistics dashboard instantly!
                </p>
              </div>
            </div>

            {/* Connection Status Log Stream */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 h-44 flex flex-col">
              <span className="font-mono text-[9px] text-slate-400 tracking-widest font-black uppercase mb-2 block">Terminal Session Logs</span>
              <div className="flex-1 overflow-y-auto font-mono text-[10px] text-slate-500 space-y-1.5 scrollbar-none">
                {logs.map((log, index) => (
                  <p key={index} className={log.startsWith('✓') ? 'text-emerald-400/80' : log.includes('Saved') ? 'text-sky-400' : 'text-slate-500'}>
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
