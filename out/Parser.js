"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const Types_1 = require("./Types");
class Parser {
    constructor(tokens, debugPrints = false) {
        this.tokens = tokens;
        this.currentTokenIndex = 0;
        this.debugPrints = debugPrints;
    }
    parse() {
        if (this.debugPrints)
            console.log(this.tokens);
        let parseProg = null;
        try {
            parseProg = this.parseProgram();
        }
        catch (error) {
            console.log("");
            console.log(error.message);
            console.log("");
        }
        return parseProg;
    }
    //<program> ::= <statement> | <statement> <program>
    parseProgram(stopOnRBra = false) {
        // Implementa la logica per <program>
        let statements = [];
        while (this.peekToken().type != Types_1.Tokens.endOfFile &&
            this.peekToken().type != Types_1.Tokens.rbra) {
            statements.push(this.parseStatement());
        }
        return statements[0];
    }
    //<statement> ::= <var-definition> | <letrec-definition> | <expression>
    parseStatement() {
        // Implementa la logica per <statement>
        switch (this.peekToken().type) {
            case Types_1.Tokens.print:
                return this.parsePrint();
            case Types_1.Tokens.let:
                return this.parseVarDefinition();
            case Types_1.Tokens.letRec:
                return this.parseLetRecDefinition();
            default:
                return this.parseExpression();
        }
    }
    parsePrint() {
        this.consume(Types_1.Tokens.print);
        const exp = this.parseExpression();
        const program = this.parseProgram();
        return { name: "Print", value: { toPrint: exp, program: program } };
    }
    //<var-definition> ::= "let" <identifier> "=" <value> "in" <program>
    parseVarDefinition() {
        // Implementa la logica per <var-definition>
        this.consume(Types_1.Tokens.let);
        const ide = this.parseIdentifier();
        this.consume(Types_1.Tokens.assign);
        const value = this.parseValue();
        this.consume(Types_1.Tokens.in);
        const program = this.parseProgram();
        return { name: "Let", value: { ide: ide, v1: value, program: program } };
    }
    //<letrec-definition> ::= "letrec" <identifier> "=" <function> "in" <program>
    parseLetRecDefinition() {
        // Implementa la logica per <letrec-definition>
        this.consume(Types_1.Tokens.letRec);
        const ide = this.parseIdentifier();
        this.consume(Types_1.Tokens.assign);
        const func = this.parseFunction();
        this.consume(Types_1.Tokens.in);
        const program = this.parseProgram();
        if (func.name != "Fun")
            throw new Error("Expected function");
        return {
            name: "LetRec",
            value: {
                funcName: ide,
                arg: func.value.arg,
                body: func.value.body,
                program: program,
            },
        };
    }
    parseIdentifier() {
        const ide = this.consume(Types_1.Tokens.identifier);
        if (ide == null)
            throw new Error("Expected identifier");
        return ide.word;
    }
    //<value> ::= <expression> | <function>
    parseValue() {
        // Implementa la logica per <value>
        if (this.peekToken().type == Types_1.Tokens.fun)
            return this.parseFunction();
        else
            return this.parseExpression();
    }
    //<function> ::= "fun" <identifier> "->" "{" <program> "}"
    parseFunction() {
        // Implementa la logica per <function>
        this.consume(Types_1.Tokens.fun);
        const ide = this.parseIdentifier();
        this.consume(Types_1.Tokens.arrow);
        this.consume(Types_1.Tokens.lbra);
        const program = this.parseProgram();
        this.consume(Types_1.Tokens.rbra);
        return { name: "Fun", value: { arg: ide, body: program } };
    }
    parseExpression() {
        return this.parseLogicOR();
    }
    parseLogicOR() {
        let left = this.parseLogicAND();
        while (this.peekToken().type == Types_1.Tokens.logicOR) {
            this.consume(Types_1.Tokens.logicOR);
            let right = this.parseLogicAND();
            left = { name: "Or", value: { v1: left, v2: right } };
        }
        return left;
    }
    parseLogicAND() {
        let left = this.parseEquality();
        while (this.peekToken().type == Types_1.Tokens.logicAND) {
            this.consume(Types_1.Tokens.logicAND);
            let right = this.parseEquality();
            left = { name: "And", value: { v1: left, v2: right } };
        }
        return left;
    }
    parseEquality() {
        let left = this.parseComparison();
        while (this.peekToken().type == Types_1.Tokens.equalityOperator) {
            const op = this.consume(Types_1.Tokens.equalityOperator);
            let right = this.parseComparison();
            if (!op)
                throw new Error("Expected operator");
            //TODO if else comentati sono l'implementazione del not equal che in minicaml manca
            if (op.word == "==")
                left = { name: "Eq", value: { v1: left, v2: right } };
            else
                left = { name: "Neq", value: { v1: left, v2: right } };
        }
        return left;
    }
    parseComparison() {
        let left = this.parseTerm();
        while (this.peekToken().type == Types_1.Tokens.relationalOperator) {
            const op = this.consume(Types_1.Tokens.relationalOperator);
            let right = this.parseTerm();
            if (!op)
                throw new Error("Expected operator");
            switch (op.word) {
                case "<":
                    left = { name: "LessThan", value: { v1: left, v2: right } };
                    break;
                case ">":
                    left = { name: "GreaterThan", value: { v1: left, v2: right } };
                    break;
                case "<=":
                    left = { name: "LessOrEq", value: { v1: left, v2: right } };
                    break;
                case ">=":
                    left = { name: "GreaterOrEq", value: { v1: left, v2: right } };
                    break;
            }
        }
        return left;
    }
    parseTerm() {
        let left = this.parseFactor();
        while (this.peekToken().type == Types_1.Tokens.additiveOperator) {
            const op = this.consume(Types_1.Tokens.additiveOperator);
            let right = this.parseFactor();
            if (!op)
                throw new Error("Expected operator");
            if (op.word == "+")
                left = { name: "Plus", value: { v1: left, v2: right } };
            else
                left = { name: "Sub", value: { v1: left, v2: right } };
        }
        return left;
    }
    parseFactor() {
        let left = this.parseUnary();
        while (this.peekToken().type == Types_1.Tokens.multiplicativeOperator) {
            const op = this.consume(Types_1.Tokens.multiplicativeOperator);
            let right = this.parseUnary();
            if (!op)
                throw new Error("Expected operator");
            if (op.word == "*")
                left = { name: "Mul", value: { v1: left, v2: right } };
            else
                left = { name: "Div", value: { v1: left, v2: right } };
        }
        return left;
    }
    parseUnary() {
        if (this.peekToken().type == Types_1.Tokens.IsZero) {
            let op = this.consume(Types_1.Tokens.IsZero);
            let right = this.parseUnary();
            if (!op)
                throw new Error("Expected operator");
            return { name: "IsZero", value: right };
        }
        if (this.peekToken().type == Types_1.Tokens.logicalNOT) {
            let op = this.consume(Types_1.Tokens.logicalNOT);
            let right = this.parseUnary();
            if (!op)
                throw new Error("Expected operator");
            return { name: "Not", value: right };
        }
        return this.parsePrimary();
    }
    parsePrimary() {
        let token = this.peekToken();
        switch (token.type) {
            case Types_1.Tokens.number:
                return this.parseNumber();
            case Types_1.Tokens.true:
            case Types_1.Tokens.false:
                return this.parseBoolean();
            case Types_1.Tokens.string:
                return this.parseString();
            case Types_1.Tokens.identifier:
                return { name: "Den", value: this.parseIdentifier() };
            case Types_1.Tokens.lpar:
                this.consume(Types_1.Tokens.lpar);
                let exp = this.parseExpression();
                this.consume(Types_1.Tokens.rpar);
                return exp;
            //TODO check this case
            case Types_1.Tokens.fun:
                return this.parseFunction();
            case Types_1.Tokens.if:
                return this.parseFlowControl();
            case Types_1.Tokens.apply:
                return this.parseFunctionCall();
            default:
                throw new Error("Expected primary expression");
        }
    }
    parseNumber() {
        const num = this.consume(Types_1.Tokens.number);
        if (num == null)
            throw new Error("Expected number");
        return { name: "EInt", value: +num.word };
    }
    parseString() {
        const str = this.consume(Types_1.Tokens.string);
        if (str == null)
            throw new Error("Expected string");
        return { name: "EString", value: str.word };
    }
    parseBoolean() {
        let bool;
        if (this.peekToken().type == Types_1.Tokens.true)
            bool = this.consume(Types_1.Tokens.true);
        else
            bool = this.consume(Types_1.Tokens.false);
        if (bool == null)
            throw new Error("Expected boolean");
        return { name: "EBool", value: bool.word == "true" };
    }
    //<function-call> ::= "apply(" <identifier> "," <value> ")"
    parseFunctionCall() {
        // Implementa la logica per <function-call>
        this.consume(Types_1.Tokens.apply);
        this.consume(Types_1.Tokens.lpar);
        const func = this.parseValue();
        const value = this.parseValue();
        this.consume(Types_1.Tokens.rpar);
        return { name: "Apply", value: { func: func, actArg: value } };
    }
    //<flow-control> ::= "if(" <bool-expr> "){" <program> "}else{" <program> "}"
    parseFlowControl() {
        // Implementa la logica per <flow-control>
        this.consume(Types_1.Tokens.if);
        this.consume(Types_1.Tokens.lpar);
        const boolExpr = this.parseExpression();
        if (!boolExpr) {
            throw new Error("Expected expression");
        }
        this.consume(Types_1.Tokens.rpar);
        this.consume(Types_1.Tokens.lbra);
        const thenProg = this.parseProgram();
        this.consume(Types_1.Tokens.rbra);
        this.consume(Types_1.Tokens.else);
        this.consume(Types_1.Tokens.lbra);
        const elseProg = this.parseProgram();
        this.consume(Types_1.Tokens.rbra);
        return {
            name: "IfThenElse",
            value: { condition: boolExpr, then: thenProg, else: elseProg },
        };
    }
    nextToken() {
        if (this.debugPrints)
            console.log(this.tokens[this.currentTokenIndex]);
        this.currentTokenIndex++;
        return this.tokens[this.currentTokenIndex - 1];
    }
    peekToken() {
        return this.tokens[this.currentTokenIndex];
    }
    consume(type) {
        if (this.peekToken().type === type) {
            return this.nextToken();
        }
        throw new Error("Expected token " +
            type +
            " but found " +
            this.peekToken().type +
            " at line " +
            this.peekToken().line +
            " and column " +
            this.peekToken().col);
    }
    expectToken(type) {
        if (this.peekToken().type === type) {
            this.nextToken();
            return true;
        }
        return false;
    }
}
exports.Parser = Parser;
