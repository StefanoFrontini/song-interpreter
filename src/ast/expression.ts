import * as ChordLiteral from "#root/src/ast/chordLiteral.ts";
import * as InfixExpression from "#root/src/ast/infixExpression.ts";
import * as StringLiteral from "#root/src/ast/stringLiteral.ts";
import { Readable } from "stream";

export type t = ChordLiteral.t | InfixExpression.t | StringLiteral.t;

export const string = async (e: t): Promise<string> => {
  let stringExpr = "";
  switch (e["tag"]) {
    case "infixExpression":
      stringExpr = await InfixExpression.string(e);
      break;
    case "stringLiteral":
      stringExpr = StringLiteral.string(e);
      break;
    case "chordLiteral":
      stringExpr = ChordLiteral.string(e);
      break;
    default:
      const _exhaustiveCheck: never = e;
      throw new Error(_exhaustiveCheck);
  }
  const readableStream = Readable.from([""]);
  readableStream.push(stringExpr);
  let result = "";
  for await (const chunk of readableStream) {
    result += chunk;
  }
  return result;
};
