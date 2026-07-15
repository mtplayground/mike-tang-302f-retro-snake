import { GRID_DIMENSIONS } from '../game/config';
import type { GridDimensions } from '../game/types';

export const DEFAULT_CELL_SIZE = 24;

export interface CanvasGridTheme {
  readonly backgroundColor: string;
  readonly borderColor: string;
  readonly gridLineColor: string;
  readonly gridLineWidth: number;
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

export const DEFAULT_CANVAS_GRID_THEME: CanvasGridTheme = {
  backgroundColor: '#000000',
  borderColor: '#1f2937',
  gridLineColor: '#123a25',
  gridLineWidth: 2,
};

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
  canvas.style.width = `${metrics.width}px`;
  canvas.style.height = `${metrics.height}px`;
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

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${label} must be a positive integer.`);
  }
}
