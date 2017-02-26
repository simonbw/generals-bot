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
    this.gains = new Map();
    this.lastScores = new Map();
  }
  
  getGainsList(player: number): number[] {
    return this.gains.get(player) || [];
  }
  
  update(gameState: GameState) {
    // only check turns where cities grow and land doesn't
    if (gameState.turn % 2 == 0 && gameState.turn % 50 != 0) {
      gameState.scores.forEach((score) => {
        const lastScore = this.lastScores.get(score.i);
        const gain = score.total - (lastScore ? lastScore.total : 0);
        this.getGainsList(score.i).push(gain);
      });
    }
    // update all remembered scores
    gameState.scores.forEach((score) => {
      this.lastScores.set(score.i, score);
    });
  }
  
  /**
   * Return an estimate of the number of cities player has, including the general.
   */
  getCityCount(player: number): number {
    const positiveGains = this.getGainsList(player)
      .slice(-25) // only look at the last few
      .filter((gain) => gain > 0); // ignore losses
    positiveGains.sort((a, b) => a - b);
    if (positiveGains.length == 0) {
      return 1;
    }
    return positiveGains[Math.floor(positiveGains.length * 0.8)];
  }
}

export default CityCounter;