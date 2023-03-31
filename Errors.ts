import { Color, colorize } from "./utility";

export enum ErrorType {
  Lexer = "Lexer",
  Parser = "Parser",
  CLI = "CLI",
  Interpreter = "Interpreter",
}

export class Errors {
  static printError(error: string, type: ErrorType): void {
    console.log("");
    console.log(colorize(`${type} Error:`, Color.FgRed));
    console.log(error);
    console.log("");
  }
}
