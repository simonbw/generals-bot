// @flow
import GameState from './GameState';
import GeneralsSocket from './GeneralsSocket';
import SimpleBot from './SimpleBot';
import clear from 'clear';
import { terminal } from 'terminal-kit';
import config from '../generals-config.json';
import shortid from 'shortid';

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

let game;
let bot: SimpleBot;

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
  game = new GameState([], [], [], playerIndex, [], -1, usernames);
  bot = new SimpleBot(playerIndex);
});

socket.onGameUpdate(({ mapDiff, citiesDiff, scores, turn, generals }) => {
  terminal.eraseDisplay(); // clear screen early to allow for errors to be printed
  
  game = game.update(mapDiff, citiesDiff, scores, turn, generals);
  const move = bot.update(game);
  if (move) {
    socket.attack(move);
  }
  terminal(game.toString());
});
