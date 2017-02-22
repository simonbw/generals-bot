// @flow
import type GameState from '../../game/GameState';
import type { Score } from '../../game/game-types';

/**
 * Estimates how many cities each opponent has.
 */
class CityCounter {
  gains: Map<number, number[]>;
  lastScores: Map<number, Score>;
  
  constructor() {
    this.gains = new Map();
    this.lastScores = new Map();
  }
  
  /**
   * Get the gains list for a player. Create it if it doesn't exist.
   */
  _getGainsList(player: number): number[] {
    let gainsList = this.gains.get(player);
    if (!gainsList) {
      gainsList = [];
      this.gains.set(player, gainsList);
    }
    return gainsList;
  }
  
  /**
   * Call every time there's a new game state.
   */
  update(gameState: GameState) {
    // only check turns where cities grow and land doesn't
    if (gameState.turn % 2 == 0 && gameState.turn % 50 != 0) {
      gameState.scores.forEach((score) => {
        const lastScore = this.lastScores.get(score.i);
        const gain = score.total - (lastScore ? lastScore.total : 0);
        this._getGainsList(score.i).push(gain);
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
    const positiveGains = this._getGainsList(player)
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