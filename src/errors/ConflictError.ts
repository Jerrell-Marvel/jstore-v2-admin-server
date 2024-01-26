import { StatusCodes } from "http-status-codes";

export class ConflictError extends Error {
  name = "ConflictError";
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}
