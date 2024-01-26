import { StatusCodes } from "http-status-codes";

export class BadRequestError extends Error {
  name = "BadRequestError";
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
