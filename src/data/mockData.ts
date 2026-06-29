import { BattingSession, BowlingSession, PlayerProfile } from '../types';

export const INITIAL_PLAYERS: PlayerProfile[] = [
  {
    id: 'p1',
    name: 'Aarav Patel',
    level: 'Amateur',
    role: 'All-Rounder',
    battingStyle: 'Right-hand Bat',
    bowlingStyle: 'Right-arm Fast Medium',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2026-01-15',
    goals: ['Increase average bat speed to 75 km/h', 'Improve sweet spot contact to 80%', 'Improve length consistency']
  },
  {
    id: 'p2',
    name: 'Marcus Stoinis',
    level: 'Professional',
    role: 'All-Rounder',
    battingStyle: 'Right-hand Bat',
    bowlingStyle: 'Right-arm Fast Medium',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2024-05-10',
    goals: ['Maintain bat speed > 90 km/h in death overs', 'Achieve 92% timing accuracy', 'Execute yorkers with 85% accuracy']
  }
];

export const BENCHMARKS = {
  Amateur: {
    batting: {
      avgSpeed: 62,
      maxSpeed: 78,
      sweetSpot: 65,
      timing: 60,
      backlift: 48,
    },
    bowling: {
      avgSpeed: 105,
      maxSpeed: 115,
      accuracy: 55,
      spinRate: 1100,
    }
  },
  Professional: {
    batting: {
      avgSpeed: 88,
      maxSpeed: 112,
      sweetSpot: 88,
      timing: 85,
      backlift: 65,
    },
    bowling: {
      avgSpeed: 138,
      maxSpeed: 148,
      accuracy: 82,
      spinRate: 2200,
    }
  }
};

export const INITIAL_BATTING_SESSIONS: BattingSession[] = [
  // Aarav (Amateur) Sessions
  {
    id: 'bat_am_1',
    playerId: 'p1',
    playerName: 'Aarav Patel',
    playerLevel: 'Amateur',
    timestamp: '2026-06-10T15:30:00Z',
    sessionType: 'Net Practice',
    totalShots: 30,
    avgBatSpeed: 58.4,
    maxBatSpeed: 72.1,
    avgSweetSpot: 55,
    timingAccuracy: 52,
    backliftAngle: 42,
    downswingAngle: 38,
    impactAngle: -4,
    wagonWheel: {
      offSide: 8,
      legSide: 12,
      straight: 4,
      covers: 3,
      midWicket: 2,
      behind: 1
    },
    shotTypes: {
      drive: 8,
      pull: 5,
      cut: 4,
      sweep: 2,
      defensive: 9,
      flick: 2
    }
  },
  {
    id: 'bat_am_2',
    playerId: 'p1',
    playerName: 'Aarav Patel',
    playerLevel: 'Amateur',
    timestamp: '2026-06-18T10:00:00Z',
    sessionType: 'Net Practice',
    totalShots: 40,
    avgBatSpeed: 61.2,
    maxBatSpeed: 76.5,
    avgSweetSpot: 62,
    timingAccuracy: 58,
    backliftAngle: 45,
    downswingAngle: 41,
    impactAngle: -2,
    wagonWheel: {
      offSide: 12,
      legSide: 15,
      straight: 6,
      covers: 4,
      midWicket: 2,
      behind: 1
    },
    shotTypes: {
      drive: 12,
      pull: 8,
      cut: 5,
      sweep: 3,
      defensive: 10,
      flick: 2
    }
  },
  {
    id: 'bat_am_3',
    playerId: 'p1',
    playerName: 'Aarav Patel',
    playerLevel: 'Amateur',
    timestamp: '2026-06-25T17:15:00Z',
    sessionType: 'Match',
    totalShots: 25,
    avgBatSpeed: 64.8,
    maxBatSpeed: 81.2,
    avgSweetSpot: 68,
    timingAccuracy: 64,
    backliftAngle: 48,
    downswingAngle: 43,
    impactAngle: 1,
    wagonWheel: {
      offSide: 9,
      legSide: 6,
      straight: 5,
      covers: 3,
      midWicket: 1,
      behind: 1
    },
    shotTypes: {
      drive: 9,
      pull: 3,
      cut: 3,
      sweep: 1,
      defensive: 7,
      flick: 2
    }
  },

  // Marcus (Professional) Sessions
  {
    id: 'bat_pro_1',
    playerId: 'p2',
    playerName: 'Marcus Stoinis',
    playerLevel: 'Professional',
    timestamp: '2026-06-12T14:00:00Z',
    sessionType: 'Net Practice',
    totalShots: 50,
    avgBatSpeed: 86.5,
    maxBatSpeed: 108.2,
    avgSweetSpot: 84,
    timingAccuracy: 81,
    backliftAngle: 62,
    downswingAngle: 58,
    impactAngle: 0,
    wagonWheel: {
      offSide: 14,
      legSide: 16,
      straight: 10,
      covers: 5,
      midWicket: 3,
      behind: 2
    },
    shotTypes: {
      drive: 15,
      pull: 11,
      cut: 8,
      sweep: 4,
      defensive: 6,
      flick: 6
    }
  },
  {
    id: 'bat_pro_2',
    playerId: 'p2',
    playerName: 'Marcus Stoinis',
    playerLevel: 'Professional',
    timestamp: '2026-06-20T11:30:00Z',
    sessionType: 'Match',
    totalShots: 35,
    avgBatSpeed: 89.1,
    maxBatSpeed: 112.4,
    avgSweetSpot: 89,
    timingAccuracy: 86,
    backliftAngle: 65,
    downswingAngle: 60,
    impactAngle: 1,
    wagonWheel: {
      offSide: 11,
      legSide: 9,
      straight: 8,
      covers: 4,
      midWicket: 2,
      behind: 1
    },
    shotTypes: {
      drive: 12,
      pull: 9,
      cut: 4,
      sweep: 2,
      defensive: 4,
      flick: 4
    }
  },
  {
    id: 'bat_pro_3',
    playerId: 'p2',
    playerName: 'Marcus Stoinis',
    playerLevel: 'Professional',
    timestamp: '2026-06-27T19:00:00Z',
    sessionType: 'Match',
    totalShots: 45,
    avgBatSpeed: 91.2,
    maxBatSpeed: 116.8,
    avgSweetSpot: 91,
    timingAccuracy: 88,
    backliftAngle: 66,
    downswingAngle: 61,
    impactAngle: 0,
    wagonWheel: {
      offSide: 13,
      legSide: 12,
      straight: 11,
      covers: 5,
      midWicket: 3,
      behind: 1
    },
    shotTypes: {
      drive: 16,
      pull: 10,
      cut: 6,
      sweep: 3,
      defensive: 3,
      flick: 7
    }
  }
];

