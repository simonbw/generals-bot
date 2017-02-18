// @flow
import type GameState from './GameState';
import type Tile from './Tile';

type Move = { startTile:Tile, endTile:Tile };

class SimpleBot {
  playerIndex: number;
  
  constructor(playerIndex: number) {
    this.playerIndex = playerIndex;
  }
  
  /**
   * Process an update and return a move.
   */
  update(gameState: GameState) {
    const move = this
      .getPossibleMoves(gameState)
      .map((move) => ({ ...move, rank: this.rankMove(move, gameState) })) // annotate all moves with a rank
      .reduce((best, current) => (best && best.rank >= current.rank) ? best : current, null); // find the highest ranked move
    
    if (!move || move.rank <= 0) { // no moves or no good moves
      return null; // do nothing
    } else {
      return {
        start: move.startTile.index,
        end: move.endTile.index
      };
    }
  }
  
  /**
   * Return a list of all the moves it's possible to make.
   */
  getPossibleMoves(gameState: GameState) {
    return [].concat(... // flatten the list
      gameState.tiles
        .filter((tile) => tile.owner == this.playerIndex) // All my tiles
        .filter((tile) => tile.armies > 1) // Need enough to move
        .map((startTile: Tile) =>
          gameState.getAdjacentTiles(startTile) // All possible places to move to
            .filter((endTile) => !endTile.isMountain()) // Can't move to mountains
            .map((endTile: Tile) => ({ startTile, endTile })) // turn them into moves
        )
    )
  }
  
  /**
   * Ranks a move on how good it is. Negative values are worse than doing nothing.
   */
  rankMove(move: Move, gameState: GameState): number {
    // don't attack cities you can't take
    if (move.endTile.isCity() && move.startTile.armies < move.endTile.armies + 2) {
      return -1;
    }
    // favor expanding
    if (move.endTile.isNeutral() && move.endTile.isEmpty()) {
      return 1;
    }
    
    return Math.random();
  }
}

export default SimpleBot;
