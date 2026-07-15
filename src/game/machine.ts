import type { RandomNumberGenerator } from './food';
import {
  createInitialGameState,
  type CreateInitialGameStateOptions,
} from './state';
import type { GameState } from './types';

export interface GameOverRestartInputOptions {
  readonly getState: () => GameState;
  readonly onStateChange: (state: GameState) => void;
  readonly random?: RandomNumberGenerator;
  readonly target?: Window | Document;
}

export function canAdvanceGameLoop(state: GameState): boolean {
  return !isGameOver(state);
}

export function isGameOver(state: GameState): boolean {
  return state.status === 'game-over';
}

export function resetGameState(
  options: CreateInitialGameStateOptions = {},
): GameState {
  return createInitialGameState(options);
}

export function restartGameIfGameOver(
  state: GameState,
  options: CreateInitialGameStateOptions = {},
): GameState {
  return isGameOver(state) ? resetGameState(options) : state;
}

export function createGameOverRestartInputHandler({
  getState,
  onStateChange,
  random,
  target = window,
}: GameOverRestartInputOptions): () => void {
  const handleKeyDown: EventListener = (event) => {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    const state = getState();

    if (!isGameOver(state)) {
      return;
    }

    event.preventDefault();
    onStateChange(resetGameState({ random }));
  };

  target.addEventListener('keydown', handleKeyDown);

  return () => {
    target.removeEventListener('keydown', handleKeyDown);
  };
}