export const INITIAL_BOWLING_SESSIONS: BowlingSession[] = [
  // Aarav (Amateur) Sessions
  {
    id: 'bowl_am_1',
    playerId: 'p1',
    playerName: 'Aarav Patel',
    playerLevel: 'Amateur',
    timestamp: '2026-06-11T16:00:00Z',
    sessionType: 'Net Practice',
    totalDeliveries: 24,
    avgReleaseSpeed: 102.5,
    maxReleaseSpeed: 110.2,
    avgReleaseHeight: 1.82,
    seamAngle: 12,
    accuracyPercentage: 50,
    lengthsDistribution: {
      short: 6,
      good: 10,
      full: 6,
      yorker: 2
    },
    linesDistribution: {
      wideOff: 4,
      outsideOff: 8,
      onStumps: 7,
      downLeg: 5
    },
    deliveryTypes: {
      fast: 12,
      outswing: 6,
      inswing: 4,
      offcutter: 2,
      legcutter: 0
    }
  },
  {
    id: 'bowl_am_2',
    playerId: 'p1',
    playerName: 'Aarav Patel',
    playerLevel: 'Amateur',
    timestamp: '2026-06-19T09:30:00Z',
    sessionType: 'Net Practice',
    totalDeliveries: 30,
    avgReleaseSpeed: 106.8,
    maxReleaseSpeed: 114.5,
    avgReleaseHeight: 1.84,
    seamAngle: 14,
    accuracyPercentage: 56,
    lengthsDistribution: {
      short: 5,
      good: 15,
      full: 7,
      yorker: 3
    },
    linesDistribution: {
      wideOff: 3,
      outsideOff: 11,
      onStumps: 11,
      downLeg: 5
    },
    deliveryTypes: {
      fast: 15,
      outswing: 8,
      inswing: 4,
      offcutter: 3,
      legcutter: 0
    }
  },

  // Marcus (Professional) Sessions
  {
    id: 'bowl_pro_1',
    playerId: 'p2',
    playerName: 'Marcus Stoinis',
    playerLevel: 'Professional',
    timestamp: '2026-06-13T16:30:00Z',
    sessionType: 'Net Practice',
    totalDeliveries: 36,
    avgReleaseSpeed: 132.4,
    maxReleaseSpeed: 139.8,
    avgReleaseHeight: 1.91,
    seamAngle: 18,
    accuracyPercentage: 78,
    lengthsDistribution: {
      short: 5,
      good: 22,
      full: 6,
      yorker: 3
    },
    linesDistribution: {
      wideOff: 2,
      outsideOff: 18,
      onStumps: 14,
      downLeg: 2
    },
    deliveryTypes: {
      fast: 18,
      outswing: 8,
      inswing: 6,
      offcutter: 4,
      legcutter: 0
    }
  },
  {
    id: 'bowl_pro_2',
    playerId: 'p2',
    playerName: 'Marcus Stoinis',
    playerLevel: 'Professional',
    timestamp: '2026-06-22T15:00:00Z',
    sessionType: 'Match',
    totalDeliveries: 24,
    avgReleaseSpeed: 136.2,
    maxReleaseSpeed: 142.1,
    avgReleaseHeight: 1.93,
    seamAngle: 21,
    accuracyPercentage: 83,
    lengthsDistribution: {
      short: 3,
      good: 16,
      full: 3,
      yorker: 2
    },
    linesDistribution: {
      wideOff: 1,
      outsideOff: 12,
      onStumps: 10,
      downLeg: 1
    },
    deliveryTypes: {
      fast: 12,
      outswing: 5,
      inswing: 4,
      offcutter: 3,
      legcutter: 0
    }
  }
];

export function getStoredData() {
  if (typeof window === 'undefined') return {
    players: INITIAL_PLAYERS,
    battingSessions: INITIAL_BATTING_SESSIONS,
    bowlingSessions: INITIAL_BOWLING_SESSIONS
  };

  const players = localStorage.getItem('str8bat_players');
  const batting = localStorage.getItem('str8bat_batting');
  const bowling = localStorage.getItem('str8bat_bowling');

  return {
    players: players ? JSON.parse(players) : INITIAL_PLAYERS,
    battingSessions: batting ? JSON.parse(batting) : INITIAL_BATTING_SESSIONS,
    bowlingSessions: bowling ? JSON.parse(bowling) : INITIAL_BOWLING_SESSIONS
  };
}

export function saveStoredData(players: PlayerProfile[], batting: BattingSession[], bowling: BowlingSession[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('str8bat_players', JSON.stringify(players));
  localStorage.setItem('str8bat_batting', JSON.stringify(batting));
  localStorage.setItem('str8bat_bowling', JSON.stringify(bowling));
}
