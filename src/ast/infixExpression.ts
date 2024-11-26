import * as Expression from "#root/src/ast/expression.ts";
import * as Token from "#root/src/token/token.ts";
import { Readable } from "node:stream";
export type t = {
  tag: "infixExpression";
  token: Token.t;
  left: Expression.t | null;
  right: Expression.t | null;
};

export const tokenLiteral = (i: t): string => i.token.literal;

export const string = async (i: t): Promise<string> => {
  const readableStream = Readable.from([""]);
  readableStream.push("(");
  if (i.left) {
    readableStream.push(Expression.string(i.left));
  }
  if (i.right) {
    readableStream.push(Expression.string(i.right));
  }
  readableStream.push(")");
  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
