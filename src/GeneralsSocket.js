// @flow
import io from 'socket.io-client';

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
  
  onGameStart(
    callback: (
      data: {
        playerIndex:number,
        replayUrl:string,
        usernames:string[],
        teams?:number[]
      }
    ) => void
  ) {
    this.socket.on('game_start', (data) => {
      callback({
        playerIndex: data.playerIndex,
        replayUrl: `http://bot.generals.io/replays/${encodeURIComponent(data.replay_id)}`,
        usernames: data.usernames,
        teams: data.teams
      });
    });
  }
  
  onGameUpdate(
    callback: (
      data: {
        citiesDiff:number[],
        mapDiff:number[],
        generals:number[],
        scores:Object[],
        turn:number
      }
    ) => void
  ) {
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
  
  attack(move: { start: number, end: number, is50?: boolean }) {
    this.socket.emit('attack', move.start, move.end, move.is50);
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
  
  leaveGame() {
    this.socket.emit('leave_game');
  }
}

export default GeneralsSocket;
