// @flow
import type GameState from '../GameState';
import type Tile from '../Tile';

type Move = { start:Tile, end:Tile };

class SimpleBot {
  playerIndex: number;
  
  constructor(playerIndex: number) {
    this.playerIndex = playerIndex;
  }
  
  /**
   * Process an update and return a move.
   */
  update(gameState: GameState) {
    const possibleMoves = this.getPossibleMoves(gameState);
    // annotate all moves with a rank
    const rankedMoves = possibleMoves.map((move) => ({ ...move, rank: this.rankMove(move, gameState) }));
    // find the highest ranked move
    const move = rankedMoves.reduce((best, current) => (best && best.rank >= current.rank) ? best : current, null);
    
    if (!move || move.rank <= 0) { // no moves or no good moves
      return null; // do nothing
    } else {
      return move;
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
        .map((start: Tile) =>
          gameState.getAdjacentTiles(start) // All possible places to move to
            .filter((end) => !end.isMountain()) // Can't move to mountains
            .map((end: Tile) => ({ start, end })) // turn them into moves
        )
    )
  }
  
  /**
   * Returns the tile for this player's general.
   */
  getMyGeneral(gameState: GameState) {
    return gameState.tiles.find((tile) => tile.isGeneral() && tile.owner == this.playerIndex);
  }
  
  /**
   * Ranks a move on how good it is. Negative values are worse than doing nothing.
   */
  rankMove(move: Move, gameState: GameState): number {
    // don't attack cities you can't take
    if (move.end.isCity() && move.start.armies < move.end.armies + 2) {
      return -1;
    }
    let rank = 0;
    // favor expanding
    if (move.end.isNeutral()) {
      rank += 1;
    }
    
    return rank + Math.random();
  }
}

export default SimpleBot;
