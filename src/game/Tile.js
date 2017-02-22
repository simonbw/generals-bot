// @flow
import type { Terrain, Owner } from './game-types';

export const EMPTY = -1;
export const MOUNTAIN = -2;
export const FOG = -3;
export const FOG_OBSTACLE = -4;

/**
 * A single tile on the map.
 */
class Tile {
  x: number;
  y: number;
  index: number;
  terrain: Terrain;
  armies: number;
  fog: boolean;
  owner: Owner;

  constructor(x: number, y: number, index: number, terrain: Terrain, armies: number, fog: boolean, owner: Owner) {
    this.x = x;
    this.y = y;
    this.index = index;
    this.terrain = terrain;
    this.armies = armies;
    this.fog = fog;
    this.owner = owner;
  }
  
  isCity() {
    return this.terrain == 'city';
  }
  
  isNeutral() {
    return this.owner < 0;
  }
  
  isEmpty() {
    return this.terrain == 'empty';
  }
  
  isGeneral() {
    return this.terrain == 'general';
  }
  
  isMountain() {
    return this.terrain == 'mountain';
  }
  
  isObstale() {
    return this.terrain == 'obstacle';
  }
  
  isVisible() {
    return !this.fog;
  }
  
  isFog() {
    return this.fog;
  }
  
  // TODO: Should this be here?
  isOpponent(player: number) {
    return this.owner >= 0 && this.owner != player;
  }
  
  isOwnedBy(player: number) {
    return this.owner == player;
  }
  
  getArmies() {
    return this.armies;
  }
}

export default Tile;
