import * as Token from "#root/src/token/token.ts";
export type t = {
  tag: "nullLiteral";
  token: Token.t;
  value: string;
};

export const tokenLiteral = (s: t): string => s.token.literal;

export const string = (s: t): string => s.token.literal;
