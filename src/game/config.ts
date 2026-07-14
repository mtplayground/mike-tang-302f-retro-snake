import type { Direction, GridDimensions, Position } from './types';

export const GRID_DIMENSIONS: GridDimensions = {
  rows: 20,
  columns: 20,
};

export const INITIAL_SNAKE_LENGTH = 4;

export const INITIAL_DIRECTION: Direction = 'right';

export const INITIAL_SNAKE_HEAD: Position = {
  row: Math.floor(GRID_DIMENSIONS.rows / 2),
  column: Math.floor(GRID_DIMENSIONS.columns / 2),
};
