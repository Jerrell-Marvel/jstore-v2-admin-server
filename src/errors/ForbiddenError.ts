import { StatusCodes } from "http-status-codes";

export class ForbiddenError extends Error {
  name = "ForbiddenError";
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
