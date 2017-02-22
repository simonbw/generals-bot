// @flow
import type GameState from '../GameState';
import type Tile from '../Tile';
import CityCounter from './helpers/CityCounter';

/**
 * This is the base class for a bot.
 * It provides some useful functionality to build upon.
 */
class AbstractBot {
  playerIndex: number;
  gameState: GameState;
  cityCounter: CityCounter;
  
  constructor(playerIndex: number) {
    this.playerIndex = playerIndex;
    this.cityCounter = new CityCounter();
  }
  
  /**
   * Process an update and return a move.
   */
  update(gameState: GameState): ?{ start: Tile, end:Tile } {
    this.gameState = gameState;
    this.cityCounter.update(gameState);
    return null;
  }
  
  /**
   * Return the current round.
   */
  getRound() {
    return Math.ceil(this.gameState.turn / 25);
  }
  
  /**
   * Returns the tile for this player's largest army.
   * Returns null if no armies greater than size 1 are found.
   * @param gameState
   */
  getLargestArmy(): ?Tile {
    const myTiles = this.getMyUsableTiles();
    if (myTiles.length > 0) {
      return myTiles.reduce((best, current) => (best.getArmies() > current.getArmies()) ? best : current);
    } else {
      return null;
    }
  }
  
  getMedianArmySize() {
    return 1;
    // const myTiles = this.getMyTiles();
    // if (myTiles.length > 0) {
    //   return myTiles[Math.floor(myTiles.length / 2)].getArmies();
    // }
    // return 0;
  }
  
  /**
   * Returns the tile for this player's general.
   */
  getMyGeneral(): ?Tile {
    return this.gameState.tiles.find((tile) => tile.isGeneral() && tile.owner == this.playerIndex);
  }
  
  getOpponentGenerals(): Tile[] {
    return this.gameState.tiles.filter((tile) => tile.isGeneral() && (tile.isOpponent(this.playerIndex) || tile.isNeutral()));
  }
  
  /**
   * Returns a list of this player's tiles, sorted by army size.
   */
  getMyTiles() {
    return this.gameState.tiles
      .filter((tile) => tile.owner == this.playerIndex)
      .sort((a, b) => b.getArmies() - a.getArmies());
  }
  
  /**
   * Returns a list of my tiles with more than 1 army.
   */
  getMyUsableTiles() {
    return this.getMyTiles().filter((tile) => tile.getArmies() > 1);
  }
  
  /**
   * Return an array of all the possible moves to make.
   */
  getPossibleMoves() {
    return [].concat(... // flatten the list
      this.getMyUsableTiles()
        .map((start: Tile) =>
          this.gameState.getAdjacentTiles(start) // All possible places to move to
            .filter((end) => !end.isMountain()) // Can't move to mountains
            .map((end: Tile) => ({ start, end })) // turn them into moves
        )
    )
  }
}

export default AbstractBot;
