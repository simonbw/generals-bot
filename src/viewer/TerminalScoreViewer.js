// @flow
import type { MapData, Score } from '../game/game-types';
import { padLeft } from './viewer-utils';
import { terminal } from 'terminal-kit';
import { getPlayerBg, getPlayerFg, EMPTY_BG, OBSTACLE_BG, MAP_NUMBERS_FG, FOG_BG, RESET } from './colors';
import type Tile from '../game/Tile';
import type GameState from '../game/GameState';

class TerminalScoreViewer {
  constructor() {
  }
  
  getScoreString(scores: Score[], usernames: string[]) {
    const scoreHeader = `${'  '} Army - Tiles - Player\n`;
    const scoreString = scores
      .map(({ total, tiles, dead }, i) => ({ total, tiles, dead, i }))
      .sort((a, b) => (b.dead ? 0 : b.total) - (a.dead ? 0 : a.total))
      .map(({ total, tiles, i }) => `${getPlayerFg(i)}${padLeft(total, '     ')} - ${padLeft(tiles, '     ')} - ${usernames[i]}${RESET}`)
      .map((row) => '  ' + row) // indent
      .join('\n');
    
    return scoreHeader + scoreString + '\n';
  }
}

export default TerminalScoreViewer;
