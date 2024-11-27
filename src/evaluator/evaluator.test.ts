import * as Evaluator from "#root/src/evaluator/evaluator.ts";
import * as Lexer from "#root/src/lexer/lexer.ts";
import * as Lyric from "#root/src/object/lyric.ts";
import * as Obj from "#root/src/object/obj.ts";
import * as Parser from "#root/src/parser/parser.ts";
import assert from "node:assert";
import { describe, it } from "node:test";

const testEvalNode = (input: string) => {
  const l = Lexer.init(input);
  const p = Parser.init(l);
  const program = Parser.parseProgram(p);
  return Evaluator.evalNode(program);
};

const testLyricObject = (obj: Obj.t, expected: string) => {
  assert.strictEqual(
    obj["tag"],
    "lyric",
    `obj is not a Lyric Object. got=${obj["tag"]}`
  );
  const lyricObj = obj satisfies Lyric.t;
  assert.strictEqual(
    lyricObj.value,
    expected,
    `lyricObj.value is not '${expected}'. got=${lyricObj.value}`
  );
};

describe("evaluator", () => {
  it("TestEvalStringLiteral", () => {
    const tests = [
      {
        input: "ab c",
        expected: "ab c",
      },
    ];
    for (const tt of tests) {
      const evaluated = testEvalNode(tt.input);
      assert.ok(evaluated, "evaluated is null");
      testLyricObject(evaluated, tt.expected);
    }
  });
});
