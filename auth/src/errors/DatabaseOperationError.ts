import { CustomError } from "./CustomError";

export class DatabaseOperationError extends CustomError {
  public statusCode = 500;
  constructor() {
    super();

    //
    Object.setPrototypeOf(this, DatabaseOperationError.prototype);
  }
  serializeErrors() {
    return [{ message: "Database Operation failed" }];
  }
}
