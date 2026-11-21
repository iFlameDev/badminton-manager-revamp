import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BADMINTON_SCORING_VERSION,
  getMatchWinner,
  isMatchComplete,
  isValidTargetPoints,
  validateGameScore
} from '../src/lib/badmintonScoring.js';
import { useTournamentStore } from '../src/store/useTournamentStore.js';

test('accepts valid configurable target points from 1 through 30', () => {
  assert.equal(isValidTargetPoints(1), true);
  assert.equal(isValidTargetPoints(21), true);
  assert.equal(isValidTargetPoints(30), true);
  assert.equal(isValidTargetPoints(0), false);
  assert.equal(isValidTargetPoints(31), false);
  assert.equal(isValidTargetPoints(21.5), false);
});

test('a game is valid only when exactly one side reaches the target', () => {
  assert.equal(validateGameScore(21, 18, 21), null);
  assert.equal(validateGameScore(15, 11, 15), null);
  assert.match(validateGameScore(20, 18, 21), /tepat 21 poin/);
  assert.match(validateGameScore(21, 21, 21), /tepat 21 poin/);
  assert.match(validateGameScore(22, 18, 21), /tepat 21 poin/);
  assert.match(validateGameScore(-1, 21, 21), /bilangan bulat/);
  assert.match(validateGameScore(21.5, 10, 21), /bilangan bulat/);
  assert.match(validateGameScore(21, 10, 0), /antara 1 dan 30/);
});

test('winner and completion follow the saved target instead of current config', () => {
  const match = {
    score1: 15,
    score2: 12,
    targetPoints: 15,
    scoringVersion: BADMINTON_SCORING_VERSION
  };

  assert.equal(getMatchWinner(match, 21), 1);
  assert.equal(isMatchComplete(match, 21), true);
  assert.equal(isMatchComplete({ ...match, score1: null }, 21), false);
  assert.equal(getMatchWinner({ ...match, score1: 14 }, 21), null);
  assert.equal(isMatchComplete({ scoringVersion: 2 }, 21), false);
});

test('legacy saved scores remain completed until edited as badminton scores', () => {
  const legacyMatch = { score1: 12, score2: 9 };

  assert.equal(isMatchComplete(legacyMatch, 21), true);
  assert.equal(getMatchWinner(legacyMatch, 21), 1);
  assert.equal(isMatchComplete({ score1: null, score2: null }, 21), false);
});

test('store saves actual scores and uses them for leaderboard points and results', () => {
  useTournamentStore.setState({
    config: { ...useTournamentStore.getState().config, maxPoints: 21 },
    numCourts: 1,
    currentRound: 1,
    tournamentId: null,
    teams: [],
    players: [1, 2, 3, 4].map((id) => ({
      id,
      name: `Player ${id}`,
      tier: '-',
      isWalkout: false,
      status: 'playing',
      court: 1
    })),
    matches: {
      'r1-c1': {
        round: 1,
        court: 1,
        t1: [1, 2],
        t2: [3, 4],
        score1: null,
        score2: null,
        targetPoints: 21,
        scoringVersion: BADMINTON_SCORING_VERSION
      }
    }
  });

  assert.equal(useTournamentStore.getState().setScore('r1-c1', 21, 17), true);
  assert.equal(useTournamentStore.getState().matches['r1-c1'].score2, 17);
  const { stats } = useTournamentStore.getState().getLeaderboardStats();
  assert.equal(stats[1].points, 21);
  assert.equal(stats[1].diff, 4);
  assert.equal(stats[1].wins, 1);
  assert.equal(stats[3].points, 17);
  assert.equal(stats[3].losses, 1);
});
