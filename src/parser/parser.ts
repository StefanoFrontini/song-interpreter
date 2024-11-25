import * as ChordLiteral from "#root/src/ast/chordLiteral.ts";
import * as Expression from "#root/src/ast/expression.ts";
import * as ExpressionStatement from "#root/src/ast/expressionStatement.ts";
import * as NullLiteral from "#root/src/ast/nullLiteral.ts";
import * as Program from "#root/src/ast/program.ts";
import * as Statement from "#root/src/ast/statement.ts";
import * as StringLiteral from "#root/src/ast/stringLiteral.ts";
import * as Lexer from "#root/src/lexer/lexer.ts";
import * as Token from "#root/src/token/token.ts";

const LOWEST = 1;

const precedences = new Map<Token.TokenType, number>([
  [Token.CHORD, LOWEST],
  [Token.STRING, LOWEST],
]);

export type t = {
  l: Lexer.t;
  curToken: Token.t;
  peekToken: Token.t;
  //   errors: string[];
  prefixParseFns: Map<Token.TokenType, (p: t) => Expression.t | null>;
  infixParseFns: Map<
    Token.TokenType,
    (p: t, left: Expression.t) => Expression.t
  >;

  // infixParseFns: Map<
  //   Token.TokenType,
  //   (p: t, left: Expression.t | null) => Expression.t
  // >;
};

const peekPrecedence = (p: t): number => {
  if (!p.peekToken) return LOWEST;
  return precedences.get(p.peekToken.type) ?? LOWEST;
};

const curPrecedence = (p: t): number => {
  if (!p.curToken) return LOWEST;
  return precedences.get(p.curToken.type) ?? LOWEST;
};

const registerInfix = (
  p: t,
  tokenType: Token.TokenType,
  fn: (p: t, left: Expression.t) => Expression.t
): void => {
  p.infixParseFns.set(tokenType, fn);
};
const registerPrefix = (
  p: t,
  tokenType: Token.TokenType,
  fn: (p: t) => Expression.t
): void => {
  p.prefixParseFns.set(tokenType, fn);
};

const parseStringLiteral = (p: t): Expression.t => {
  return {
    tag: "stringLiteral",
    token: p.curToken,
    value: p.curToken.literal,
  } as StringLiteral.t;
};

const parseChordLiteral = (p: t): Expression.t => {
  return {
    tag: "chordLiteral",
    token: p.curToken,
    value: p.curToken.literal,
  } as ChordLiteral.t;
};

const parseInfixExpression = (
  p: t,
  left: Expression.t | null
): Expression.t => {
  const expression = {
    tag: "infixExpression",
    token: p.curToken,
    left: left,
  };
  const precedence = curPrecedence(p);
  nextToken(p);
  expression["right"] =
    parseExpression(p, precedence) ??
    ({
      tag: "nullLiteral",
      token: p.curToken,
      value: "",
    } as NullLiteral.t);
  return expression as Expression.t;
};

export const init = (l: Lexer.t): t => {
  const p: t = {
    l: l,
    curToken: Lexer.nextToken(l),
    peekToken: Lexer.nextToken(l),
    prefixParseFns: new Map<Token.TokenType, (p: t) => Expression.t>(),
    infixParseFns: new Map<
      Token.TokenType,
      (p: t, left: Expression.t) => Expression.t
    >(),
    //   errors: [],
    // infixParseFns: new Map<
    //   Token.TokenType,
    //   (p: t, left: Expression.t | null) => Expression.t
    // >(),
  };
  registerPrefix(p, Token.STRING, parseStringLiteral);
  registerPrefix(p, Token.CHORD, parseChordLiteral);
  registerInfix(p, Token.STRING, parseInfixExpression);
  registerInfix(p, Token.CHORD, parseInfixExpression);
  return p;
};

export const nextToken = (p: t): void => {
  p.curToken = p.peekToken;
  p.peekToken = Lexer.nextToken(p.l);
};
// const parsePrefixExpression = (p: t): Expression.t => {
//   const expression = {
//     tag: "prefixExpression",
//     token: p.curToken,
//     operator: p.curToken.literal,
//   };

//   nextToken(p);
//   expression["right"] = parseExpression(p, PREFIX);
//   return expression as PrefixExpression.t;
// };

const peekTokenIs = (p: t, tokenType: Token.TokenType): boolean => {
  return p.peekToken.type === tokenType;
};

const parseExpression = (p: t, precedence: number): Expression.t | null => {
  const prefix = p.prefixParseFns.get(p.curToken.type);
  if (!prefix) {
    // noPrefixParseFnError(p, p.curToken.type);
    return null;
  }
  let leftExp = prefix(p);
  if (leftExp === null) return null;
  console.log("leftExp", leftExp);

  while (!peekTokenIs(p, Token.EOF)) {
    const infix = p.infixParseFns.get(p.peekToken.type);
    if (!infix) {
      return leftExp;
    }
    // nextToken(p);
    leftExp = infix(p, leftExp);
  }
  return leftExp;
};

const parseExpressionStatement = (p: t): ExpressionStatement.t => {
  let stmt = {
    tag: "expressionStatement",
    token: p.curToken,
    expression: parseExpression(p, LOWEST),
  };
  return stmt as ExpressionStatement.t;
};

const parseStatement = (p: t): Statement.t | null => {
  return parseExpressionStatement(p);
};

export const parseProgram = (p: t): Program.t => {
  const program: Program.t = {
    tag: "program",
    statements: [],
  };
  while (p.curToken.type !== Token.EOF) {
    const stmt = parseStatement(p);
    if (stmt) {
      program.statements.push(stmt);
    }
    nextToken(p);
  }
  return program;
};
