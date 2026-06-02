export class Stopwatch {
  _start: bigint | null = null;
  _end: bigint | null = null;

  start() {
    this._start = process.hrtime.bigint();
  }

  stop() {
    if (this._start === null) {
      throw new Error('Must start before stopping');
    }
    this._end = process.hrtime.bigint();
  }

  get secondsElapsed() {
    return this.millisecondsElapsed / 1_000;
  }

  get millisecondsElapsed() {
    if (this._start === null || this._end === null) {
      throw new Error('Must be started and stopped');
    }
    return Number(this._end - this._start) / 1_000_000;
  }
}
