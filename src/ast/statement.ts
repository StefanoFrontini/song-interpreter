import * as ExpressionStatement from "#root/src/ast/expressionStatement.ts";

export type t = ExpressionStatement.t;

export const tokenLiteral = (s: t): string => s.token.literal;

export const string = async (s: t): Promise<string> => {
  switch (s["tag"]) {
    case "expressionStatement":
      return await ExpressionStatement.string(s);
    default:
      throw new Error("unknown statement");
    //   const _exhaustiveCheck: never = s;
    //   return _exhaustiveCheck;
  }
};
