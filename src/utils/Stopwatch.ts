export class Stopwatch {
  private _start: bigint | null = null;
  private _end: bigint | null = null;

  public start() {
    this._start = process.hrtime.bigint();
  }

  public stop() {
    if (this._start === null) {
      throw new Error('Must start before stopping');
    }
    this._end = process.hrtime.bigint();
  }

  public get secondsElapsed() {
    return this.millisecondsElapsed / 1_000;
  }

  public get millisecondsElapsed() {
    if (this._start === null || this._end === null) {
      throw new Error('Must be started and stopped');
    }
    return Number(this._end - this._start) / 1_000_000;
  }
}
