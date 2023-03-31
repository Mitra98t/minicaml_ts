import { evT, TNames, typeCheck } from "./interpreter";

export const is_zero = (n: evT): evT => {
  if (!typeCheck(TNames.TInt, n)) throw new Error("Type error in is_zero");
  return { name: "Bool", value: n.value === 0 };
};

export const int_eq = (n1: evT, n2: evT): evT => {
  if (!typeCheck(TNames.TInt, n1) || !typeCheck(TNames.TInt, n2))
    throw new Error("Type error in int_eq");
  return { name: "Bool", value: n1.value === n2.value };
};

export const int_neq = (n1: evT, n2: evT): evT => {
  if (!typeCheck(TNames.TInt, n1) || !typeCheck(TNames.TInt, n2))
    throw new Error("Type error in int_neq");
  return { name: "Bool", value: n1.value !== n2.value };
};

export const int_plus = (n1: evT, n2: evT): evT => {
  if (!typeCheck(TNames.TInt, n1) || !typeCheck(TNames.TInt, n2))
    throw new Error("Type error in int_plus");
  return { name: "Int", value: Number(n1.value) + Number(n2.value) };
};

export const int_minus = (n1: evT, n2: evT): evT => {
  if (!typeCheck(TNames.TInt, n1) || !typeCheck(TNames.TInt, n2))
    throw new Error("Type error in int_minus");
  return { name: "Int", value: Number(n1.value) - Number(n2.value) };
};

export const int_times = (n1: evT, n2: evT): evT => {
  if (!typeCheck(TNames.TInt, n1) || !typeCheck(TNames.TInt, n2))
    throw new Error("Type error in int_times");
  return { name: "Int", value: Number(n1.value) * Number(n2.value) };
};

export const int_div = (n1: evT, n2: evT): evT => {
  if (!typeCheck(TNames.TInt, n1) || !typeCheck(TNames.TInt, n2))
    throw new Error("Type error");
  return { name: "Int", value: Number(n1.value) / Number(n2.value) };
};

export const less_than = (n1: evT, n2: evT): evT => {
  if (!typeCheck(TNames.TInt, n1) || !typeCheck(TNames.TInt, n2))
    throw new Error("Type error in less_than");
  return { name: "Bool", value: Number(n1.value) < Number(n2.value) };
};

export const less_or_eq = (n1: evT, n2: evT): evT => {
  if (!typeCheck(TNames.TInt, n1) || !typeCheck(TNames.TInt, n2))
    throw new Error("Type error in less_or_eq");
  return { name: "Bool", value: Number(n1.value) <= Number(n2.value) };
};

export const greater_or_eq = (n1: evT, n2: evT): evT => {
  if (!typeCheck(TNames.TInt, n1) || !typeCheck(TNames.TInt, n2))
    throw new Error("Type error in greater_or_eq");
  return { name: "Bool", value: Number(n1.value) >= Number(n2.value) };
};

export const greater_than = (n1: evT, n2: evT): evT => {
  if (!typeCheck(TNames.TInt, n1) || !typeCheck(TNames.TInt, n2))
    throw new Error("Type error in greater_than");
  return { name: "Bool", value: Number(n1.value) > Number(n2.value) };
};

export const bool_and = (b1: evT, b2: evT): evT => {
  if (!typeCheck(TNames.TBool, b1) || !typeCheck(TNames.TBool, b2))
    throw new Error("Type error in bool_and");
  return { name: "Bool", value: Boolean(b1.value) && Boolean(b2.value) };
};

export const bool_or = (b1: evT, b2: evT): evT => {
  if (!typeCheck(TNames.TBool, b1) || !typeCheck(TNames.TBool, b2))
    throw new Error("Type error in bool_or");
  return { name: "Bool", value: Boolean(b1.value) || Boolean(b2.value) };
};

export const bool_not = (b: evT): evT => {
  if (!typeCheck(TNames.TBool, b)) throw new Error("Type error in bool_not");
  return { name: "Bool", value: !Boolean(b.value) };
};

export const string_plus = (s1: evT, s2: evT): evT => {
  if (!typeCheck(TNames.TString, s1) || !typeCheck(TNames.TString, s2))
    throw new Error("Type error in string concatenation");
  return { name: "String", value: String(s1.value) + String(s2.value) };
};
