"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string_plus = exports.bool_not = exports.bool_or = exports.bool_and = exports.greater_than = exports.greater_or_eq = exports.less_or_eq = exports.less_than = exports.int_div = exports.int_times = exports.int_minus = exports.int_plus = exports.int_neq = exports.int_eq = exports.is_zero = void 0;
const interpreter_1 = require("./interpreter");
const is_zero = (n) => {
    if (!(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n))
        throw new Error("Type error in is_zero");
    return { name: "Bool", value: n.value === 0 };
};
exports.is_zero = is_zero;
const int_eq = (n1, n2) => {
    if (!(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n1) || !(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n2))
        throw new Error("Type error in int_eq");
    return { name: "Bool", value: n1.value === n2.value };
};
exports.int_eq = int_eq;
const int_neq = (n1, n2) => {
    if (!(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n1) || !(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n2))
        throw new Error("Type error in int_neq");
    return { name: "Bool", value: n1.value !== n2.value };
};
exports.int_neq = int_neq;
const int_plus = (n1, n2) => {
    if (!(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n1) || !(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n2))
        throw new Error("Type error in int_plus");
    return { name: "Int", value: Number(n1.value) + Number(n2.value) };
};
exports.int_plus = int_plus;
const int_minus = (n1, n2) => {
    if (!(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n1) || !(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n2))
        throw new Error("Type error in int_minus");
    return { name: "Int", value: Number(n1.value) - Number(n2.value) };
};
exports.int_minus = int_minus;
const int_times = (n1, n2) => {
    if (!(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n1) || !(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n2))
        throw new Error("Type error in int_times");
    return { name: "Int", value: Number(n1.value) * Number(n2.value) };
};
exports.int_times = int_times;
const int_div = (n1, n2) => {
    if (!(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n1) || !(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n2))
        throw new Error("Type error");
    return { name: "Int", value: Number(n1.value) / Number(n2.value) };
};
exports.int_div = int_div;
const less_than = (n1, n2) => {
    if (!(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n1) || !(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n2))
        throw new Error("Type error in less_than");
    return { name: "Bool", value: Number(n1.value) < Number(n2.value) };
};
exports.less_than = less_than;
const less_or_eq = (n1, n2) => {
    if (!(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n1) || !(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n2))
        throw new Error("Type error in less_or_eq");
    return { name: "Bool", value: Number(n1.value) <= Number(n2.value) };
};
exports.less_or_eq = less_or_eq;
const greater_or_eq = (n1, n2) => {
    if (!(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n1) || !(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n2))
        throw new Error("Type error in greater_or_eq");
    return { name: "Bool", value: Number(n1.value) >= Number(n2.value) };
};
exports.greater_or_eq = greater_or_eq;
const greater_than = (n1, n2) => {
    if (!(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n1) || !(0, interpreter_1.typeCheck)(interpreter_1.TNames.TInt, n2))
        throw new Error("Type error in greater_than");
    return { name: "Bool", value: Number(n1.value) > Number(n2.value) };
};
exports.greater_than = greater_than;
const bool_and = (b1, b2) => {
    if (!(0, interpreter_1.typeCheck)(interpreter_1.TNames.TBool, b1) || !(0, interpreter_1.typeCheck)(interpreter_1.TNames.TBool, b2))
        throw new Error("Type error in bool_and");
    return { name: "Bool", value: Boolean(b1.value) && Boolean(b2.value) };
};
exports.bool_and = bool_and;
const bool_or = (b1, b2) => {
    if (!(0, interpreter_1.typeCheck)(interpreter_1.TNames.TBool, b1) || !(0, interpreter_1.typeCheck)(interpreter_1.TNames.TBool, b2))
        throw new Error("Type error in bool_or");
    return { name: "Bool", value: Boolean(b1.value) || Boolean(b2.value) };
};
exports.bool_or = bool_or;
const bool_not = (b) => {
    if (!(0, interpreter_1.typeCheck)(interpreter_1.TNames.TBool, b))
        throw new Error("Type error in bool_not");
    return { name: "Bool", value: !Boolean(b.value) };
};
exports.bool_not = bool_not;
const string_plus = (s1, s2) => {
    if (!(0, interpreter_1.typeCheck)(interpreter_1.TNames.TString, s1) || !(0, interpreter_1.typeCheck)(interpreter_1.TNames.TString, s2))
        throw new Error("Type error in string concatenation");
    return { name: "String", value: String(s1.value) + String(s2.value) };
};
exports.string_plus = string_plus;
