import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import {
  advanceGameTick,
  createGameOverRestartInputHandler,
  createInitialGameState,
  createKeyboardDirectionInputHandler,
  type GameState,
} from '../game';
import { renderCanvasGameState } from '../render';

const DEFAULT_TICK_MS = 120;
const MAX_ACCUMULATED_MS = 500;

export interface UseSnakeGameOptions {
  readonly tickMs?: number;
}

export interface UseSnakeGameResult {
  readonly canvasRef: RefObject<HTMLCanvasElement | null>;
  readonly state: GameState;
}

export function useSnakeGame({
  tickMs = DEFAULT_TICK_MS,
}: UseSnakeGameOptions = {}): UseSnakeGameResult {
  const [state, setState] = useState<GameState>(() => createInitialGameState());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(state);

  const commitState = useCallback((nextState: GameState) => {
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    renderCanvasGameState(canvas, state);
  }, [state]);

  useEffect(() => {
    const getState = () => stateRef.current;
    const cleanupDirectionInput = createKeyboardDirectionInputHandler({
      getState,
      onStateChange: commitState,
    });
    const cleanupRestartInput = createGameOverRestartInputHandler({
      getState,
      onStateChange: commitState,
    });

    return () => {
      cleanupDirectionInput();
      cleanupRestartInput();
    };
  }, [commitState]);

  useEffect(() => {
    let animationFrameId = 0;
    let previousTimestamp = performance.now();
    let accumulatedMs = 0;

    const update = (timestamp: number) => {
      const elapsedMs = timestamp - previousTimestamp;
      previousTimestamp = timestamp;
      accumulatedMs = Math.min(accumulatedMs + elapsedMs, MAX_ACCUMULATED_MS);

      let nextState = stateRef.current;
      let didAdvance = false;

      while (accumulatedMs >= tickMs) {
        const result = advanceGameTick(nextState);
        accumulatedMs -= tickMs;

        if (result.state !== nextState) {
          nextState = result.state;
          didAdvance = true;
        }

        if (nextState.status === 'game-over') {
          accumulatedMs = 0;
          break;
        }
      }

      if (didAdvance) {
        commitState(nextState);
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [commitState, tickMs]);

  return {
    canvasRef,
    state,
  };
}
