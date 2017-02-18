// @flow
import { reset as COLOR_RESET } from 'ansi-256-colors';
import { getPlayerBg, FOG_BG, EMPTY_BG, OBSTACLE_BG } from './colors';
import type { Terrain, Owner } from './game-types';

export const EMPTY = -1;
export const MOUNTAIN = -2;
export const FOG = -3;
export const FOG_OBSTACLE = -4;

const NEUTRAL = -1;

/**
 * A single tile on the map.
 */
class Tile {
  armies: number;
  index: number;
  owner: Owner;
  terrain: Terrain;
  x: number;
  y: number;
  fog: boolean;
  
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
    return this.owner == NEUTRAL;
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
  
  toString() {
    return this.getColorCode() + this.getCharacter() + COLOR_RESET;
  }
  
  getColorCode() {
    if (this.owner >= 0) {
      return getPlayerBg(this.owner);
    } else if (this.isEmpty()) {
      if (this.isVisible()) {
        return EMPTY_BG;
      } else {
        return FOG_BG;
      }
    } else {
      return OBSTACLE_BG;
    }
  }
  
  getCharacter() {
    switch (this.terrain) {
      case 'general':
        return '<G>';
      case 'city':
        return ' C ';
      case 'mountain':
        return ' M ';
      case 'obstacle':
        return ' ? ';
      case 'empty':
        return '   ';
    }
  }
}

export default Tile;
