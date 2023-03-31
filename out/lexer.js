"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const Types_1 = require("./Types");
const matches = [
    // Ignorables
    { id: Types_1.Tokens.newLine, match: /^\n/ },
    { id: Types_1.Tokens.whiteSpace, match: /^[ \t]+/ },
    { id: Types_1.Tokens.endOfFile, match: /^$/ },
    // Cmments
    { id: Types_1.Tokens.comment, match: /^\/\/.*/ },
    { id: Types_1.Tokens.comment, match: /^\/\*[\s\S]*?\*\// },
    // Symbols
    { id: Types_1.Tokens.lpar, match: /^\(/ },
    { id: Types_1.Tokens.rpar, match: /^\)/ },
    { id: Types_1.Tokens.lbra, match: /^\{/ },
    { id: Types_1.Tokens.rbra, match: /^\}/ },
    // Equality Operators
    { id: Types_1.Tokens.equalityOperator, match: /^[!=]=/ },
    // Arrow
    { id: Types_1.Tokens.arrow, match: /^\-\>/ },
    //
    // Assignments
    { id: Types_1.Tokens.assign, match: /^\=/ },
    // Keywords
    { id: Types_1.Tokens.let, match: /^\blet\b/ },
    { id: Types_1.Tokens.letRec, match: /^\bletrec\b/ },
    { id: Types_1.Tokens.fun, match: /^\bfun\b/ },
    { id: Types_1.Tokens.if, match: /^\bif\b/ },
    { id: Types_1.Tokens.else, match: /^\belse\b/ },
    { id: Types_1.Tokens.true, match: /^\btrue\b/ },
    { id: Types_1.Tokens.false, match: /^\bfalse\b/ },
    { id: Types_1.Tokens.apply, match: /^\bapply\b/ },
    { id: Types_1.Tokens.in, match: /^\bin\b/ },
    { id: Types_1.Tokens.IsZero, match: /^\biszero\b/ },
    { id: Types_1.Tokens.print, match: /^\bprint\b/ },
    // Identifier
    { id: Types_1.Tokens.identifier, match: /^[a-zA-Z][a-zA-Z_0-9]*/ },
    // Operators
    // Matematical Operator
    { id: Types_1.Tokens.additiveOperator, match: /^[+\-]/ },
    { id: Types_1.Tokens.multiplicativeOperator, match: /^[*\/]/ },
    // Relational Operators
    { id: Types_1.Tokens.relationalOperator, match: /^[><]?=/ },
    // Logical Operators
    { id: Types_1.Tokens.logicOR, match: /^\|\|/ },
    { id: Types_1.Tokens.logicAND, match: /^&&/ },
    { id: Types_1.Tokens.logicalNOT, match: /^!/ },
    // Literals
    // String
    { id: Types_1.Tokens.string, match: /^"(?:\\["\\]|[^\n"\\])*"/ },
    { id: Types_1.Tokens.string, match: /^'(?:\\['\\]|[^\n'\\])*'/ },
    // Number
    { id: Types_1.Tokens.number, match: /^0|[1-9][0-9]*/ },
];
class Lexer {
    constructor(code) {
        this.idx = -1;
        this.code = code;
        this.tokens = [];
        this.tokenize();
    }
    /**
     * return next token inside the token list
     */
    nextToken() {
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
    prevToken() {
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
    getToken() {
        if (this.idx > 0 && this.idx < this.tokens.length)
            return this.tokens[this.idx];
        return null;
    }
    tokenize() {
        let line = 0;
        let char = 0;
        let pos = 0;
        let code = this.code;
        let error = false;
        while (code.length > 0 && !error) {
            let tok = Types_1.Tokens.invalid;
            let string = "";
            let found = false;
            let matchLen = 0;
            for (let i = 0; i < matches.length; i++) {
                const m = matches[i];
                let match = code.match(m.match);
                if ((match === null || match === void 0 ? void 0 : match[0]) != null && !found) {
                    found = true;
                    tok = m.id;
                    if (tok == Types_1.Tokens.string)
                        string = match[0].substring(1, match[0].length - 1);
                    else
                        string = match[0];
                    code = code.substring(match[0].length);
                    pos += match[0].length;
                    matchLen += match[0].length;
                }
            }
            if (tok == Types_1.Tokens.newLine) {
                line++;
                char = 0;
            }
            if (tok == Types_1.Tokens.invalid) {
                string = "error at line " + line + " char " + (char + 1);
                error = true;
            }
            // Check for tokens to skyp
            if ([
                Types_1.Tokens.whiteSpace,
                Types_1.Tokens.comment,
                Types_1.Tokens.newLine,
                Types_1.Tokens.endOfFile,
            ].indexOf(tok) == -1)
                this.tokens.push({
                    word: string,
                    type: tok,
                    line: line,
                    col: char + (line == 0 ? 1 : 0),
                });
            char += matchLen;
        }
        // UNCOMMENT to include EOF
        if (!error)
            this.tokens.push({
                word: "end of file",
                type: Types_1.Tokens.endOfFile,
                line: line,
                col: char + (line == 0 ? 1 : 0),
            });
        return this.tokens;
    }
}
exports.Lexer = Lexer;
