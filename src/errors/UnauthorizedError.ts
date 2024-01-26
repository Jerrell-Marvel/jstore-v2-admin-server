import { StatusCodes } from "http-status-codes";

export class UnauthorizedError extends Error {
  name = "UnauthorizedError";
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
