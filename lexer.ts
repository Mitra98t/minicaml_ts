import { Tok, Tokens, TokRecognition } from "./Types";

const matches: TokRecognition[] = [
  // Ignorables
  { id: Tokens.newLine, match: /^\n/ },
  { id: Tokens.whiteSpace, match: /^[ \t]+/ },
  { id: Tokens.endOfFile, match: /^$/ },

  // Cmments
  { id: Tokens.comment, match: /^\/\/.*/ }, // Single line comments
  { id: Tokens.comment, match: /^\/\*[\s\S]*?\*\// }, // Multi line comments

  // Symbols
  { id: Tokens.lpar, match: /^\(/ },
  { id: Tokens.rpar, match: /^\)/ },
  { id: Tokens.lbra, match: /^\{/ },
  { id: Tokens.rbra, match: /^\}/ },

  // Equality Operators
  { id: Tokens.equalityOperator, match: /^[!=]=/ },

  // Arrow
  { id: Tokens.arrow, match: /^\-\>/ },
  //
  // Assignments
  { id: Tokens.assign, match: /^\=/ },

  // Keywords
  { id: Tokens.let, match: /^\blet\b/ },
  { id: Tokens.letRec, match: /^\bletrec\b/ },
  { id: Tokens.fun, match: /^\bfun\b/ },
  { id: Tokens.if, match: /^\bif\b/ },
  { id: Tokens.else, match: /^\belse\b/ },
  { id: Tokens.true, match: /^\btrue\b/ },
  { id: Tokens.false, match: /^\bfalse\b/ },
  { id: Tokens.apply, match: /^\bapply\b/ },
  { id: Tokens.in, match: /^\bin\b/ },
  { id: Tokens.IsZero, match: /^\biszero\b/ },
  { id: Tokens.print, match: /^\bprint\b/ },

  // Identifier
  { id: Tokens.identifier, match: /^[a-zA-Z][a-zA-Z_0-9]*/ },

  // Operators
  // Matematical Operator
  { id: Tokens.additiveOperator, match: /^[+\-]/ },
  { id: Tokens.multiplicativeOperator, match: /^[*\/]/ },
  // Relational Operators
  { id: Tokens.relationalOperator, match: /^[><]?=/ },
  // Logical Operators
  { id: Tokens.logicOR, match: /^\|\|/ },
  { id: Tokens.logicAND, match: /^&&/ },
  { id: Tokens.logicalNOT, match: /^!/ },

  // Literals
  // String
  { id: Tokens.string, match: /^"(?:\\["\\]|[^\n"\\])*"/ }, // String using "
  { id: Tokens.string, match: /^'(?:\\['\\]|[^\n'\\])*'/ }, // String using '
  // Number
  { id: Tokens.number, match: /^\b\d+\b/ },
  // { id: Tokens.number, match: /^0|[1-9][0-9]*/ },
];

export class Lexer {
  code: string;
  tokens: Tok[];
  idx: number = -1;

  constructor(code: string) {
    this.code = code;
    this.tokens = [];
    this.tokenize();
  }

  /**
   * return next token inside the token list
   */
  nextToken(): Tok | null {
    this.idx += 1;
    if (this.idx >= this.tokens.length) {
      this.idx = this.tokens.length - 1;
      return null;
    }
    return this.tokens[this.idx];
  }
  /**
   * return previous token inside the token list
   */
  prevToken(): Tok | null {
    this.idx -= 1;
    if (this.idx < 0) {
      this.idx = 0;
      return null;
    }
    return this.tokens[this.idx];
  }
  /**
   * Get current token inside the token list
   */
  getToken(): Tok | null {
    if (this.idx > 0 && this.idx < this.tokens.length)
      return this.tokens[this.idx];
    return null;
  }

  tokenize(): Tok[] {
    let line: number = 0;
    let char: number = 0;
    let pos: number = 0;
    let code = this.code;
    let error = false;

    while (code.length > 0 && !error) {
      let tok: Tokens = Tokens.invalid;
      let stringa: string = "";
      let found: boolean = false;
      let matchLen: number = 0;

      for (let i = 0; i < matches.length; i++) {
        const m = matches[i];
        let match = code.match(m.match);
        if (match?.[0] != null && !found) {
          found = true;
          tok = m.id;
          if (tok == Tokens.string)
            stringa = match[0].substring(1, match[0].length - 1);
          else stringa = match[0];
          code = code.substring(match[0].length);
          pos += match[0].length;
          matchLen += match[0].length;
        }
      }

      if (tok == Tokens.newLine) {
        line++;
        char = 0;
      }

      if (tok == Tokens.invalid) {
        stringa =
          "Unknown token at line " +
          (line + 1) +
          " char " +
          (char + (line == 0 ? 1 : 0));
        error = true;
        throw new Error(stringa);
      }

      // Check for tokens to skyp
      if (
        [
          Tokens.whiteSpace,
          Tokens.comment,
          Tokens.newLine,
          Tokens.endOfFile,
        ].indexOf(tok) == -1
      )
        this.tokens.push({
          word: stringa,
          type: tok,
          line: line + 1,
          col: char + (line == 0 ? 1 : 0),
        });
      char += matchLen;
    }
    // UNCOMMENT to include EOF
    if (!error)
      this.tokens.push({
        word: "end of file",
        type: Tokens.endOfFile,
        line: line + 1,
        col: char + (line == 0 ? 1 : 0),
      });

    return this.tokens;
  }
}
