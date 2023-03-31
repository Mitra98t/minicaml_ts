import { emptyEnv, Eval } from "./interpreter";
import { Lexer } from "./lexer";
import { Parser } from "./Parser";
import jsonColors from "json-colorizer";

let codes: any = {
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
  let code: any = codes[key];
  console.log(`Parsing ${key} code: ${code}`);
  // console.log("Tokens: ");
  // console.log(new Lexer(code).tokens);
  let parser = new Parser(new Lexer(code).tokens);
  let AST = parser.parse();
  console.log(jsonColors(JSON.stringify(AST), { pretty: true }));
  let interpretato = Eval(AST, emptyEnv());
  console.log("Result: ");
  console.log(interpretato);
});
