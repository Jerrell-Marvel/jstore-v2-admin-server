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

type B<T> = {
  name: T;
};

let result: B<string>;

const fn = <T>(): B<T> => {
  const myVar = "smrhg";

  return {
    name: myVar as T,
  };
};

result = fn();

const fn2 = (a: { name: string; age: number } = { name: "asep", age: 5 }) => {};

const fn3 = (test: [number, ...number[]]) => {
  console.log(test);
};

fn3([1]);

const a: number[] = [];

if (a.length > 0) {
  // fn3(a);
}
