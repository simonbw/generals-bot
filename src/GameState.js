// @flow
import type { MapData, Score } from './game-types';
import { extractMapHeight, extractMapWidth, patch, extractTiles, getIndex } from './map-util';
import Tile from './Tile';
import { getPlayerFg, RESET } from './colors';

/**
 * Represents the state of the game at a point in time.
 */
class GameState {
  citiesData: MapData;
  generals: MapData;
  mapData: MapData;
  playerIndex: number;
  scores: Score[];
  tiles: Tile[];
  turn: number;
  usernames: string[];
  previous: ?GameState;
  
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
    this.citiesData = citiesData;
    this.generals = generals;
    this.mapData = mapData;
    this.playerIndex = playerIndex;
    this.scores = scores;
    this.turn = turn;
    this.usernames = usernames;
    this.previous = previous;
    
    // Computed properties
    this.tiles = extractTiles(mapData, citiesData, generals, previous ? previous.tiles : null);
  }
  
  update(mapDiff: MapData, citiesDiff: MapData, scores: Score[], turn: number) {
    return new GameState(
      patch(this.citiesData, citiesDiff),
      this.generals,
      patch(this.mapData, mapDiff),
      this.playerIndex,
      scores,
      turn,
      this.usernames,
      this
    )
  }
  
  getTileAtCoordinates(x: number, y: number): Tile {
    return this.getTileAtIndex(getIndex(x, y, this.mapData));
  }
  
  getTileAtIndex(index: number): Tile {
    return this.tiles[index];
  }
  
  getAdjacentTiles(tile: Tile): Tile[] {
    const width = extractMapWidth(this.mapData);
    const height = extractMapHeight(this.mapData);
    const x = tile.x;
    const y = tile.y;
    
    return [
      [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y], // All possible locations
    ].filter(([x, y]) => (x >= 0 && y >= 0 && x < width && y < height) // remove ones outside of map
    ).map(([x, y]) => this.getTileAtCoordinates(x, y));
  }
  
  getTileRows(): Tile[][] {
    const width = extractMapWidth(this.mapData);
    const height = extractMapHeight(this.mapData);
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
  
  toString() {
    const indentation = '  ';
    const tilesString = this.getTileRows()
      .map((row) => row
        .map((tile) => tile.toString())
        .join(''))
      .map((row) => '  ' + row)
      .join('\n');
    
    const scoreHeader = `${indentation}Army - Tiles - Player`;
    const scoreString = this.scores
      .map(({ total, tiles, dead }, i) => ({ total, tiles, dead, i }))
      .sort((a, b) => (b.dead ? 0 : b.total) - (a.dead ? 0 : a.total))
      .map(({ total, tiles, i }) => `${getPlayerFg(i)}${total} - ${tiles} - ${this.usernames[i]}${RESET}`)
      .map((row) => indentation + row) // indent
      .join('\n');
    
    return '\n' + tilesString + '\n' + scoreHeader + '\n' + scoreString + '\n\n';
  }
}

export default GameState;