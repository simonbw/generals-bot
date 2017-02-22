// @flow
import GeneralsSocket from './GeneralsSocket';
import GameState from '../game/GameState';
import type { Viewer, Bot, Move } from '../game/game-types';


// TODO: Clean this up
/**
 * Join a game over and over
 */
export function playRepeatedly(
  botId: string,
  botName: string,
  gameId: string,
  viewer: Viewer,
  makeBot: (GameState) => Bot
) {
  const socket = new GeneralsSocket(botId, botName);
  
  socket.onDisconnect(() => {
    console.error('Disconnected from server.');
    // TODO: Reconnect on disconnect
  });
  
  socket.onConnect(() => {
    console.log('connected');
    socket.joinCustomGame(gameId, true);
  });
  
  let gameState: GameState;
  let bot: Bot;
  
  socket.onGameLost(() => {
    viewer.gameLost();
    socket.leaveGame();
    socket.joinCustomGame(gameId, true);
  });
  
  socket.onGameWon(() => {
    viewer.gameWon();
    socket.leaveGame();
    socket.joinCustomGame(gameId, true);
  });
  
  socket.onGameStart(({ playerIndex, usernames }) => {
    gameState = new GameState([], [], [], playerIndex, [], -1, usernames);
    bot = makeBot(gameState);
  });
  
  socket.onGameUpdate((gameUpdate) => {
    viewer.preUpdate();
    
    gameState = gameState.update(gameUpdate);
    const move = bot.update(gameState);
    if (move) {
      socket.attack(move);
    }
    viewer.update(gameState)
  });
  
}