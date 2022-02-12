export default abstract class BaseError {
  abstract name: string;

  stack: string | undefined;

  constructor(public message: string) {
    this.stack = new Error().stack;
  }
}
