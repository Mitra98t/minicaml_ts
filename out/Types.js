"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokens = void 0;
var Tokens;
(function (Tokens) {
    // Utils
    Tokens["newLine"] = "NEWLINE";
    Tokens["whiteSpace"] = "WHITESPACE";
    Tokens["endOfFile"] = "EOF";
    Tokens["lineDelimiter"] = "LINEDELIMITER";
    Tokens["comment"] = "COMMENT";
    Tokens["invalid"] = "INVALID";
    //symbols
    Tokens["lpar"] = "LPAR";
    Tokens["rpar"] = "RPAR";
    Tokens["lbra"] = "LBRACKET";
    Tokens["rbra"] = "RBRACKET";
    // Equality Operators
    Tokens["equalityOperator"] = "EQUALITYOPERATOR";
    // Arrow
    Tokens["arrow"] = "ARROW";
    // Assignments
    Tokens["assign"] = "ASSIGN";
    // Keywords
    Tokens["let"] = "LET";
    Tokens["letRec"] = "LETREC";
    Tokens["fun"] = "FUN";
    Tokens["if"] = "IF";
    Tokens["else"] = "ELSE";
    Tokens["true"] = "TRUE";
    Tokens["false"] = "FALSE";
    Tokens["apply"] = "APPLY";
    Tokens["in"] = "IN";
    Tokens["IsZero"] = "ISZERO";
    Tokens["print"] = "PRINT";
    // Identifier
    Tokens["identifier"] = "IDENTIFIER";
    // Operators
    // Matematical Operator
    Tokens["additiveOperator"] = "ADDITIVEOPERATOR";
    Tokens["multiplicativeOperator"] = "MULTIPLICATIVEOPERATOR";
    // Relational Operators
    Tokens["relationalOperator"] = "RELATIONALOPERATOR";
    // Logical Operators
    Tokens["logicOR"] = "LOGICOR";
    Tokens["logicAND"] = "LOGICAND";
    Tokens["logicalNOT"] = "LOGICALNOT";
    // Literals
    // String
    Tokens["string"] = "STRING";
    // Number
    Tokens["number"] = "NUMBER";
})(Tokens = exports.Tokens || (exports.Tokens = {}));
