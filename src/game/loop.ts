import { detectCollision, type Collision } from './collision';
import { spawnFood, type RandomNumberGenerator } from './food';
import { incrementScore } from './score';
import type { Direction, GameState, Position, Snake } from './types';

export interface TickResult {
  readonly ateFood: boolean;
  readonly collision: Collision | null;
  readonly state: GameState;
}

export interface AdvanceGameTickOptions {
  readonly random?: RandomNumberGenerator;
}

export function advanceGameTick(
  state: GameState,
  options: AdvanceGameTickOptions = {},
): TickResult {
  if (state.status === 'game-over') {
    return {
      ateFood: false,
      collision: null,
      state,
    };
  }

  const movementDirection = state.snake.nextDirection;
  const nextHead = getNextHeadPosition(
    getSnakeHead(state.snake),
    movementDirection,
  );
  const ateFood = state.food !== null && positionsEqual(nextHead, state.food);
  const collision = detectCollision({
    grid: state.grid,
    nextHead,
    snake: state.snake,
    willGrow: ateFood,
  });

  if (collision !== null) {
    return {
      ateFood: false,
      collision,
      state: {
        ...state,
        status: 'game-over',
      },
    };
  }

  const nextSnake = advanceSnake(
    state.snake,
    nextHead,
    ateFood,
    movementDirection,
  );

  return {
    ateFood,
    collision: null,
    state: {
      ...state,
      food: ateFood
        ? spawnFood(state.grid, nextSnake, options.random)
        : state.food,
      score: ateFood ? incrementScore(state.score) : state.score,
      snake: nextSnake,
    },
  };
}

export function advanceSnake(
  snake: Snake,
  nextHead: Position,
  shouldGrow: boolean,
  direction: Direction = snake.nextDirection,
): Snake {
  const nextSegments = [nextHead, ...snake.segments];

  return {
    ...snake,
    direction,
    nextDirection: direction,
    segments: shouldGrow
      ? nextSegments
      : nextSegments.slice(0, snake.segments.length),
  };
}

export function getNextHeadPosition(
  head: Position,
  direction: Direction,
): Position {
  switch (direction) {
    case 'up':
      return { row: head.row - 1, column: head.column };
    case 'right':
      return { row: head.row, column: head.column + 1 };
    case 'down':
      return { row: head.row + 1, column: head.column };
    case 'left':
      return { row: head.row, column: head.column - 1 };
  }
}

export function getSnakeHead(snake: Snake): Position {
  const [head] = snake.segments;

  if (!head) {
    throw new Error('Snake must contain at least one segment.');
  }

  return head;
}

export function positionsEqual(left: Position, right: Position): boolean {
  return left.row === right.row && left.column === right.column;
}
