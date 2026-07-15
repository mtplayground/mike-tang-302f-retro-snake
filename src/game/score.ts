import type { GameState, Score } from './types';

export const POINTS_PER_FOOD = 1;

export function createInitialScore(): Score {
  return 0;
}

export function incrementScore(
  currentScore: Score,
  points: Score = POINTS_PER_FOOD,
): Score {
  if (!Number.isFinite(currentScore) || currentScore < 0) {
    throw new Error('Current score must be a non-negative finite number.');
  }

  if (!Number.isFinite(points) || points < 0) {
    throw new Error('Score increment must be a non-negative finite number.');
  }

  return currentScore + points;
}

export function getCurrentScore(state: Pick<GameState, 'score'>): Score {
  return state.score;
}
