import * as Ast from "#root/src/ast/ast.ts";
import * as ExpressionStatement from "#root/src/ast/expressionStatement.ts";
import * as Lyric from "#root/src/object/lyric.ts";
import * as Obj from "#root/src/object/obj.ts";
const evalStatements = (statements: ExpressionStatement.t[]): Obj.t | null => {
  let result: Obj.t | null = null;
  for (const statement of statements) {
    result = evalNode(statement);
  }
  return result;
};
export const evalNode = (node: Ast.t): Obj.t | null => {
  switch (node["tag"]) {
    case "program":
      return evalStatements(node["statements"]);
    case "expressionStatement":
      if (node["expression"] === null) {
        return null;
      }
      return evalNode(node["expression"]);
    case "stringLiteral":
      return {
        tag: "lyric",
        value: node["value"],
      } satisfies Lyric.t;
    // case "infixExpression":
    //     return evalInfixExpression(node);
    default:
      return null;
    //     const _exhaustiveCheck: never = node;
    //     throw new Error(_exhaustiveCheck);
  }
};
