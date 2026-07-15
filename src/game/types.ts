export type Direction = 'up' | 'right' | 'down' | 'left';

export type GameStatus = 'ready' | 'game-over';

export interface Position {
  readonly row: number;
  readonly column: number;
}

export type SnakeSegment = Position;

export type Food = Position;

export type Score = number;

export interface GridDimensions {
  readonly rows: number;
  readonly columns: number;
}

export interface Snake {
  readonly direction: Direction;
  readonly nextDirection: Direction;
  readonly segments: readonly SnakeSegment[];
}

export interface GameState {
  readonly grid: GridDimensions;
  readonly food: Food | null;
  readonly score: Score;
  readonly snake: Snake;
  readonly status: GameStatus;
}
