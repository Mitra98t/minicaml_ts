import { exp, ide } from "./interpreter";
import { Lexer } from "./lexer";
import { Tok, Tokens } from "./Types";

export class Parser {
  private tokens: Tok[];
  private currentTokenIndex: number;
  private debugPrints: boolean;

  constructor(tokens: Tok[], debugPrints = false) {
    this.tokens = tokens;
    this.currentTokenIndex = 0;
    this.debugPrints = debugPrints;
  }

  parse(): exp | null {
    if (this.debugPrints) console.log(this.tokens);
    let parseProg: exp | null = null;
    try {
      parseProg = this.parseProgram();
    } catch (error: any) {
      console.log("");
      console.log(error.message);
      console.log("");
    }
    return parseProg;
  }

  //<program> ::= <statement> | <statement> <program>
  private parseProgram(stopOnRBra = false): exp {
    // Implementa la logica per <program>
    let statements = [];
    while (
      this.peekToken().type != Tokens.endOfFile &&
      this.peekToken().type != Tokens.rbra
    ) {
      statements.push(this.parseStatement());
    }
    return statements[0];
  }

  //<statement> ::= <var-definition> | <letrec-definition> | <expression>
  private parseStatement(): exp {
    // Implementa la logica per <statement>
    switch (this.peekToken().type) {
      case Tokens.print:
        return this.parsePrint();
      case Tokens.let:
        return this.parseVarDefinition();
      case Tokens.letRec:
        return this.parseLetRecDefinition();
      default:
        return this.parseExpression();
    }
  }

  private parsePrint(): exp {
    this.consume(Tokens.print);
    const exp = this.parseExpression();
    const program = this.parseProgram();
    return { name: "Print", value: { toPrint: exp, program: program } };
  }

  //<var-definition> ::= "let" <identifier> "=" <value> "in" <program>
  private parseVarDefinition(): exp {
    // Implementa la logica per <var-definition>
    this.consume(Tokens.let);
    const ide = this.parseIdentifier();
    this.consume(Tokens.assign);
    const value = this.parseValue();
    this.consume(Tokens.in);
    const program = this.parseProgram();
    return { name: "Let", value: { ide: ide, v1: value, program: program } };
  }

