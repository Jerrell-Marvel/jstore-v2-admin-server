import { StatusCodes } from "http-status-codes";

export class InternalServerError extends Error {
  name = "InternalServerError";
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
