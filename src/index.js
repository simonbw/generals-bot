// @flow
import GameState from './GameState';
import GeneralsSocket from './GeneralsSocket';
import AttackBot from './bots/AttackBot';
import clear from 'clear';
import { terminal } from 'terminal-kit';
import config from '../generals-config.json';
import shortid from 'shortid';
import TerminalViewer from './viewer/TerminalViewer';

const botId = config.botId || shortid();
const botName = '[Bot] ' + (config.botName || shortid());
const gameId = config.gameId || shortid();

const socket = new GeneralsSocket(botId, botName);

socket.onDisconnect(() => {
  console.error('Disconnected from server.');
  process.exit(1);
});

socket.onConnect(() => {
  console.log('connected');
  socket.joinCustomGame(gameId, true);
});

let gameState: GameState;
let bot: AttackBot;
const viewer = new TerminalViewer();

socket.onGameLost(() => {
  terminal('game lost');
  socket.leaveGame();
  socket.joinCustomGame(gameId, true);
});

socket.onGameWon(() => {
  terminal('game won');
  socket.leaveGame();
  socket.joinCustomGame(gameId, true);
});

socket.onGameStart(({ playerIndex, usernames }) => {
  gameState = new GameState([], [], [], playerIndex, [], -1, usernames);
  bot = new AttackBot(playerIndex);
});

socket.onGameUpdate(({ mapDiff, citiesDiff, scores, turn, generals }) => {
  viewer.preUpdate();
  
  gameState = gameState.update(mapDiff, citiesDiff, scores, turn, generals);
  const move = bot.update(gameState);
  if (move) {
    socket.attack(move);
  }
  viewer.update(gameState)
});
