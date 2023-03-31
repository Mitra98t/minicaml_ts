import {
  int_minus,
  int_plus,
  int_times,
  int_div,
  int_eq,
  bool_and,
  bool_not,
  bool_or,
  is_zero,
  greater_than,
  less_than,
  string_plus,
  int_neq,
  less_or_eq,
  greater_or_eq,
} from "./auxiliary";

export enum TNames {
  "TInt",
  "TBool",
  "TString",
  "TClosure",
  "TRecClosure",
  "TUnbound",
}

export type ide = string;

export type evTEnv = Map<ide, evT>;
export let env: evTEnv = new Map<ide, evT>();

export const bind = (s: evTEnv, name: ide, value: evT): evTEnv => {
  s.set(name, value);
  return s;
};
const lookup = (name: ide, s: evTEnv): evT => {
  const value = s.get(name);
  if (!value) return { name: "UnBound", value: null };
  return value;
};

export const emptyEnv = (): evTEnv => new Map<ide, evT>();

export const printEnv = (s: evTEnv): void => {
  s.forEach((value, key) => {
    console.log(`${key}: `);
    console.log(value);
  });
};

export type exp =
  | { name: "EInt"; value: number }
  | { name: "EBool"; value: boolean }
  | { name: "EString"; value: string }
  | { name: "Den"; value: ide }
  | { name: "Plus"; value: { v1: exp; v2: exp } }
  | { name: "Sub"; value: { v1: exp; v2: exp } }
  | { name: "Mul"; value: { v1: exp; v2: exp } }
  | { name: "Div"; value: { v1: exp; v2: exp } }
  | { name: "Print"; value: { toPrint: exp; program: exp } }
  | { name: "IsZero"; value: exp }
  | { name: "Eq"; value: { v1: exp; v2: exp } }
  | { name: "Neq"; value: { v1: exp; v2: exp } }
  | { name: "LessThan"; value: { v1: exp; v2: exp } }
  | { name: "LessOrEq"; value: { v1: exp; v2: exp } }
  | { name: "GreaterThan"; value: { v1: exp; v2: exp } }
  | { name: "GreaterOrEq"; value: { v1: exp; v2: exp } }
  | { name: "And"; value: { v1: exp; v2: exp } }
  | { name: "Or"; value: { v1: exp; v2: exp } }
  | { name: "Not"; value: exp }
  | { name: "IfThenElse"; value: { condition: exp; then: exp; else: exp } }
  | { name: "Let"; value: { ide: ide; v1: exp; program: exp } }
  | { name: "Fun"; value: { arg: ide; body: exp } }
  | {
      name: "LetRec";
      value: { funcName: ide; arg: ide; body: exp; program: exp };
    }
  | { name: "Apply"; value: { func: exp; actArg: exp } };

export type evT =
  | { name: "Int"; value: number }
  | { name: "Bool"; value: boolean }
  | { name: "String"; value: string }
  | { name: "Closure"; value: { arg: ide; body: exp; env: evTEnv } }
  | {
      name: "RecClosure";
      value: { funcName: ide; arg: ide; body: exp; env: evTEnv };
    }
  | { name: "UnBound"; value: null };

export const typeCheck = (x: TNames, y: evT): boolean => {
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

export const GetType = (x: evT): TNames => {
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

export const Eval = (e: exp | null, s: evTEnv): evT => {
  if (e == null) return { name: "UnBound", value: null };
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
      let [ev1, ev2] = [Eval(e.value.v1, s), Eval(e.value.v2, s)];
      if (typeCheck(TNames.TString, ev1) && typeCheck(TNames.TString, ev2))
        return string_plus(ev1, ev2);
      return int_plus(ev1, ev2);
    case "Sub":
      return int_minus(Eval(e.value.v1, s), Eval(e.value.v2, s));
    case "Mul":
      return int_times(Eval(e.value.v1, s), Eval(e.value.v2, s));
    case "Div":
      return int_div(Eval(e.value.v1, s), Eval(e.value.v2, s));

    case "Print":
      console.log(Eval(e.value.toPrint, s).value);
      return Eval(e.value.program, s);
    // Int to Boolean
    case "IsZero":
      return is_zero(Eval(e.value, s));
    case "Eq":
      return int_eq(Eval(e.value.v1, s), Eval(e.value.v2, s));
    case "Neq":
      return int_neq(Eval(e.value.v1, s), Eval(e.value.v2, s));
    case "LessThan":
      return less_than(Eval(e.value.v1, s), Eval(e.value.v2, s));
    case "LessOrEq":
      return less_or_eq(Eval(e.value.v1, s), Eval(e.value.v2, s));
    case "GreaterThan":
      return greater_than(Eval(e.value.v1, s), Eval(e.value.v2, s));
    case "GreaterOrEq":
      return greater_or_eq(Eval(e.value.v1, s), Eval(e.value.v2, s));

    // Boolean
    case "And":
      return bool_and(Eval(e.value.v1, s), Eval(e.value.v2, s));
    case "Or":
      return bool_or(Eval(e.value.v1, s), Eval(e.value.v2, s));
    case "Not":
      return bool_not(Eval(e.value, s));

    // FlowControl
    case "IfThenElse":
      let evalCond = Eval(e.value.condition, s);
      if (!typeCheck(TNames.TBool, evalCond)) throw new Error("Not a boolean");
      return evalCond.value ? Eval(e.value.then, s) : Eval(e.value.else, s);
    case "Let":
      let evalVal = Eval(e.value.v1, s);
      let newEnv = bind(s, e.value.ide, evalVal);
      return Eval(e.value.program, newEnv);

    case "Fun":
      return {
        name: "Closure",
        value: { arg: e.value.arg, body: e.value.body, env: s },
      };

    case "LetRec":
      let newEnv1 = bind(s, e.value.funcName, {
        name: "RecClosure",
        value: {
          funcName: e.value.funcName,
          arg: e.value.arg,
          body: e.value.body,
          env: s,
        },
      });
      return Eval(e.value.program, newEnv1);

    case "Apply":
      let fclosure = Eval(e.value.func, s);
      switch (fclosure.name) {
        case "Closure":
          let actualParamValue = Eval(e.value.actArg, s);
          let newEnv2 = bind(
            fclosure.value.env,
            fclosure.value.arg,
            actualParamValue
          );

          return Eval(fclosure.value.body, newEnv2);
        case "RecClosure":
          let actualParamValue1 = Eval(e.value.actArg, s);
          let recEnv = bind(
            fclosure.value.env,
            fclosure.value.funcName,
            fclosure
          );
          let newEnv3 = bind(recEnv, fclosure.value.arg, actualParamValue1);
          return Eval(fclosure.value.body, newEnv3);
        default:
          throw new Error("Not a closure");
      }

    default:
      throw new Error("Not a valid expression");
  }
};
