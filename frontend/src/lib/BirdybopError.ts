import { stringifyError } from "@/lib/utils";

export default class BirdybopError extends Error {
  public static readonly defaultMessage = "Something went wrong";

  public original?: any;
  public httpStatus: number; // NOTE: This will be NaN for non-network errors.

  constructor(message: string, original?: any) {
    super(message || BirdybopError.defaultMessage);
    this.original = original;
    this.httpStatus = BirdybopError.httpStatusFrom(original);
    if (original instanceof Error) {
      this.stack = original.stack;
    }
  }

  static rethrow(error: any): never {
    throw BirdybopError.from(error);
  }

  static from(error: any): BirdybopError {
    return error instanceof BirdybopError
      ? error
      : new BirdybopError(BirdybopError.messageFrom(error), error);
  }

  static messageFrom(error: any): string {
    return stringifyError(error, BirdybopError.defaultMessage);
  }

  static httpStatusFrom(error: any): number {
    const status = error?.response?.status || error?.status || error?.data?.status;
    return parseInt(status, 10);
  }

  // alias for httpStatus
  get status(): number {
    return this.httpStatus;
  }
}
