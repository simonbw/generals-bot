// @flow
import PriorityQueue from '../src/util/PriorityQueue';
import test from 'ava';

test('should work', (t) => {
  const queue = new PriorityQueue((a, b) => a - b);
  queue.add(5);
  queue.add(9);
  queue.add(3);
  t.is(queue.size(), 3, 'size should update on add');
  t.is(queue.peek(), 3, 'peek should work');
  t.is(queue.remove(), 3, 'remove should work');
  t.is(queue.size(), 2, 'size should update on remove');
  t.is(queue.peek(), 5, 'peek should work');
  queue.add(12);
  queue.add(4);
  queue.add(4);
  t.is(queue.remove(), 4, 'remove should work');
  t.is(queue.remove(), 4, 'remove should work');
  
});