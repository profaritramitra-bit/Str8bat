export type PlayerLevel = 'Amateur' | 'Professional';
export type PlayerRole = 'Batsman' | 'Bowler' | 'All-Rounder';
export type SessionType = 'Net Practice' | 'Match' | 'Sensor Simulation';

export interface PlayerProfile {
  id: string;
  name: string;
  level: PlayerLevel;
  role: PlayerRole;
  battingStyle: string;
  bowlingStyle: string;
  avatar: string;
  joinedDate: string;
  goals: string[];
}

export interface BattingSession {
  id: string;
  playerId: string;
  playerName: string;
  playerLevel: PlayerLevel;
  timestamp: string;
  sessionType: SessionType;
  totalShots: number;
  avgBatSpeed: number; // km/h
  maxBatSpeed: number; // km/h
  avgSweetSpot: number; // % (0-100)
  timingAccuracy: number; // % (0-100)
  backliftAngle: number; // degrees
  downswingAngle: number; // degrees
  impactAngle: number; // degrees (-ve is closed, +ve is open, 0 is square)
  wagonWheel: {
    offSide: number;
    legSide: number;
    straight: number;
    covers: number;
    midWicket: number;
    behind: number;
  };
  shotTypes: {
    drive: number;
    pull: number;
    cut: number;
    sweep: number;
    defensive: number;
    flick: number;
  };
}

export interface BowlingSession {
  id: string;
  playerId: string;
  playerName: string;
  playerLevel: PlayerLevel;
  timestamp: string;
  sessionType: SessionType;
  totalDeliveries: number;
  avgReleaseSpeed: number; // km/h
  maxReleaseSpeed: number; // km/h
  avgReleaseHeight: number; // meters
  avgSpinRate?: number; // RPM (for spin bowlers)
  seamAngle: number; // degrees
  accuracyPercentage: number; // % in target zones
  lengthsDistribution: {
    short: number;
    good: number;
    full: number;
    yorker: number;
  };
  linesDistribution: {
    wideOff: number;
    outsideOff: number;
    onStumps: number;
    downLeg: number;
  };
  deliveryTypes: {
    fast: number;
    outswing: number;
    inswing: number;
    offcutter: number;
    legcutter: number;
    bouncer?: number;
  };
}

export interface MockData {
  battingSessions: BattingSession[];
  bowlingSessions: BowlingSession[];
  players: PlayerProfile[];
}
