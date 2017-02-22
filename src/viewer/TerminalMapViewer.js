// @flow
import { padLeft } from './viewer-utils';
import { terminal } from 'terminal-kit';
import { getPlayerBg, getPlayerFg, EMPTY_BG, OBSTACLE_BG, MAP_NUMBERS_FG, FOG_BG, RESET } from './colors';
import type Tile from '../game/Tile';
import type GameState from '../game/GameState';

class TerminalMapViewer {
  constructor() {
    
  }
  
  getMapString(gameState: GameState) {
    const mapHeader = '     ' + MAP_NUMBERS_FG + gameState
        .getTileRows()[0].map((t, i) => padLeft(i, '   ')).join('')
      + RESET + '\n';
    
    const tilesString = gameState
      .getTileRows()
      .map((row, i) => row
        .map((tile) => this.tileToString(tile))
        .join(''))
      .map((row, i) => `${'  '}${MAP_NUMBERS_FG}${padLeft(i, '  ')}${RESET} ${row}`)
      .join('\n');
    
    const turnString = `    Turn ${gameState.turn}\n`;
    
    return mapHeader + tilesString + '\n' + turnString;
  }
  
  tileToString(tile: Tile) {
    return this.getTileColorCode(tile) + this.getTileCharacter(tile) + RESET;
  }
  
  getTileColorCode(tile: Tile) {
    if (tile.owner >= 0) {
      return getPlayerBg(tile.owner);
    } else if (tile.isVisible()) {
      if (tile.isEmpty()) {
        return EMPTY_BG;
      } else {
        return OBSTACLE_BG;
      }
    } else {
      return FOG_BG;
    }
  }
  
  getTileCharacter(tile: Tile) {
    switch (tile.terrain) {
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

export default TerminalMapViewer;
