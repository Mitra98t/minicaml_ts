# MiniCaml_TS

## Installation

`npm i minicaml_ts -g` to install minicaml_ts globally

`npx minicaml_ts` to run minicaml_ts

## Usage

- Basic usage
  - `minicaml_ts file.mcl [options]` : execute file
- Options
  - `-h --help` : Show this help message
  - `-v --version` : Show version
  - `--tokens` : Print tokens from lexer
  - `--ast` : \tPrint AST from parser

## Syntax

### Types

- Int
- String
- Boolean

### Operators

#### Arithmetical Operators

- `string + string` : concatenation

- `int + int` : addition
- `int - int` : subtraction
- `int * int` : multiplication
- `int / int` : division

#### Logical Operators

- `bool && bool` : and
- `bool || bool` : or
- `!bool` : not

#### Comparison Operators

- `int == int` : equal
- `int != int` : not equal
- `int < int` : less than
- `int <= int` : less than or equal
- `int > int` : greater than
- `int >= int` : greater than or equal

### Statements

#### Variable Declaration

- `let var_name = value in ...` : variable declaration

#### If Statements

- `if (bool) { ... } else { ... }` : if statement

#### Function Declarations

- `let fun_name = fun arg_name -> { ... } in ...` : function declaration
- `letrec fun_name = fun arg_name -> { ... } in ...` : recursive function declaration

#### Function Calls

- `apply(fun_name arg)` : function call

## Keywords

- `iszero value` : check if value is zero

## Utils

- `print expression` : print expression to console **Raccomanded not to use, minicaml is a functional language**

## Examples

### Adder

```minicaml
let a = 5 in
let b = 6 in
let f = fun x -> {
  fun y -> {
    x+y
  }
} in
apply(apply(f a)b)
```

### Factorial

```minicaml
letrec factorial = fun n -> {
  if (n == 0) {
    1
  } else {
    n * apply(factorial (n-1))
  }
} in
apply(factorial 5)
```

### Sommatory

```minicaml
let sommatory = fun x -> {
  letrec sommatory_aux = fun x -> {
    if (x == 0) { 0 }
    else { x + apply(sommatory_aux (x-1)) }
  }
  in apply(sommatoria_aux x)
} in apply(sommatoria 10)
```
