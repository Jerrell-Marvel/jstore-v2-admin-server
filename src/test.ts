import { NextFunction, Request, Response } from "express";

export type Language = "en" | "es" | "it";

export interface LanguageRequest extends Request {
  language: Language;
}

export const HelloWorldController = {
  default: async (req: LanguageRequest, res: Response, next: NextFunction) => {
    let message;

    switch (req.language) {
      default:
      case "en": {
        message = "Hello, World!";
        break;
      }
      case "es": {
        message = "¡Hola, mundo!";
        break;
      }
      case "it": {
        message = "Ciao, mondo!";
        break;
      }
    }

    res.json(message);
  },
  // other requests...
};