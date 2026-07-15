import {
  GRID_DIMENSIONS,
  INITIAL_DIRECTION,
  INITIAL_SNAKE_HEAD,
  INITIAL_SNAKE_LENGTH,
} from './config';
import { spawnFood, type RandomNumberGenerator } from './food';
import { createInitialScore } from './score';
import type { GameState, GridDimensions, Position, Snake } from './types';

export interface CreateInitialGameStateOptions {
  readonly random?: RandomNumberGenerator;
}

export function createInitialGameState(
  options: CreateInitialGameStateOptions = {},
): GameState {
  const grid = { ...GRID_DIMENSIONS };
  const snake = createInitialSnake();

  return {
    grid,
    food: spawnFood(grid, snake, options.random),
    score: createInitialScore(),
    snake,
    status: 'ready',
  };
}

export function createInitialSnake(): Snake {
  return {
    direction: INITIAL_DIRECTION,
    nextDirection: INITIAL_DIRECTION,
    segments: createInitialSnakeSegments(
      GRID_DIMENSIONS,
      INITIAL_SNAKE_HEAD,
      INITIAL_SNAKE_LENGTH,
    ),
  };
}

export function createInitialSnakeSegments(
  grid: GridDimensions,
  head: Position,
  length: number,
): readonly Position[] {
  if (!Number.isInteger(length) || length < 1) {
    throw new Error('Initial snake length must be a positive integer.');
  }

  const tailColumn = head.column - (length - 1);

  if (
    head.row < 0 ||
    head.row >= grid.rows ||
    tailColumn < 0 ||
    head.column >= grid.columns
  ) {
    throw new Error('Initial snake spawn does not fit inside the grid.');
  }

  return Array.from({ length }, (_, index) => ({
    row: head.row,
    column: head.column - index,
  }));
}
