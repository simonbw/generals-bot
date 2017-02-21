// @flow
import type GameState from '../GameState';
import type Tile from '../Tile';
import PriorityQueue from '../util/PriorityQueue';

export function defaultCost(tile: Tile) {
  if (tile.isCity() && tile.isNeutral()) {
    return tile.getArmies();
  }
  return 1;
}

export function findPathTo(start: Tile, end: ?Tile, gameState: GameState) {
  const goal = (tile) => tile == end;
  return findPath(start, goal, gameState);
}

/**
 * Searches the map for the lowest cost path from start to a tile that satisfies the goal function.
 *
 * @param start The tile to start searching from
 * @param goal  Function that returns true if a tile meets the goal
 * @param gameState The game state to search through
 * @param getCost The function that returns the cost of moving to a tile. Defaults to returning 1.
 * @returns An array of the tiles in the path. Includes start. If no path is found returns an empty array.
 */
export function findPath(
  start: Tile,
  goal: (Tile) => boolean,
  gameState: GameState,
  getCost: (Tile) => number = defaultCost
): ?Tile[] {
  const previous = new Map();
  const costs = new Map();
  const comparator = (a: Tile, b: Tile) => (costs.get(a) || Infinity) - (costs.get(b) || Infinity);
  const queue: PriorityQueue<Tile> = new PriorityQueue(comparator);
  const visited = new Set();
  
  costs.set(start, 0);
  visited.add(start);
  queue.add(start);
  
  let end = null;
  while (!queue.isEmpty()) {
    const currentTile = queue.remove();
    const currentCost = costs.get(currentTile);
    visited.add(currentTile);
    
    if (goal(currentTile)) {
      end = currentTile;
      break;
    }
    
    gameState.getAdjacentTiles(currentTile)
      .filter((adjacentTile) => !adjacentTile.isMountain() && !adjacentTile.isObstale()) // Can't go through mountains
      .filter((adjacentTile) => !visited.has(adjacentTile)) // don't visit nodes twice
      .forEach((adjacentTile) => {
        const possibleCost = currentCost + getCost(adjacentTile);
        const existingCost = costs.get(adjacentTile) || Infinity;
        if (possibleCost < existingCost) {
          costs.set(adjacentTile, possibleCost);
          previous.set(adjacentTile, currentTile);
          if (existingCost == Infinity) {
            queue.add(adjacentTile);
          } else {
            queue.update(adjacentTile);
          }
        }
      });
  }
  
  return buildPath(end, previous)
}

/**
 * Reconstruct the path from a tile back to the start.
 * @param end
 * @param previous
 */
function buildPath(end: ?Tile, previous: Map<Tile, Tile>) {
  const path = [];
  let current = end;
  while (current) {
    path.push(current);
    current = previous.get(current);
  }
  path.reverse();
  return path;
}
