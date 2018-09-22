export class Subscription {
  private stop?: () => void;

  constructor(stop?: () => void) {
    this.stop = stop;
  }

  public cancel() {
    if (this.stop) {
      this.stop();
      this.stop = undefined;
    }
  }
}
