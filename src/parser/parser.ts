import * as ChordLiteral from "#root/src/ast/chordLiteral.ts";
import * as EndoflineLiteral from "#root/src/ast/endoflineLiteral.ts";
import * as Expression from "#root/src/ast/expression.ts";
import * as ExpressionStatement from "#root/src/ast/expressionStatement.ts";
import * as Program from "#root/src/ast/program.ts";
import * as Statement from "#root/src/ast/statement.ts";
import * as StringLiteral from "#root/src/ast/stringLiteral.ts";
import * as Lexer from "#root/src/lexer/lexer.ts";
import * as Token from "#root/src/token/token.ts";

const LOWEST = 1,
  EQUALS = 2;

const precedences = new Map<Token.TokenType, number>([
  [Token.CHORD, EQUALS],
  [Token.STRING, EQUALS],
  [Token.ENDOFLINE, EQUALS],
]);

export type t = {
  l: Lexer.t;
  curToken: Token.t;
  peekToken: Token.t;
  errors: string[];
  prefixParseFns: Map<Token.TokenType, (p: t) => Expression.t | null>;
  infixParseFns: Map<
    Token.TokenType,
    (p: t, left: Expression.t) => Expression.t
  >;
};

// const peekError = (p: t, tokenType: Token.TokenType): void => {
//   const msg = `expected next token to be ${tokenType}, got ${p.peekToken.type} instead`;
//   p.errors.push(msg);
// };

// const expectPeek = (p: t, tokenType: Token.TokenType): boolean => {
//   if (peekTokenIs(p, tokenType)) {
//     nextToken(p);
//     return true;
//   } else {
//     peekError(p, tokenType);
//     return false;
//   }
// };

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
  } satisfies StringLiteral.t;
};

const parseChordLiteral = (p: t): Expression.t => {
  return {
    tag: "chordLiteral",
    token: p.curToken,
    value: p.curToken.literal,
  } satisfies ChordLiteral.t;
};

const parseEndOfLineLiteral = (p: t): Expression.t => {
  return {
    tag: "endoflineLiteral",
    token: p.curToken,
    value: p.curToken.literal,
  } satisfies EndoflineLiteral.t;
};

const parseInfixExpression = (
  p: t,
  left: Expression.t | null
): Expression.t => {
  const precedence = curPrecedence(p);
  nextToken(p);
  const right = parseExpression(p, precedence);
  return {
    tag: "infixExpression",
    token: p.curToken,
    left,
    right,
  } satisfies Expression.t;
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
    errors: [],
  };
  registerPrefix(p, Token.STRING, parseStringLiteral);
  registerPrefix(p, Token.CHORD, parseChordLiteral);
  registerPrefix(p, Token.ENDOFLINE, parseEndOfLineLiteral);
  registerInfix(p, Token.STRING, parseInfixExpression);
  registerInfix(p, Token.CHORD, parseInfixExpression);
  registerInfix(p, Token.ENDOFLINE, parseInfixExpression);
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
const noPrefixParseFnError = (p: t, tokenType: Token.TokenType): void => {
  const msg = `no prefix parse function for ${tokenType} found`;
  p.errors.push(msg);
};

const peekTokenIs = (p: t, tokenType: Token.TokenType): boolean => {
  return p.peekToken.type === tokenType;
};

const parseExpression = (p: t, precedence: number): Expression.t | null => {
  const prefix = p.prefixParseFns.get(p.curToken.type);
  if (!prefix) {
    noPrefixParseFnError(p, p.curToken.type);
    return null;
  }
  let leftExp = prefix(p);
  if (leftExp === null) return null;

  while (!peekTokenIs(p, Token.EOF) && precedence < peekPrecedence(p)) {
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
  return {
    tag: "expressionStatement",
    token: p.curToken,
    expression: parseExpression(p, LOWEST),
  } satisfies ExpressionStatement.t;
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
