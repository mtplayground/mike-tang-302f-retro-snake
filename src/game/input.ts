import type { Direction, GameState, Snake } from './types';

const KEY_DIRECTIONS = new Map<string, Direction>([
  ['ArrowUp', 'up'],
  ['ArrowRight', 'right'],
  ['ArrowDown', 'down'],
  ['ArrowLeft', 'left'],
  ['w', 'up'],
  ['d', 'right'],
  ['s', 'down'],
  ['a', 'left'],
]);

export interface KeyboardDirectionInputOptions {
  readonly getState: () => GameState;
  readonly onStateChange: (state: GameState) => void;
  readonly target?: Window | Document;
}

export function createKeyboardDirectionInputHandler({
  getState,
  onStateChange,
  target = window,
}: KeyboardDirectionInputOptions): () => void {
  const handleKeyDown: EventListener = (event) => {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    const requestedDirection = getDirectionFromKey(event.key);

    if (requestedDirection === null) {
      return;
    }

    event.preventDefault();

    const state = getState();
    const nextState = queueDirectionForState(state, requestedDirection);

    if (nextState !== state) {
      onStateChange(nextState);
    }
  };

  target.addEventListener('keydown', handleKeyDown);

  return () => {
    target.removeEventListener('keydown', handleKeyDown);
  };
}

export function queueDirectionForState(
  state: GameState,
  direction: Direction,
): GameState {
  const snake = queueDirectionForSnake(state.snake, direction);

  if (snake === state.snake) {
    return state;
  }

  return {
    ...state,
    snake,
  };
}

export function queueDirectionForSnake(
  snake: Snake,
  direction: Direction,
): Snake {
  if (!canQueueDirection(snake, direction)) {
    return snake;
  }

  return {
    ...snake,
    nextDirection: direction,
  };
}

export function canQueueDirection(snake: Snake, direction: Direction): boolean {
  return (
    snake.segments.length <= 1 ||
    !areOppositeDirections(snake.direction, direction)
  );
}

export function getDirectionFromKey(key: string): Direction | null {
  return (
    KEY_DIRECTIONS.get(key) ?? KEY_DIRECTIONS.get(key.toLowerCase()) ?? null
  );
}

export function areOppositeDirections(
  first: Direction,
  second: Direction,
): boolean {
  return (
    (first === 'up' && second === 'down') ||
    (first === 'down' && second === 'up') ||
    (first === 'left' && second === 'right') ||
    (first === 'right' && second === 'left')
  );
}
