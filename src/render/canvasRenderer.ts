import { GRID_DIMENSIONS } from '../game/config';
import type {
  Food,
  GameState,
  GridDimensions,
  Position,
  Snake,
} from '../game/types';

export const DEFAULT_CELL_SIZE = 24;

export interface CanvasGridTheme {
  readonly backgroundColor: string;
  readonly borderColor: string;
  readonly gridLineColor: string;
  readonly gridLineWidth: number;
}

export interface CanvasEntityTheme {
  readonly foodCoreColor: string;
  readonly foodOuterColor: string;
  readonly snakeBodyColor: string;
  readonly snakeHeadColor: string;
  readonly snakeHighlightColor: string;
  readonly snakeShadowColor: string;
}

export interface CanvasGridMetrics {
  readonly cellSize: number;
  readonly height: number;
  readonly width: number;
}

export interface RenderCanvasGridOptions {
  readonly cellSize?: number;
  readonly grid?: GridDimensions;
  readonly theme?: Partial<CanvasGridTheme>;
}

export interface RenderCanvasGameOptions extends RenderCanvasGridOptions {
  readonly entityTheme?: Partial<CanvasEntityTheme>;
}

export const DEFAULT_CANVAS_GRID_THEME: CanvasGridTheme = {
  backgroundColor: '#000000',
  borderColor: '#1f2937',
  gridLineColor: '#123a25',
  gridLineWidth: 2,
};

export const DEFAULT_CANVAS_ENTITY_THEME: CanvasEntityTheme = {
  foodCoreColor: '#ffffff',
  foodOuterColor: '#ff274f',
  snakeBodyColor: '#39ff14',
  snakeHeadColor: '#a6ff4d',
  snakeHighlightColor: '#eaffcf',
  snakeShadowColor: '#0b6b21',
};

export function renderCanvasGameState(
  canvas: HTMLCanvasElement,
  state: GameState,
  options: RenderCanvasGameOptions = {},
): CanvasGridMetrics {
  const metrics = renderCanvasGrid(canvas, {
    cellSize: options.cellSize,
    grid: state.grid,
    theme: options.theme,
  });
  const context = getCanvasRenderingContext(canvas);
  const entityTheme = {
    ...DEFAULT_CANVAS_ENTITY_THEME,
    ...options.entityTheme,
  };

  drawFood(context, state.food, metrics, entityTheme);
  drawSnake(context, state.snake, metrics, entityTheme);

  return metrics;
}

export function renderCanvasGrid(
  canvas: HTMLCanvasElement,
  options: RenderCanvasGridOptions = {},
): CanvasGridMetrics {
  const grid = options.grid ?? GRID_DIMENSIONS;
  const cellSize = options.cellSize ?? DEFAULT_CELL_SIZE;
  const theme = {
    ...DEFAULT_CANVAS_GRID_THEME,
    ...options.theme,
  };
  const metrics = getCanvasGridMetrics(grid, cellSize);
  const context = getCanvasRenderingContext(canvas);

  resizeCanvas(canvas, metrics);
  clearCanvas(context, metrics);
  drawPlayfield(context, metrics, theme);
  drawGridLines(context, grid, metrics, theme);
  drawGridBorder(context, metrics, theme);

  return metrics;
}

export function drawSnake(
  context: CanvasRenderingContext2D,
  snake: Snake,
  metrics: CanvasGridMetrics,
  theme: CanvasEntityTheme = DEFAULT_CANVAS_ENTITY_THEME,
): void {
  snake.segments.forEach((segment, index) => {
    drawSnakeSegment(context, segment, index === 0, metrics, theme);
  });
}

export function drawFood(
  context: CanvasRenderingContext2D,
  food: Food | null,
  metrics: CanvasGridMetrics,
  theme: CanvasEntityTheme = DEFAULT_CANVAS_ENTITY_THEME,
): void {
  if (food === null) {
    return;
  }

  const bounds = getCellBounds(food, metrics);
  const outerInset = getPixelInset(metrics.cellSize, 0.25, 4);
  const coreInset = getPixelInset(metrics.cellSize, 0.36, 7);

  context.fillStyle = theme.foodOuterColor;
  context.fillRect(
    bounds.x + outerInset,
    bounds.y + outerInset,
    bounds.size - outerInset * 2,
    bounds.size - outerInset * 2,
  );

  context.fillStyle = theme.foodCoreColor;
  context.fillRect(
    bounds.x + coreInset,
    bounds.y + coreInset,
    bounds.size - coreInset * 2,
    bounds.size - coreInset * 2,
  );
}

