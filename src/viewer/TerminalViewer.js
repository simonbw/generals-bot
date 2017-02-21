// @flow
import { padLeft } from './viewer-utils';
import { terminal } from 'terminal-kit';
import { getPlayerFg, MAP_NUMBERS_FG, RESET } from './colors';
import type GameState from '../GameState';
import ScoreViewer from './ScoreViewer';
import MapViewer from './MapViewer';

class TerminalViewer {
  scoreViewer: ScoreViewer;
  mapViewer: MapViewer;
  
  constructor() {
    this.scoreViewer = new ScoreViewer();
    this.mapViewer = new MapViewer();
  }
  
  preUpdate() {
    terminal.eraseDisplay(); // clear screen early to allow for errors to be printed
  }
  
  update(gameState: GameState) {
    const output = '\n'
      + this.mapViewer.getMapString(gameState)
      + this.scoreViewer.getScoreString(gameState.scores, gameState.usernames)
      + '\n';
    terminal(output);
  }
}

export default TerminalViewer;
