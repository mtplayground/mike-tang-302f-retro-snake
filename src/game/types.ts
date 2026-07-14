export type Direction = 'up' | 'right' | 'down' | 'left';

export type GameStatus = 'ready';

export interface Position {
  readonly row: number;
  readonly column: number;
}

export type SnakeSegment = Position;

export type Food = Position;

export interface GridDimensions {
  readonly rows: number;
  readonly columns: number;
}

export interface Snake {
  readonly direction: Direction;
  readonly segments: readonly SnakeSegment[];
}

export interface GameState {
  readonly grid: GridDimensions;
  readonly food: Food | null;
  readonly snake: Snake;
  readonly status: GameStatus;
}
