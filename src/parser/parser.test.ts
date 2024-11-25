import * as ChordLiteral from "#root/src/ast/chordLiteral.ts";
import * as Expression from "#root/src/ast/expression.ts";
import * as ExpressionStatement from "#root/src/ast/expressionStatement.ts";
import * as InfixExpression from "#root/src/ast/infixExpression.ts";
import * as StringLiteral from "#root/src/ast/stringLiteral.ts";
import * as Lexer from "#root/src/lexer/lexer.ts";
import * as Parser from "#root/src/parser/parser.ts";
import assert from "node:assert";
import { describe, it } from "node:test";
const testStringLiteral = (exp: Expression.t, value: string) => {
  assert.strictEqual(
    exp["tag"],
    "stringLiteral",
    `exp is not an stringLiteral. got=${exp["tag"]}`
  );
  const sl = exp as StringLiteral.t;
  assert.strictEqual(
    sl.value,
    value,
    `sl.value is not '${value}'. got=${sl.value}`
  );
  assert.strictEqual(
    StringLiteral.tokenLiteral(sl),
    value,
    `sl.tokenLiteral() is not '${value}'. got=${StringLiteral.tokenLiteral(sl)}`
  );
};

const testChordLiteral = (exp: Expression.t, value: string) => {
  assert.strictEqual(
    exp["tag"],
    "chordLiteral",
    `exp is not an chordLiteral. got=${exp["tag"]}`
  );
  const cl = exp as ChordLiteral.t;
  assert.strictEqual(
    cl.value,
    value,
    `cl.value is not '${value}'. got=${cl.value}`
  );
  assert.strictEqual(
    ChordLiteral.tokenLiteral(cl),
    value,
    `cl.tokenLiteral() is not '${value}'. got=${ChordLiteral.tokenLiteral(cl)}`
  );
};

describe("Parser", () => {
  it("TestStringLiteral", () => {
    const input = "foobar";
    const l = Lexer.init(input);
    const p = Parser.init(l);
    const program = Parser.parseProgram(p);
    // assert.strictEqual(
    //   p.errors.length,
    //   0,
    //   `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
    //     "\n"
    //   )}`
    // );
    assert.notStrictEqual(program, null, "Parser.parseProgram() returned null");
    assert.strictEqual(
      program.statements.length,
      1,
      `
          program.statements has not enough statements. got=${program.statements.length}`
    );
    assert.strictEqual(
      program.statements[0]["tag"],
      "expressionStatement",
      `program.statements[0] is not an ExpressionStatement. got=${program.statements[0]["tag"]}`
    );

    const exprStmt = program.statements[0] as ExpressionStatement.t;
    testStringLiteral(exprStmt.expression, "foobar");
  });
  it("TestChordLiteral", () => {
    const input = "[C]";
    const l = Lexer.init(input);
    const p = Parser.init(l);
    const program = Parser.parseProgram(p);
    // assert.strictEqual(
    //   p.errors.length,
    //   0,
    //   `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
    //     "\n"
    //   )}`
    // );
    assert.notStrictEqual(program, null, "Parser.parseProgram() returned null");
    assert.strictEqual(
      program.statements.length,
      1,
      `
          program.statements has not enough statements. got=${program.statements.length}`
    );
    assert.strictEqual(
      program.statements[0]["tag"],
      "expressionStatement",
      `program.statements[0] is not an ExpressionStatement. got=${program.statements[0]["tag"]}`
    );

    const exprStmt = program.statements[0] as ExpressionStatement.t;
    testChordLiteral(exprStmt.expression, "C");
  });
  it("TestParsingInfixExpressions", () => {
    const tests = [
      {
        input: "abc[C]",
        leftValue: "abc",
        rightValue: "C",
      },
    ];
    for (const tt of tests) {
      const l = Lexer.init(tt.input);
      const p = Parser.init(l);
      const program = Parser.parseProgram(p);
      // assert.strictEqual(
      //   p.errors.length,
      //   0,
      //   `Parser.errors() returned ${p.errors.length} errors:\n${p.errors.join(
      //     "\n"
      //   )}`
      // );
      assert.notStrictEqual(
        program,
        null,
        "Parser.parseProgram() returned null"
      );
      console.dir(program.statements, { depth: null });
      assert.strictEqual(
        program.statements.length,
        1,
        `
          program.statements has not enough statements. got=${program.statements.length}`
      );
      assert.strictEqual(
        program.statements[0]["tag"],
        "expressionStatement",
        `program.statements[0] is not an ExpressionStatement. got=${program.statements[0]["tag"]}`
      );

      const exprStmt = program.statements[0] as ExpressionStatement.t;
      assert.strictEqual(
        exprStmt.expression["tag"],
        "infixExpression",
        `exprStmt.expression is not an InfixExpression. got=${exprStmt.expression["tag"]}`
      );
      const ie = exprStmt.expression as InfixExpression.t;
      assert.strictEqual(
        ie["tag"],
        "infixExpression",
        `ie is not an InfixExpression. got=${ie["tag"]}`
      );
      testStringLiteral(ie.left, tt.leftValue);
      testChordLiteral(ie.right, tt.rightValue);
    }
  });
});
