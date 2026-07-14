import type { Direction, GameState, Position, Snake } from './types';

export interface TickResult {
  readonly ateFood: boolean;
  readonly state: GameState;
}

export function advanceGameTick(state: GameState): TickResult {
  const movementDirection = state.snake.nextDirection;
  const nextHead = getNextHeadPosition(
    getSnakeHead(state.snake),
    movementDirection,
  );
  const ateFood = state.food !== null && positionsEqual(nextHead, state.food);
  const nextSnake = advanceSnake(
    state.snake,
    nextHead,
    ateFood,
    movementDirection,
  );

  return {
    ateFood,
    state: {
      ...state,
      food: ateFood ? null : state.food,
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
