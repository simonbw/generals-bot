// @flow
import io from 'socket.io-client';
import type Tile from '../game/Tile';
import type { GameUpdate, GameStart, Move } from '../game/game-types';

/**
 * Wraps the websocket to provide a typed interface.
 */
class GeneralsSocket {
  userid: string;
  username: string;
  socket: any;
  
  constructor(userid: string, username: string) {
    this.userid = userid;
    this.username = username;
    
    this.socket = io('http://botws.generals.io');
    
    this.socket.on('connect', () => {
      this.socket.emit('set_username', userid, username);
    });
    
    this.socket.on('error', (e) => {
      console.error('socket error', e);
    });
  }
  
  onConnect(callback: () => void) {
    this.socket.on('connect', callback);
  }
  
  onDisconnect(callback: () => void) {
    this.socket.on('disconnect', callback);
  }
  
  onGameWon(callback: () => void) {
    this.socket.on('game_won', callback);
  }
  
  onGameLost(callback: () => void) {
    this.socket.on('game_lost', callback);
  }
  
  onGameStart(callback: (gameStart: GameStart) => void) {
    this.socket.on('game_start', (data) => {
      callback({
        playerIndex: data.playerIndex,
        replayUrl: `http://bot.generals.io/replays/${encodeURIComponent(data.replay_id)}`,
        usernames: data.usernames,
        teams: data.teams
      });
    });
  }
  
  onGameUpdate(callback: (gameUpdate: GameUpdate) => void) {
    this.socket.on('game_update', (data) => {
      callback({
        citiesDiff: data.cities_diff,
        mapDiff: data.map_diff,
        generals: data.generals,
        scores: data.scores,
        turn: data.turn,
      });
    });
  }
  
  attack(move: Move) {
    this.socket.emit('attack', move.start.index, move.end.index, move.is50);
  }
  
  /**
   * Join a custom game
   * @param gameId
   * @param forceStart
   */
  joinCustomGame(gameId: string, forceStart: boolean) {
    this.socket.emit('join_private', gameId, this.userid);
    
    if (forceStart) {
      this.socket.emit('set_force_start', gameId, true);
    }
    
    console.log(`Joining custom game at http://bot.generals.io/games/${encodeURIComponent(gameId)}. Force Start: ${String(forceStart)}`);
  }
  
  /**
   * Join a 1v1 game.
   */
  join1v1() {
    this.socket.emit('join_1v1', this.userid);
  }
  
  /**
   * Join a Free For All game
   */
  joinFFA() {
    this.socket.emit('play', this.userid);
  }
  
  // TODO: 2v2
  
  leaveGame() {
    this.socket.emit('leave_game');
  }
}

export default GeneralsSocket;
