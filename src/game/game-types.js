// @flow
import type Tile from './Tile';
import type GameState from './GameState';
export type MapData = number[];
export type Score = { total: number, tiles: number, dead: boolean, i:number };
export type Terrain = 'city' | 'empty' | 'general' | 'mountain' | 'obstacle';
export type Owner = number; //-1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 ;

export type Move = {
  start: Tile,
  end: Tile,
  is50?: boolean
};

export type GameUpdate = {
  citiesDiff:number[],
  mapDiff:number[],
  generals:number[],
  scores:Object[],
  turn:number
};

export type GameStart = {
  playerIndex:number,
  replayUrl:string,
  usernames:string[],
  teams?:number[]
};

export interface Viewer {
  preUpdate (): void;
  update(gameState: GameState): void;
  gameLost(): void;
  gameWon(): void;
}

export interface Bot {
  update(gameState: GameState): ?Move
}
