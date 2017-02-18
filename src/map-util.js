// @flow
import type { MapData, Terrain } from './game-types';
import Tile, { MOUNTAIN, EMPTY, FOG, FOG_OBSTACLE } from './Tile';

/**
 * Get the width of the map from the MapData.
 */
export function extractMapWidth(mapData: MapData) {
  return mapData[0];
}

/**
 * Get the height of the map from the MapData.
 */
export function extractMapHeight(mapData: MapData) {
  return mapData[1];
}

/**
 * Get the armies section of the MapData.
 */
export function extractArmies(mapData: MapData): MapData {
  const size = extractMapWidth(mapData) * extractMapHeight(mapData);
  return mapData.slice(2, size + 2);
}

/**
 * Get the terrain section of the MapData.
 */
export function extractTerrain(mapData: MapData): MapData {
  const size = extractMapWidth(mapData) * extractMapHeight(mapData);
  return mapData.slice(size + 2, size + 2 + size);
}

/**
 * Convert x,y coordinates into the tile's index.
 */
export function getIndex(x: number, y: number, mapData: MapData) {
  const width = extractMapWidth(mapData);
  return y * width + x;
}

/**
 * Convert an tile's index into x,y coordinates.
 */
export function getCoordinates(index: number, mapData: MapData) {
  const width = extractMapWidth(mapData);
  const height = extractMapHeight(mapData);
  const x = index % width;
  const y = Math.floor(index / height);
  return [x, y];
}

/**
 * Convert the raw MapData into a more usable form.
 */
export function extractTiles(mapData: MapData, cities: MapData, generals: MapData, previousGameState: ?Tile[]): Tile[] {
  const width = extractMapWidth(mapData);
  const height = extractMapHeight(mapData);
  const terrainData = extractTerrain(mapData);
  const armiesData = extractArmies(mapData);
  const tiles = [];
  
  const generalsSet = new Set(generals);
  const citiesSet = new Set(cities);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = getIndex(x, y, mapData);
      const isGeneral = generalsSet.has(index);
      const isCity = citiesSet.has(index);
      const previousTile = previousGameState ? previousGameState[index] : null;
      tiles.push(createTile(x, y, index, previousTile, terrainData[index], armiesData[index], isCity, isGeneral));
    }
  }
  return tiles;
}

export function createTile(
  x: number,
  y: number,
  index: number,
  previousTile: ?Tile,
  terrainType: number,
  armies: number,
  isCity: boolean,
  isGeneral: boolean
) {
  const owner = Math.max(terrainType, -1);
  const fog = (terrainType == FOG || terrainType == FOG_OBSTACLE);
  let terrain;
  
  if (isGeneral) {
    terrain = 'general';
  } else if (isCity) {
    terrain = 'city';
  } else if (terrainType == EMPTY) {
    terrain = 'empty';
  } else if (terrainType == MOUNTAIN) {
    terrain = 'mountain';
  } else if (terrainType == FOG) {
    if (previousTile && previousTile.isGeneral()) {
      terrain = 'general';
    } else {
      terrain = 'empty';
    }
  } else if (terrainType == FOG_OBSTACLE) {
    if (previousTile && previousTile.isCity()) {
      terrain = 'city';
    } else if (previousTile && previousTile.isMountain()) {
      terrain = 'mountain';
    } else if (previousTile && (previousTile.isEmpty() || previousTile.isGeneral())) {
      terrain = 'city';
    } else {
      terrain = 'obstacle';
    }
  } else {
    terrain = 'empty';
  }
  return new Tile(x, y, index, terrain, armies, fog, owner);
}

/**
 * TODO: Rewrite this in a more readable way. Currently copied from dev.generals.io
 * @param old
 * @param diff
 * @return {Array}
 */
export function patch(old: MapData, diff: MapData) {
  const out: MapData = [];
  let i = 0;
  while (i < diff.length) {
    if (diff[i]) {  // matching
      Array.prototype.push.apply(out, old.slice(out.length, out.length + diff[i]));
    }
    i++;
    if (i < diff.length && diff[i]) {  // mismatching
      Array.prototype.push.apply(out, diff.slice(i + 1, i + 1 + diff[i]));
      i += diff[i];
    }
    i++;
  }
  return out;
}