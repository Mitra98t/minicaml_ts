export enum Tokens {
  // Utils
  newLine = "NEWLINE",
  whiteSpace = "WHITESPACE",
  endOfFile = "EOF",
  lineDelimiter = "LINEDELIMITER",
  comment = "COMMENT",
  invalid = "INVALID",
  //symbols
  lpar = "LPAR",
  rpar = "RPAR",
  lbra = "LBRACKET",
  rbra = "RBRACKET",

  // Equality Operators
  equalityOperator = "EQUALITYOPERATOR",

  // Arrow
  arrow = "ARROW",

  // Assignments
  assign = "ASSIGN",

  // Keywords
  let = "LET",
  letRec = "LETREC",
  fun = "FUN",
  if = "IF",
  else = "ELSE",
  true = "TRUE",
  false = "FALSE",
  apply = "APPLY",
  in = "IN",
  IsZero = "ISZERO",
  print = "PRINT",

  // Identifier
  identifier = "IDENTIFIER",

  // Operators
  // Matematical Operator
  additiveOperator = "ADDITIVEOPERATOR",
  multiplicativeOperator = "MULTIPLICATIVEOPERATOR",
  // Relational Operators
  relationalOperator = "RELATIONALOPERATOR",
  // Logical Operators
  logicOR = "LOGICOR",
  logicAND = "LOGICAND",
  logicalNOT = "LOGICALNOT",

  // Literals
  // String
  string = "STRING",
  // Number
  number = "NUMBER",
}

export type TokRecognition = {
  id: Tokens;
  match: RegExp;
};
export type Tok = {
  word: string;
  type: Tokens;
  line: number;
  col: number;
};
