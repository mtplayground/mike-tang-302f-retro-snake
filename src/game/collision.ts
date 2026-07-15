import { isPositionOccupied } from './food';
import type { GridDimensions, Position, Snake } from './types';

export type CollisionType = 'wall' | 'self';

export interface Collision {
  readonly position: Position;
  readonly type: CollisionType;
}

export interface DetectCollisionOptions {
  readonly grid: GridDimensions;
  readonly nextHead: Position;
  readonly snake: Snake;
  readonly willGrow: boolean;
}

export function detectCollision({
  grid,
  nextHead,
  snake,
  willGrow,
}: DetectCollisionOptions): Collision | null {
  if (isWallCollision(nextHead, grid)) {
    return {
      position: nextHead,
      type: 'wall',
    };
  }

  if (isSelfCollision(nextHead, snake, willGrow)) {
    return {
      position: nextHead,
      type: 'self',
    };
  }

  return null;
}

export function isWallCollision(
  position: Position,
  grid: GridDimensions,
): boolean {
  return (
    position.row < 0 ||
    position.row >= grid.rows ||
    position.column < 0 ||
    position.column >= grid.columns
  );
}

export function isSelfCollision(
  nextHead: Position,
  snake: Snake,
  willGrow: boolean,
): boolean {
  const occupiedSegments = willGrow
    ? snake.segments
    : snake.segments.slice(0, -1);

  return isPositionOccupied(nextHead, occupiedSegments);
}
