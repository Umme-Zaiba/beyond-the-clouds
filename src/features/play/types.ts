export interface GameResult {
  /** 0 means the attempt failed; 1-3 are stars earned */
  stars: number;
  /** one plain sentence describing how it went */
  note: string;
}

import type { QuizQuestion } from '../../types';

export type GameSpec =
  | { kind: 'memory'; seed: number; length: number; noun?: string }
  | { kind: 'steady'; hits: number; arc: number; speed: number }
  | { kind: 'scale'; seed: number; weights: number; goods?: string }
  | { kind: 'quiz'; questions: QuizQuestion[] };
