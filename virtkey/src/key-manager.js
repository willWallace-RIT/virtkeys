const kS = {
  NONE: Symbol('none'),
  PRESSED: Symbol('pressed'),
  DOWN: Symbol('down'),
  UP: Symbol('up')
};
class Key {
  constructor (key) {
    this.key = key;
    this.queue = [];
    this.currentState = kS.NONE;
    window.pubsub.subscribe(`${this.key}_key`, () => { if (this.currentState === kS.NONE) this.queue.push(kS.PRESSED); });
    window.pubsub.subscribe(`${this.key}_key_down`, () => { this.queue.push(kS.DOWN); });
    window.pubsub.subscribe(`${this.key}_key_up`, () => { this.queue.push(kS.UP); });
  }

  update () {
    if (this.queue.length > 0) {
      this.currentState = this.queue.shift();
    } else if (this.currentState === kS.UP) {
      this.currentState = kS.NONE;
    }
  }

  clear () {
    this.queue = [];
    this.currentState = kS.NONE;
  }
}
class KeyManager {
  constructor (keyArr) {
    for (const key of keyArr) {
      this[key] = new Key(key);
    }
  }

  update () {
    for (const key of Object.keys(this)) {
      this[key].update();
    }
  }

  clear () {
    for (const key of Object.keys(this)) {
      this[key].clear();
    }
  }
}
export { kS, Key, KeyManager };
