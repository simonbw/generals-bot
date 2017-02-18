// @flow
export type MapData = number[];
export type Score = { total: number, tiles: number, dead: boolean };
export type Terrain = 'city' | 'empty' | 'general' | 'mountain' | 'obstacle';
export type Owner = number; //-1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 ;
