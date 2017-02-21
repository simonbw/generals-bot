// @flow

/**
 * A not very efficient priority queue implementation.
 */
class PriorityQueue<T> {
  comparator: (T, T) => number;
  _elements: T[];
  _dirty: boolean;
  
  constructor(comparator: (T, T) => number) {
    this.comparator = (a, b) => -1 * comparator(a, b); // we want it in reverse order
    this._elements = [];
    this._dirty = false;
  }
  
  add(element: T) {
    this._elements.push(element);
    this._dirty = true;
  }
  
  /**
   * Update the value of an element.
   * @param element
   */
  update(element: T) {
    this._dirty = true;
  }
  
  _sort() {
    if (this._dirty) {
      this._elements.sort(this.comparator);
    }
    this._dirty = false;
  }
  
  size(): number {
    return this._elements.length;
  }
  
  isEmpty(): boolean {
    return this.size() == 0;
  }
  
  /**
   * Return the lowest element in the queue without removing it.
   */
  peek(): T {
    this._sort();
    return this._elements[this._elements.length - 1];
  }
  
  /**
   * Return and remove the lowest element in the queue.
   */
  remove(): T {
    const result = this.peek();
    this._elements.pop();
    this._dirty = true;
    return result;
  }
}

export default PriorityQueue;