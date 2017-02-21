// @flow
import test from 'ava';
import { findPath } from '../src/bots/pathfinding';
import Tile from '../src/Tile';
import GameState from '../src/GameState';

test('sanity test', (t) => {
  const gameState = new GameState([], [], [], 0, [], 0, [], null);
  const start = gameState.tiles[0];
  const end = gameState.tiles[gameState.tiles.length - 1];
  // findPath(start, (tile) => tile == end, gameState);
});