export function getCanvasGridMetrics(
  grid: GridDimensions,
  cellSize: number = DEFAULT_CELL_SIZE,
): CanvasGridMetrics {
  assertPositiveInteger(grid.rows, 'Grid row count');
  assertPositiveInteger(grid.columns, 'Grid column count');
  assertPositiveInteger(cellSize, 'Cell size');

  return {
    cellSize,
    height: grid.rows * cellSize,
    width: grid.columns * cellSize,
  };
}

export function clearCanvas(
  context: CanvasRenderingContext2D,
  metrics: CanvasGridMetrics,
): void {
  context.clearRect(0, 0, metrics.width, metrics.height);
}

export function drawPlayfield(
  context: CanvasRenderingContext2D,
  metrics: CanvasGridMetrics,
  theme: CanvasGridTheme = DEFAULT_CANVAS_GRID_THEME,
): void {
  context.imageSmoothingEnabled = false;
  context.fillStyle = theme.backgroundColor;
  context.fillRect(0, 0, metrics.width, metrics.height);
}

export function drawGridLines(
  context: CanvasRenderingContext2D,
  grid: GridDimensions,
  metrics: CanvasGridMetrics,
  theme: CanvasGridTheme = DEFAULT_CANVAS_GRID_THEME,
): void {
  assertPositiveInteger(theme.gridLineWidth, 'Grid line width');

  context.fillStyle = theme.gridLineColor;

  for (let column = 0; column <= grid.columns; column += 1) {
    const x = getLinePosition(column, metrics.cellSize, metrics.width, theme);
    context.fillRect(x, 0, theme.gridLineWidth, metrics.height);
  }

  for (let row = 0; row <= grid.rows; row += 1) {
    const y = getLinePosition(row, metrics.cellSize, metrics.height, theme);
    context.fillRect(0, y, metrics.width, theme.gridLineWidth);
  }
}

export function drawGridBorder(
  context: CanvasRenderingContext2D,
  metrics: CanvasGridMetrics,
  theme: CanvasGridTheme = DEFAULT_CANVAS_GRID_THEME,
): void {
  context.strokeStyle = theme.borderColor;
  context.lineWidth = theme.gridLineWidth;
  context.strokeRect(
    theme.gridLineWidth / 2,
    theme.gridLineWidth / 2,
    metrics.width - theme.gridLineWidth,
    metrics.height - theme.gridLineWidth,
  );
}

function resizeCanvas(
  canvas: HTMLCanvasElement,
  metrics: CanvasGridMetrics,
): void {
  canvas.width = metrics.width;
  canvas.height = metrics.height;
  canvas.style.aspectRatio = `${metrics.width} / ${metrics.height}`;
  canvas.style.height = '100%';
  canvas.style.width = '100%';
}

function getCanvasRenderingContext(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D {
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('2D canvas rendering context is not available.');
  }

  return context;
}

function getLinePosition(
  index: number,
  cellSize: number,
  maxSize: number,
  theme: CanvasGridTheme,
): number {
  return Math.min(index * cellSize, maxSize - theme.gridLineWidth);
}

function drawSnakeSegment(
  context: CanvasRenderingContext2D,
  segment: Position,
  isHead: boolean,
  metrics: CanvasGridMetrics,
  theme: CanvasEntityTheme,
): void {
  const bounds = getCellBounds(segment, metrics);
  const inset = getPixelInset(metrics.cellSize, 0.14, 2);
  const bodySize = bounds.size - inset * 2;
  const highlightSize = Math.min(
    bodySize,
    Math.max(1, Math.floor(metrics.cellSize * 0.22)),
  );
  const shadowOffset = Math.min(2, inset);
  const highlightOffset = Math.min(3, Math.max(0, bodySize - highlightSize));

  context.fillStyle = theme.snakeShadowColor;
  context.fillRect(
    bounds.x + inset + shadowOffset,
    bounds.y + inset + shadowOffset,
    bodySize,
    bodySize,
  );

  context.fillStyle = isHead ? theme.snakeHeadColor : theme.snakeBodyColor;
  context.fillRect(bounds.x + inset, bounds.y + inset, bodySize, bodySize);

  context.fillStyle = theme.snakeHighlightColor;
  context.fillRect(
    bounds.x + inset + highlightOffset,
    bounds.y + inset + highlightOffset,
    highlightSize,
    highlightSize,
  );
}

function getPixelInset(
  cellSize: number,
  ratio: number,
  minimum: number,
): number {
  const maximum = Math.max(0, Math.floor((cellSize - 1) / 2));

  return Math.min(Math.max(minimum, Math.floor(cellSize * ratio)), maximum);
}

function getCellBounds(
  position: Position,
  metrics: CanvasGridMetrics,
): { readonly size: number; readonly x: number; readonly y: number } {
  return {
    size: metrics.cellSize,
    x: position.column * metrics.cellSize,
    y: position.row * metrics.cellSize,
  };
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${label} must be a positive integer.`);
  }
}
