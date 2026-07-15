import type { Food, GridDimensions, Position, Snake } from './types';

export type RandomNumberGenerator = () => number;

export function spawnFood(
  grid: GridDimensions,
  snake: Snake,
  random: RandomNumberGenerator = Math.random,
): Food | null {
  const availableCells = getUnoccupiedCells(grid, snake.segments);

  if (availableCells.length === 0) {
    return null;
  }

  return availableCells[getRandomIndex(availableCells.length, random)];
}

export function getUnoccupiedCells(
  grid: GridDimensions,
  occupiedPositions: readonly Position[],
): readonly Position[] {
  const occupiedCells = new Set(occupiedPositions.map(getPositionKey));
  const cells: Position[] = [];

  for (let row = 0; row < grid.rows; row += 1) {
    for (let column = 0; column < grid.columns; column += 1) {
      const position = { row, column };

      if (!occupiedCells.has(getPositionKey(position))) {
        cells.push(position);
      }
    }
  }

  return cells;
}

export function isPositionOccupied(
  position: Position,
  occupiedPositions: readonly Position[],
): boolean {
  return occupiedPositions.some(
    (occupiedPosition) =>
      occupiedPosition.row === position.row &&
      occupiedPosition.column === position.column,
  );
}

export function getPositionKey(position: Position): string {
  return `${position.row}:${position.column}`;
}

function getRandomIndex(
  availableCellCount: number,
  random: RandomNumberGenerator,
): number {
  const randomValue = random();
  const normalizedRandomValue = Number.isFinite(randomValue)
    ? Math.max(0, randomValue)
    : 0;

  return Math.min(
    Math.floor(normalizedRandomValue * availableCellCount),
    availableCellCount - 1,
  );
}
