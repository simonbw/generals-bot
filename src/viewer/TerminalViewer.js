// @flow
import { padLeft } from './viewer-utils';
import { terminal } from 'terminal-kit';
import { getPlayerFg, MAP_NUMBERS_FG, RESET } from './colors';
import type GameState from '../game/GameState';
import TerminalScoreViewer from './TerminalScoreViewer';
import TerminalMapViewer from './TerminalMapViewer';

class TerminalViewer {
  scoreViewer: TerminalScoreViewer;
  mapViewer: TerminalMapViewer;
  
  constructor() {
    this.scoreViewer = new TerminalScoreViewer();
    this.mapViewer = new TerminalMapViewer();
  }
  
  gameWon() {
    terminal('game won');
  }
  
  gameLost() {
    terminal('game lost');
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
