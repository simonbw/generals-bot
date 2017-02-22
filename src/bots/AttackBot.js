// @flow
import type GameState from '../game/GameState';
import type Tile from '../game/Tile';
import { findPathTo, findPath } from './pathfinding';
import { choose } from '../util/random';
import AbstractBot from './AbstractBot';
import type { Move } from '../game/game-types';

/**
 * This is a simple 1v1 bot.
 * It will expand as quickly as possible until it makes contact with the opponent.
 * Once it makes contact, it will attempt to rush the opponent's king.
 */
class AttackBot extends AbstractBot {
  contactMade: boolean;
  _currentArmyIndex: number;
  
  constructor(gameState: GameState) {
    super(gameState);
    this.contactMade = false;
    this._currentArmyIndex = -1;
  }
  
  /**
   * Process an update and return a move.
   */
  update(gameState: GameState) {
    super.update(gameState);
    if (!this.contactMade && this.gameState.tiles.find((tile) => !tile.isNeutral() && tile.owner != this.playerIndex)) {
      this.contactMade = true;
      console.log('Contact Made!');
    }
    
    const move = this.getMove();
    if (move && move.start.index == this._currentArmyIndex) {
      this._currentArmyIndex = move.end.index;
    }
    return move;
  }
  
  /**
   * Determine what move to make
   */
  getMove() {
    // Try to attack if we've made contact
    if (this.contactMade) {
      const move = this.attack();
      if (move) {
        return move;
      }
    }
    
    // Otherwise, just expand
    return this.expand();
  }
  
  /**
   * Rank how good an expansion move is.
   * @param move
   * @return {*}
   */
  getExpansionScore({ start, end }: Move) {
    // Don't attack cities we can't take
    if (end.isCity() && start.getArmies() < end.getArmies() + 2) {
      return -1;
    }
    
    let score = 0;
    score += start.getArmies();
    score += Math.random();
    score += start == this.getCurrentArmy();
    
    if (start.isCity()) {
      score += 5;
    }
    if (end.isCity()) {
      
      score += 5;
    }
    
    return score;
  }
  
  /**
   * Try to expand.
   */
  expand() {
    const currentArmy = this.getCurrentArmy();
    const expansionMoves = this
      .getPossibleMoves()
      .filter(({ start, end }) => end.isNeutral() && !end.isCity())
      .sort((a, b) => this.getExpansionScore(a) - this.getExpansionScore(b));
    if (expansionMoves.length > 0) {
      const move = expansionMoves[0];
      if (this.getExpansionScore(move) < 0) {
        console.log('expanding');
        if (currentArmy == move.start) {
          console.log('...with current army');
        }
        return move;
      }
    }
    
    // If we can't immediately expand, move our largest army to the nearest empty space
    const start = currentArmy;
    if (start) {
      const goal = (tile: Tile) => tile.isNeutral() && !(tile.isCity() && start.getArmies() < tile.getArmies() + 2);
      const path = findPath(start, goal, this.gameState);
      if (path && path.length > 1) {
        const end = path[1]; // Move to the next place in the path
        console.log('moving to expand', path.map((tile) => [tile.x, tile.y]));
        return { start, end };
      } else {
        console.log('no path to empty tile', start, path);
      }
    } else {
      console.log('no armies available');
      return null;
    }
  }
  
  /**
   * Try to attack.
   */
  attack() {
    const start = this.getCurrentArmy();
    if (start) {
      const path = findPath(start, this.getAttackGoal(), this.gameState);
      if (path && path.length > 1) {
        console.log('attacking', path.map((tile) => [tile.x, tile.y]));
        const end = path[1];
        return { start, end }
      } else {
        console.log('no path to enemy', 'path:', path);
      }
    } else {
      console.log('no armies available');
    }
    return null;
  }
  
  /**
   * Return the goal function for attacking pathfinding.
   * @return {*}
   */
  getAttackGoal() {
    const opponentGenerals = this.getOpponentGenerals();
    if (opponentGenerals.length > 0) {
      return (tile: Tile) => opponentGenerals.includes(tile);
    } else {
      return (tile: Tile) => tile.isOpponent(this.playerIndex);
    }
  }
  
  /**
   * Returns the currently active army.
   */
  getCurrentArmy(): ?Tile {
    const oldCurrentArmy = this.gameState.tiles[this._currentArmyIndex];
    if (!oldCurrentArmy || !oldCurrentArmy.isOwnedBy(this.playerIndex) || oldCurrentArmy.getArmies() < 2) {
      const largestArmy = this.getLargestArmy();
      if (largestArmy) {
        this._currentArmyIndex = largestArmy.index;
      }
    }
    return this.gameState.tiles[this._currentArmyIndex];
  }
  
  /**
   * Return the best city to take.
   */
  getBestCity() {
    const cities = this.gameState.tiles.filter((tile) => tile.isCity());
    if (cities.length == 0) {
      return null;
    } else {
      cities.sort((a, b) => a.getArmies() - b.getArmies());
    }
  }
}

export default AttackBot;
