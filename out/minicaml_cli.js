#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const json_colorizer_1 = __importDefault(require("json-colorizer"));
const interpreter_1 = require("./interpreter");
const lexer_1 = require("./lexer");
const Parser_1 = require("./Parser");
const utility_1 = require("./utility");
const args = process.argv.slice(2);
let options = {
    file: "",
    tokens: false,
    ast: false,
};
function main() {
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case "-h":
            case "--help":
                console.log("Usage: minicaml_cli file.mcl [options]");
                console.log("Options:");
                console.log("  -h, --help\t\tShow this help message");
                console.log("  -v, --version\t\tShow version");
                console.log("  --tokens\t\tPrint tokens from lexer");
                console.log("  --ast\t\t\tPrint AST from parser");
                return;
            case "-v":
            case "--version":
                console.log(`MiniCaml_typescript 0.0.11`);
                return;
            case "--tokens":
                options.tokens = true;
                break;
            case "--ast":
                options.ast = true;
                break;
            default:
                if (arg.startsWith("-")) {
                    console.log(`Unknown option ${arg}`);
                    return;
                }
                else {
                    options.file = arg;
                }
        }
    }
    if (options.file === "") {
        console.log("No file specified");
        return;
    }
    if (!fs_1.default.existsSync(options.file)) {
        console.log(`File ${options.file} does not exist`);
        return;
    }
    if (!options.file.endsWith(".mcl")) {
        console.log(`File ${options.file} is not a .mcl file`);
        return;
    }
    executeCode(options.file, options);
}
function executeCode(file, options) {
    const code = fs_1.default.readFileSync(file, "utf-8");
    const lexer = new lexer_1.Lexer(code);
    const tokens = lexer.tokens;
    console.log("");
    if (options.tokens) {
        console.log("Tokens ~~~\n");
        console.log((0, json_colorizer_1.default)(JSON.stringify(tokens), { pretty: true }));
        console.log("");
    }
    const parser = new Parser_1.Parser(tokens);
    const AST = parser.parse();
    if (AST === null) {
        return;
    }
    if (options.ast) {
        console.log("AST ~~~\n");
        console.log((0, utility_1.expToPrint)(AST, 0));
        console.log("");
    }
    try {
        const interpretato = (0, interpreter_1.Eval)(AST, (0, interpreter_1.emptyEnv)());
        console.log("Result ~~~\n");
        console.log((0, json_colorizer_1.default)(JSON.stringify(interpretato), { pretty: true }));
        console.log("");
    }
    catch (error) {
        console.log("");
        console.log(error.message);
        console.log("");
    }
}
main();
