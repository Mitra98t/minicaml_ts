#!/usr/bin/env node

import fs from "fs";
import jsonColors from "json-colorizer";
import { emptyEnv, Eval } from "./interpreter";

import { Lexer } from "./lexer";
import { Parser } from "./Parser";
import { Color, colorize, expToPrint } from "./utility";

const args = process.argv.slice(2);

let options = {
  file: "",
  tokens: false,
  ast: false,
};

function helpPrint() {
  console.log(
    `\n${colorize("Usage:", [
      Color.FgYellow,
    ])} minicaml_ts file.mcl [options]\n`
  );
  console.log(`${colorize("Options:", [Color.FgYellow])}`);
  console.log("  -h, --help\t\tShow this help message");
  console.log("  -v, --version\t\tShow version");
  console.log("  --tokens\t\tPrint tokens from lexer");
  console.log("  --ast\t\t\tPrint AST from parser\n");
}

function main() {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "-h":
      case "--help":
        helpPrint();
        return;
      case "-v":
      case "--version":
        console.log(`MiniCaml_typescript ${colorize("V.0.0.14", Color.FgBlue)}`);
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
          helpPrint();
          return;
        } else {
          options.file = arg;
        }
    }
  }

  if (options.file === "") {
    console.log("No file specified");
    return;
  }

  if (!fs.existsSync(options.file)) {
    console.log(`File ${options.file} does not exist`);
    return;
  }
  if (!options.file.endsWith(".mcl")) {
    console.log(`File ${options.file} is not a .mcl file`);
    return;
  }

  executeCode(options.file, options);
}

function executeCode(file: string, options: { tokens: boolean; ast: boolean }) {
  const code = fs.readFileSync(file, "utf-8");
  const lexer = new Lexer(code);
  const tokens = lexer.tokens;
  console.log("");
  if (options.tokens) {
    console.log("Tokens ~~~\n");
    console.log(jsonColors(JSON.stringify(tokens), { pretty: true }));
    console.log("");
  }
  const parser = new Parser(tokens);
  const AST = parser.parse();
  if (AST === null) {
    return;
  }
  if (options.ast) {
    console.log("AST ~~~\n");
    console.log(expToPrint(AST, 0));
    console.log("");
  }
  try {
    const interpretato = Eval(AST, emptyEnv());
    console.log("Result ~~~\n");
    console.log(jsonColors(JSON.stringify(interpretato), { pretty: true }));
    console.log("");
  } catch (error: any) {
    console.log("");
    console.log(error.message);
    console.log("");
  }
}

main();
