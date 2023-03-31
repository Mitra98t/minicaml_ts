"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorize = exports.Color = exports.expToPrint = void 0;
const expToPrint = (exp, index) => {
    let tree = index != 0 ? "\n" : "";
    let spaces = "";
    for (let i = 0; i < index; i++) {
        spaces += "|  ";
    }
    spaces = (0, exports.colorize)(spaces, [Color.FgGray, Color.Dim]);
    tree += spaces;
    switch (exp.name) {
        case "EBool":
        case "EString":
        case "EInt":
            tree += `${(0, exports.colorize)(exp.name, [
                Color.FgYellow,
                Color.Underscore,
            ])} ${(0, exports.colorize)(exp.value + "", Color.FgCyan)}`;
            break;
        case "Den":
            tree += `${(0, exports.colorize)(exp.name, [
                Color.FgYellow,
                Color.Underscore,
            ])} ${(0, exports.colorize)(exp.value, Color.FgCyan)}`;
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
            tree += `${(0, exports.colorize)(exp.name, [Color.FgYellow, Color.Underscore])} (`;
            tree += (0, exports.expToPrint)(exp.value.v1, index + 1);
            tree += (0, exports.expToPrint)(exp.value.v2, index + 1);
            tree += `\n${spaces})`;
            break;
        case "Not":
        case "IsZero":
            tree += `${(0, exports.colorize)(exp.name, [Color.FgYellow, Color.Underscore])} (`;
            tree += (0, exports.expToPrint)(exp.value, index + 1);
            tree += `\n${spaces})`;
            break;
        case "Let":
            tree += `${(0, exports.colorize)(exp.name, [
                Color.FgYellow,
                Color.Underscore,
            ])} ide: ${(0, exports.colorize)(exp.value.ide, Color.FgCyan)} (`;
            tree += (0, exports.expToPrint)(exp.value.v1, index + 1);
            tree += `\n${spaces}${(0, exports.colorize)("|  ", [Color.FgGray, Color.Dim])}in`;
            tree += (0, exports.expToPrint)(exp.value.program, index + 1);
            tree += `\n${spaces})`;
            break;
        case "IfThenElse":
            tree += `${(0, exports.colorize)(exp.name, [Color.FgYellow, Color.Underscore])} (`;
            tree += (0, exports.expToPrint)(exp.value.condition, index + 1);
            tree += (0, exports.expToPrint)(exp.value.then, index + 1);
            tree += (0, exports.expToPrint)(exp.value.else, index + 1);
            tree += `\n${spaces})`;
            break;
        case "Fun":
            tree += `${(0, exports.colorize)(exp.name, [
                Color.FgYellow,
                Color.Underscore,
            ])} arg: ${(0, exports.colorize)(exp.value.arg, Color.FgCyan)} (`;
            tree += (0, exports.expToPrint)(exp.value.body, index + 1);
            tree += `\n${spaces})`;
            break;
        case "LetRec":
            tree += `${(0, exports.colorize)(exp.name, [
                Color.FgYellow,
                Color.Underscore,
            ])} ide: ${(0, exports.colorize)(exp.value.funcName, Color.FgCyan)} arg: ${(0, exports.colorize)(exp.value.arg, Color.FgCyan)} (`;
            tree += (0, exports.expToPrint)(exp.value.body, index + 1);
            tree += `\n${spaces}${(0, exports.colorize)("|  ", [Color.FgGray, Color.Dim])}in`;
            tree += (0, exports.expToPrint)(exp.value.program, index + 1);
            tree += `\n${spaces})`;
            break;
        case "Apply":
            tree += `${(0, exports.colorize)(exp.name, [Color.FgYellow, Color.Underscore])} (`;
            tree += (0, exports.expToPrint)(exp.value.func, index + 1);
            tree += (0, exports.expToPrint)(exp.value.actArg, index + 1);
            tree += `\n${spaces})`;
            break;
        case "Print":
        default:
            tree += "";
    }
    return tree;
};
exports.expToPrint = expToPrint;
var Color;
(function (Color) {
    Color["Reset"] = "\u001B[0m";
    Color["Bright"] = "\u001B[1m";
    Color["Dim"] = "\u001B[2m";
    Color["Underscore"] = "\u001B[4m";
    Color["Blink"] = "\u001B[5m";
    Color["Reverse"] = "\u001B[7m";
    Color["Hidden"] = "\u001B[8m";
    Color["FgBlack"] = "\u001B[30m";
    Color["FgRed"] = "\u001B[31m";
    Color["FgGreen"] = "\u001B[32m";
    Color["FgYellow"] = "\u001B[33m";
    Color["FgBlue"] = "\u001B[34m";
    Color["FgMagenta"] = "\u001B[35m";
    Color["FgCyan"] = "\u001B[36m";
    Color["FgWhite"] = "\u001B[37m";
    Color["FgGray"] = "\u001B[90m";
    Color["BgBlack"] = "\u001B[40m";
    Color["BgRed"] = "\u001B[41m";
    Color["BgGreen"] = "\u001B[42m";
    Color["BgYellow"] = "\u001B[43m";
    Color["BgBlue"] = "\u001B[44m";
    Color["BgMagenta"] = "\u001B[45m";
    Color["BgCyan"] = "\u001B[46m";
    Color["BgWhite"] = "\u001B[47m";
    Color["BgGray"] = "\u001B[100m";
})(Color = exports.Color || (exports.Color = {}));
const colorize = (str, color) => {
    if (Array.isArray(color)) {
        return `${color.join("")}${str}${Color.Reset}`;
    }
    return `${color}${str}${Color.Reset}`;
};
exports.colorize = colorize;
