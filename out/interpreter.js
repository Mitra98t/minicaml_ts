"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eval = exports.GetType = exports.typeCheck = exports.printEnv = exports.emptyEnv = exports.bind = exports.env = exports.TNames = void 0;
const auxiliary_1 = require("./auxiliary");
var TNames;
(function (TNames) {
    TNames[TNames["TInt"] = 0] = "TInt";
    TNames[TNames["TBool"] = 1] = "TBool";
    TNames[TNames["TString"] = 2] = "TString";
    TNames[TNames["TClosure"] = 3] = "TClosure";
    TNames[TNames["TRecClosure"] = 4] = "TRecClosure";
    TNames[TNames["TUnbound"] = 5] = "TUnbound";
})(TNames = exports.TNames || (exports.TNames = {}));
exports.env = new Map();
const bind = (s, name, value) => {
    s.set(name, value);
    return s;
};
exports.bind = bind;
const lookup = (name, s) => {
    const value = s.get(name);
    if (!value)
        return { name: "UnBound", value: null };
    return value;
};
const emptyEnv = () => new Map();
exports.emptyEnv = emptyEnv;
const printEnv = (s) => {
    s.forEach((value, key) => {
        console.log(`${key}: `);
        console.log(value);
    });
};
exports.printEnv = printEnv;
const typeCheck = (x, y) => {
    switch (x) {
        case TNames.TInt:
            return y.name == "Int";
        case TNames.TBool:
            return y.name == "Bool";
        case TNames.TString:
            return y.name == "String";
        case TNames.TClosure:
            return y.name == "Closure";
        case TNames.TRecClosure:
            return y.name == "RecClosure";
        case TNames.TUnbound:
            return y.name == "UnBound";
    }
};
exports.typeCheck = typeCheck;
const GetType = (x) => {
    switch (x.name) {
        case "Int":
            return TNames.TInt;
        case "Bool":
            return TNames.TBool;
        case "String":
            return TNames.TString;
        case "Closure":
            return TNames.TClosure;
        case "RecClosure":
            return TNames.TRecClosure;
        default:
            return TNames.TUnbound;
    }
};
exports.GetType = GetType;
const Eval = (e, s) => {
    if (e == null)
        return { name: "UnBound", value: null };
    switch (e.name) {
        // Basic
        case "EInt":
            return { name: "Int", value: e.value };
        case "EBool":
            return { name: "Bool", value: e.value };
        case "EString":
            return { name: "String", value: e.value };
        case "Den":
            return lookup(e.value, s);
        // Arithmetic
        case "Plus":
            let [ev1, ev2] = [(0, exports.Eval)(e.value.v1, s), (0, exports.Eval)(e.value.v2, s)];
            if ((0, exports.typeCheck)(TNames.TString, ev1) && (0, exports.typeCheck)(TNames.TString, ev2))
                return (0, auxiliary_1.string_plus)(ev1, ev2);
            return (0, auxiliary_1.int_plus)(ev1, ev2);
        case "Sub":
            return (0, auxiliary_1.int_minus)((0, exports.Eval)(e.value.v1, s), (0, exports.Eval)(e.value.v2, s));
        case "Mul":
            return (0, auxiliary_1.int_times)((0, exports.Eval)(e.value.v1, s), (0, exports.Eval)(e.value.v2, s));
        case "Div":
            return (0, auxiliary_1.int_div)((0, exports.Eval)(e.value.v1, s), (0, exports.Eval)(e.value.v2, s));
        case "Print":
            console.log((0, exports.Eval)(e.value.toPrint, s).value);
            return (0, exports.Eval)(e.value.program, s);
        // Int to Boolean
        case "IsZero":
            return (0, auxiliary_1.is_zero)((0, exports.Eval)(e.value, s));
        case "Eq":
            return (0, auxiliary_1.int_eq)((0, exports.Eval)(e.value.v1, s), (0, exports.Eval)(e.value.v2, s));
        case "Neq":
            return (0, auxiliary_1.int_neq)((0, exports.Eval)(e.value.v1, s), (0, exports.Eval)(e.value.v2, s));
        case "LessThan":
            return (0, auxiliary_1.less_than)((0, exports.Eval)(e.value.v1, s), (0, exports.Eval)(e.value.v2, s));
        case "LessOrEq":
            return (0, auxiliary_1.less_or_eq)((0, exports.Eval)(e.value.v1, s), (0, exports.Eval)(e.value.v2, s));
        case "GreaterThan":
            return (0, auxiliary_1.greater_than)((0, exports.Eval)(e.value.v1, s), (0, exports.Eval)(e.value.v2, s));
        case "GreaterOrEq":
            return (0, auxiliary_1.greater_or_eq)((0, exports.Eval)(e.value.v1, s), (0, exports.Eval)(e.value.v2, s));
        // Boolean
        case "And":
            return (0, auxiliary_1.bool_and)((0, exports.Eval)(e.value.v1, s), (0, exports.Eval)(e.value.v2, s));
        case "Or":
            return (0, auxiliary_1.bool_or)((0, exports.Eval)(e.value.v1, s), (0, exports.Eval)(e.value.v2, s));
        case "Not":
            return (0, auxiliary_1.bool_not)((0, exports.Eval)(e.value, s));
        // FlowControl
        case "IfThenElse":
            let evalCond = (0, exports.Eval)(e.value.condition, s);
            if (!(0, exports.typeCheck)(TNames.TBool, evalCond))
                throw new Error("Not a boolean");
            return evalCond.value ? (0, exports.Eval)(e.value.then, s) : (0, exports.Eval)(e.value.else, s);
        case "Let":
            let evalVal = (0, exports.Eval)(e.value.v1, s);
            let newEnv = (0, exports.bind)(s, e.value.ide, evalVal);
            return (0, exports.Eval)(e.value.program, newEnv);
        case "Fun":
            return {
                name: "Closure",
                value: { arg: e.value.arg, body: e.value.body, env: s },
            };
        case "LetRec":
            let newEnv1 = (0, exports.bind)(s, e.value.funcName, {
                name: "RecClosure",
                value: {
                    funcName: e.value.funcName,
                    arg: e.value.arg,
                    body: e.value.body,
                    env: s,
                },
            });
            return (0, exports.Eval)(e.value.program, newEnv1);
        case "Apply":
            let fclosure = (0, exports.Eval)(e.value.func, s);
            switch (fclosure.name) {
                case "Closure":
                    let actualParamValue = (0, exports.Eval)(e.value.actArg, s);
                    let newEnv2 = (0, exports.bind)(fclosure.value.env, fclosure.value.arg, actualParamValue);
                    return (0, exports.Eval)(fclosure.value.body, newEnv2);
                case "RecClosure":
                    let actualParamValue1 = (0, exports.Eval)(e.value.actArg, s);
                    let recEnv = (0, exports.bind)(fclosure.value.env, fclosure.value.funcName, fclosure);
                    let newEnv3 = (0, exports.bind)(recEnv, fclosure.value.arg, actualParamValue1);
                    return (0, exports.Eval)(fclosure.value.body, newEnv3);
                default:
                    throw new Error("Not a closure");
            }
        default:
            throw new Error("Not a valid expression");
    }
};
exports.Eval = Eval;
