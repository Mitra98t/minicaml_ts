import { exp } from "./interpreter";

export const expToPrint = (exp: exp, index: number): string => {
  let tree = index != 0 ? "\n" : "";
  let spaces = "";
  for (let i = 0; i < index; i++) {
    spaces += "|  ";
  }
  spaces = colorize(spaces, [Color.FgGray, Color.Dim]);
  tree += spaces;
  switch (exp.name) {
    case "EBool":
    case "EString":
    case "EInt":
      tree += `${colorize(exp.name, [
        Color.FgYellow,
        Color.Underscore,
      ])} ${colorize(exp.value + "", Color.FgCyan)}`;
      break;
    case "Den":
      tree += `${colorize(exp.name, [
        Color.FgYellow,
        Color.Underscore,
      ])} ${colorize(exp.value, Color.FgCyan)}`;
      break;
    case "Plus":
    case "Sub":
    case "Mul":
    case "Div":
    case "Eq":
    case "Neq":
    case "LessThan":
    case "GreaterThan":
    case "LessOrEq":
    case "GreaterOrEq":
    case "And":
    case "Or":
      tree += `${colorize(exp.name, [Color.FgYellow, Color.Underscore])} (`;
      tree += expToPrint(exp.value.v1, index + 1);
      tree += expToPrint(exp.value.v2, index + 1);
      tree += `\n${spaces})`;

      break;
    case "Not":
    case "IsZero":
      tree += `${colorize(exp.name, [Color.FgYellow, Color.Underscore])} (`;
      tree += expToPrint(exp.value, index + 1);
      tree += `\n${spaces})`;
      break;
    case "Let":
      tree += `${colorize(exp.name, [
        Color.FgYellow,
        Color.Underscore,
      ])} ide: ${colorize(exp.value.ide, Color.FgCyan)} (`;
      tree += expToPrint(exp.value.v1, index + 1);
      tree += `\n${spaces}${colorize("|  ", [Color.FgGray, Color.Dim])}in`;
      tree += expToPrint(exp.value.program, index + 1);
      tree += `\n${spaces})`;
      break;

    case "IfThenElse":
      tree += `${colorize(exp.name, [Color.FgYellow, Color.Underscore])} (`;
      tree += expToPrint(exp.value.condition, index + 1);
      tree += expToPrint(exp.value.then, index + 1);
      tree += expToPrint(exp.value.else, index + 1);
      tree += `\n${spaces})`;
      break;
    case "Fun":
      tree += `${colorize(exp.name, [
        Color.FgYellow,
        Color.Underscore,
      ])} arg: ${colorize(exp.value.arg, Color.FgCyan)} (`;
      tree += expToPrint(exp.value.body, index + 1);
      tree += `\n${spaces})`;
      break;
    case "LetRec":
      tree += `${colorize(exp.name, [
        Color.FgYellow,
        Color.Underscore,
      ])} ide: ${colorize(exp.value.funcName, Color.FgCyan)} arg: ${colorize(
        exp.value.arg,
        Color.FgCyan
      )} (`;
      tree += expToPrint(exp.value.body, index + 1);
      tree += `\n${spaces}${colorize("|  ", [Color.FgGray, Color.Dim])}in`;
      tree += expToPrint(exp.value.program, index + 1);
      tree += `\n${spaces})`;
      break;
    case "Apply":
      tree += `${colorize(exp.name, [Color.FgYellow, Color.Underscore])} (`;
      tree += expToPrint(exp.value.func, index + 1);
      tree += expToPrint(exp.value.actArg, index + 1);
      tree += `\n${spaces})`;
      break;
    case "Print":
    default:
      tree += "";
  }
  return tree;
};

export enum Color {
  Reset = "\x1b[0m",
  Bright = "\x1b[1m",
  Dim = "\x1b[2m",
  Underscore = "\x1b[4m",
  Blink = "\x1b[5m",
  Reverse = "\x1b[7m",
  Hidden = "\x1b[8m",

  FgBlack = "\x1b[30m",
  FgRed = "\x1b[31m",
  FgGreen = "\x1b[32m",
  FgYellow = "\x1b[33m",
  FgBlue = "\x1b[34m",
  FgMagenta = "\x1b[35m",
  FgCyan = "\x1b[36m",
  FgWhite = "\x1b[37m",
  FgGray = "\x1b[90m",

  BgBlack = "\x1b[40m",
  BgRed = "\x1b[41m",
  BgGreen = "\x1b[42m",
  BgYellow = "\x1b[43m",
  BgBlue = "\x1b[44m",
  BgMagenta = "\x1b[45m",
  BgCyan = "\x1b[46m",
  BgWhite = "\x1b[47m",
  BgGray = "\x1b[100m",
}

export const colorize = (str: string, color: Color | Color[]): string => {
  if (Array.isArray(color)) {
    return `${color.join("")}${str}${Color.Reset}`;
  }
  return `${color}${str}${Color.Reset}`;
};
