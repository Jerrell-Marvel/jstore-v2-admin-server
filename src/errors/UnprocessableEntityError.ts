import { StatusCodes } from "http-status-codes";

export class UnprocessableEntityError extends Error {
  name = "UnprocessableEntity";
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  }
}
