// @flow
import type GameState from '../../GameState';
import type { Score } from '../../game-types';

/**
 * Estimates how many cities each opponent has.
 */
class CityCounter {
  gains: Map<number, number[]>;
  lastScores: Map<number, Score >;
  
  constructor() {
    this.gains = {};
    this.lastScores = {};
  }
  
  update(gameState: GameState) {
    gameState.scores.forEach((score) => {
      const lastScore = this.lastScores.get(score.i);
      const gain = score.total - (lastScore ? lastScore.total : 0);
      this.gains.get(score.i).push(gain);
      this.lastScores.set(score.i, score);
    });
  }
  
  getCityCount(player: number) {
    this.gains.get(i).filter((gain) => gain > 0);
    return 1;
  }
}

export default CityCounter;