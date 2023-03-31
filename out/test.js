"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interpreter_1 = require("./interpreter");
const lexer_1 = require("./lexer");
const Parser_1 = require("./Parser");
const json_colorizer_1 = __importDefault(require("json-colorizer"));
let codes = {
    varDeclaration: `
let x = 2 in x
  `,
    addition: `
1 + 2
`,
    sommaDiVariabilie: `
let x = 2 in 
let y = 3 in 
x + y
`,
    funzione: `
let f = fun x -> {x + 1} in
apply(f, 2)
`,
    funzioneMultiParametro: `
let f = fun x -> {
  let g = fun y -> {
    x + y
  }
  in apply(g, 2)
}
in apply(f, 3)
`,
    stringa: `
let s = "ciao" in s
`,
    stringa2: `
let s = 'ciao' in s
`,
    //   funzioneRicorsiva: `
    //   letrec f = fun x -> {
    //     if(x == 0){
    //       1
    //     }
    //     else{
    //       x + apply(f, x - 1)
    //     }
    //   }
    //   in apply(f, 3)
    // `,
};
Object.keys(codes).forEach((key) => {
    let code = codes[key];
    console.log(`Parsing ${key} code: ${code}`);
    // console.log("Tokens: ");
    // console.log(new Lexer(code).tokens);
    let parser = new Parser_1.Parser(new lexer_1.Lexer(code).tokens);
    let AST = parser.parse();
    console.log((0, json_colorizer_1.default)(JSON.stringify(AST), { pretty: true }));
    let interpretato = (0, interpreter_1.Eval)(AST, (0, interpreter_1.emptyEnv)());
    console.log("Result: ");
    console.log(interpretato);
});
