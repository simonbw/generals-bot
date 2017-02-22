// @flow
import type { MapData, Score, GameUpdate } from './game-types';
import { extractMapHeight, extractMapWidth, patch, extractTiles, getIndex } from './util/map-util';
import Tile from './Tile';

/**
 * Represents the state of the game at a point in time.
 */
class GameState {
  _citiesData: MapData;
  _generals: MapData;
  _mapData: MapData;
  playerIndex: number;
  scores: Score[];
  tiles: Tile[];
  turn: number;
  usernames: string[];
  _previous: ?GameState;
  
  constructor(
    citiesData: MapData,
    generals: MapData,
    mapData: MapData,
    playerIndex: number,
    scores: Score[],
    turn: number,
    usernames: string[],
    previous: ?GameState
  ) {
    this._citiesData = citiesData;
    this._generals = generals;
    this._mapData = mapData;
    this.playerIndex = playerIndex;
    this.scores = scores;
    this.turn = turn;
    this.usernames = usernames;
    this._previous = previous;
    
    // Computed properties
    this.tiles = extractTiles(mapData, citiesData, generals, previous ? previous.tiles : null);
  }
  
  /**
   * Return a new game state that is the result of applying an update to this state.
   */
  update(gameUpdate: GameUpdate) {
    return new GameState(
      patch(this._citiesData, gameUpdate.citiesDiff),
      gameUpdate.generals,
      patch(this._mapData, gameUpdate.mapDiff),
      this.playerIndex,
      gameUpdate.scores,
      gameUpdate.turn,
      this.usernames,
      this
    )
  }
  
  getTileAtCoordinates(x: number, y: number): Tile {
    return this.getTileAtIndex(getIndex(x, y, this._mapData));
  }
  
  getTileAtIndex(index: number): Tile {
    return this.tiles[index];
  }
  
  // TODO: Should this be here?
  getAdjacentTiles(tile: Tile): Tile[] {
    const width = extractMapWidth(this._mapData);
    const height = extractMapHeight(this._mapData);
    const x = tile.x;
    const y = tile.y;
    
    return [
      [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y], // All possible locations
    ].filter(([x, y]) => (x >= 0 && y >= 0 && x < width && y < height) // remove ones outside of map
    ).map(([x, y]) => this.getTileAtCoordinates(x, y));
  }
  
  // This is really just here for the toString(). Should I take it out?
  getTileRows(): Tile[][] {
    const width = extractMapWidth(this._mapData);
    const height = extractMapHeight(this._mapData);
    const rows = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      rows.push(row);
      for (let x = 0; x < width; x++) {
        row.push(this.getTileAtCoordinates(x, y));
      }
    }
    return rows;
  }
}

export default GameState;