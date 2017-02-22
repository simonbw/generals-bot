// @flow
import type GameState from '../../game/GameState';
import type Tile from '../../game/Tile';

/**
 * Estimates locations of enemy generals
 */
class GeneralLocator {
  player: number;
  notFound: Set<number>; // set of locations the general isn't
  contactMade: boolean;
  generalLocation: number;
  
  constructor(player: number) {
    this.player = player;
    this.contactMade = false;
    this.notFound = new Set();
    this.generalLocation = -1;
  }
  
  update(gameState: GameState) {
    this.updateVisibleTiles(gameState);
    this.updateContactMade(gameState);
  }
  
  /**
   * Remove all visible tiles from possible locations for general, unless they are the general, in which case, remember
   * that, it's important.
   *
   * @param gameState
   */
  updateVisibleTiles(gameState: GameState) {
    gameState.tiles
      .filter((tile) => tile.isVisible())
      .forEach((tile) => {
        if (tile.isOwnedBy(this.player) && tile.isGeneral()) {
          this.generalLocation = tile.index;
        } else {
          this.notFound.add(tile.index);
        }
      })
  }
  
  /**
   * Check if contact has been made and update locations if it has.
   * @param gameState
   */
  updateContactMade(gameState: GameState) {
    if (!this.contactMade) {
      const playerTiles = gameState.tiles.filter((tile) => tile.isOwnedBy(this.player));
      if (playerTiles.length > 0) {
        this.onContactMade(gameState, playerTiles);
      }
    }
  }
  
  onContactMade(gameState: GameState, playerTiles: Tile[]) {
    this.contactMade = true;
    const inRange = new Set();
    
    const score = gameState.scores.find((score) => score.i == this.player);
    if (!score) {
      throw Error('no score for player:', this.player);
    }
    const maxDistance = score.tiles;
    const visitedScores = new Map();
    
    const queue = playerTiles.map((tile) => ({ distance: 0, tile }));
    while (queue.length > 0) {
      const { distance, tile } = queue.pop();
      inRange.add(tile.index);
      if (distance < maxDistance) {
        gameState.getAdjacentTiles(tile)
          .forEach((adjacentTile) => {
            const adjacentDistance = distance + 1;
            const oldDistance = visitedScores.get(adjacentTile.index) || Infinity;
            if (adjacentDistance < oldDistance) {
              queue.push({ tile: adjacentTile, distance: distance + 1 });
              inRange.add(tile.index);
            }
          });
      }
    }
    
    // Eliminate all tiles that aren't in range
    gameState.tiles.forEach((tile) => {
      if (!inRange.has(tile.index)) {
        this.notFound.add(tile.index);
      }
    });
  }
}

export default GeneralLocator;