  //<letrec-definition> ::= "letrec" <identifier> "=" <function> "in" <program>
  private parseLetRecDefinition(): exp {
    // Implementa la logica per <letrec-definition>
    this.consume(Tokens.letRec);
    const ide = this.parseIdentifier();
    this.consume(Tokens.assign);
    const func = this.parseFunction();
    this.consume(Tokens.in);
    const program = this.parseProgram();
    if (func.name != "Fun") throw new Error("Expected function");
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

  private parseIdentifier(): ide {
    const ide = this.consume(Tokens.identifier);
    if (ide == null) throw new Error("Expected identifier");
    return ide.word;
  }

  //<value> ::= <expression> | <function>
  private parseValue(): exp {
    // Implementa la logica per <value>
    if (this.peekToken().type == Tokens.fun) return this.parseFunction();
    else return this.parseExpression();
  }

  //<function> ::= "fun" <identifier> "->" "{" <program> "}"
  private parseFunction(): exp {
    // Implementa la logica per <function>
    this.consume(Tokens.fun);
    const ide = this.parseIdentifier();
    this.consume(Tokens.arrow);
    this.consume(Tokens.lbra);
    const program = this.parseProgram();
    this.consume(Tokens.rbra);
    return { name: "Fun", value: { arg: ide, body: program } };
  }

  private parseExpression(): exp {
    return this.parseLogicOR();
  }

  private parseLogicOR(): exp {
    let left = this.parseLogicAND();
    while (this.peekToken().type == Tokens.logicOR) {
      this.consume(Tokens.logicOR);
      let right = this.parseLogicAND();
      left = { name: "Or", value: { v1: left, v2: right } };
    }
    return left;
  }

  private parseLogicAND(): exp {
    let left = this.parseEquality();
    while (this.peekToken().type == Tokens.logicAND) {
      this.consume(Tokens.logicAND);
      let right = this.parseEquality();
      left = { name: "And", value: { v1: left, v2: right } };
    }
    return left;
  }

  private parseEquality(): exp {
    let left = this.parseComparison();
    while (this.peekToken().type == Tokens.equalityOperator) {
      const op = this.consume(Tokens.equalityOperator);
      let right = this.parseComparison();
      if (!op) throw new Error("Expected operator");
      //TODO if else comentati sono l'implementazione del not equal che in minicaml manca
      if (op.word == "==")
        left = { name: "Eq", value: { v1: left, v2: right } };
      else left = { name: "Neq", value: { v1: left, v2: right } };
    }
    return left;
  }

  private parseComparison(): exp {
    let left = this.parseTerm();
    while (this.peekToken().type == Tokens.relationalOperator) {
      const op = this.consume(Tokens.relationalOperator);
      let right = this.parseTerm();
      if (!op) throw new Error("Expected operator");
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

  private parseTerm(): exp {
    let left = this.parseFactor();
    while (this.peekToken().type == Tokens.additiveOperator) {
      const op = this.consume(Tokens.additiveOperator);
      let right = this.parseFactor();
      if (!op) throw new Error("Expected operator");
      if (op.word == "+")
        left = { name: "Plus", value: { v1: left, v2: right } };
      else left = { name: "Sub", value: { v1: left, v2: right } };
    }
    return left;
  }

  private parseFactor(): exp {
    let left = this.parseUnary();
    while (this.peekToken().type == Tokens.multiplicativeOperator) {
      const op = this.consume(Tokens.multiplicativeOperator);
      let right = this.parseUnary();
      if (!op) throw new Error("Expected operator");
      if (op.word == "*")
        left = { name: "Mul", value: { v1: left, v2: right } };
      else left = { name: "Div", value: { v1: left, v2: right } };
    }
    return left;
  }

  private parseUnary(): exp {
    if (this.peekToken().type == Tokens.IsZero) {
      let op = this.consume(Tokens.IsZero);
      let right = this.parseUnary();
      if (!op) throw new Error("Expected operator");
      return { name: "IsZero", value: right };
    }
    if (this.peekToken().type == Tokens.logicalNOT) {
      let op = this.consume(Tokens.logicalNOT);
      let right = this.parseUnary();
      if (!op) throw new Error("Expected operator");
      return { name: "Not", value: right };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): exp {
    let token = this.peekToken();
    switch (token.type) {
      case Tokens.number:
        return this.parseNumber();
      case Tokens.true:
      case Tokens.false:
        return this.parseBoolean();
      case Tokens.string:
        return this.parseString();
      case Tokens.identifier:
        return { name: "Den", value: this.parseIdentifier() };
      case Tokens.lpar:
        this.consume(Tokens.lpar);
        let exp = this.parseExpression();
        this.consume(Tokens.rpar);
        return exp;
      //TODO check this case
      case Tokens.fun:
        return this.parseFunction();
      case Tokens.if:
        return this.parseFlowControl();
      case Tokens.apply:
        return this.parseFunctionCall();
      default:
        throw new Error("Expected primary expression");
    }
  }

  private parseNumber(): exp {
    const num = this.consume(Tokens.number);
    if (num == null) throw new Error("Expected number");
    return { name: "EInt", value: +num.word };
  }

  private parseString(): exp {
    const str = this.consume(Tokens.string);
    if (str == null) throw new Error("Expected string");
    return { name: "EString", value: str.word };
  }

  private parseBoolean(): exp {
    let bool;
    if (this.peekToken().type == Tokens.true) bool = this.consume(Tokens.true);
    else bool = this.consume(Tokens.false);
    if (bool == null) throw new Error("Expected boolean");
    return { name: "EBool", value: bool.word == "true" };
  }

  //<function-call> ::= "apply(" <identifier> "," <value> ")"
  private parseFunctionCall(): exp {
    // Implementa la logica per <function-call>
    this.consume(Tokens.apply);
    this.consume(Tokens.lpar);
    const func = this.parseValue();
    const value = this.parseValue();
    this.consume(Tokens.rpar);
    return { name: "Apply", value: { func: func, actArg: value } };
  }

  //<flow-control> ::= "if(" <bool-expr> "){" <program> "}else{" <program> "}"
  private parseFlowControl(): exp {
    // Implementa la logica per <flow-control>
    this.consume(Tokens.if);
    this.consume(Tokens.lpar);
    const boolExpr = this.parseExpression();
    if (!boolExpr) {
      throw new Error("Expected expression");
    }
    this.consume(Tokens.rpar);
    this.consume(Tokens.lbra);
    const thenProg = this.parseProgram();
    this.consume(Tokens.rbra);
    this.consume(Tokens.else);
    this.consume(Tokens.lbra);
    const elseProg = this.parseProgram();
    this.consume(Tokens.rbra);
    return {
      name: "IfThenElse",
      value: { condition: boolExpr, then: thenProg, else: elseProg },
    };
  }

  private nextToken(): Tok {
    if (this.debugPrints) console.log(this.tokens[this.currentTokenIndex]);
    this.currentTokenIndex++;
    return this.tokens[this.currentTokenIndex - 1];
  }

  private peekToken(): Tok {
    return this.tokens[this.currentTokenIndex];
  }

  private consume(type: Tokens): Tok | null {
    if (this.peekToken().type === type) {
      return this.nextToken();
    }
    throw new Error(
      "Expected token " +
        type +
        " but found " +
        this.peekToken().type +
        " at line " +
        this.peekToken().line +
        " and column " +
        this.peekToken().col
    );
  }

  private expectToken(type: Tokens): boolean {
    if (this.peekToken().type === type) {
      this.nextToken();
      return true;
    }
    return false;
  }
}
