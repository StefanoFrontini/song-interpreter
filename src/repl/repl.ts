import * as Evaluator from "#root/src/evaluator/evaluator.ts";
import * as Lexer from "#root/src/lexer/lexer.ts";
import * as Obj from "#root/src/object/obj.ts";
import * as Parser from "#root/src/parser/parser.ts";
import { stdin as input, stdout as output } from "node:process";
import * as readline from "node:readline/promises";

const rl = readline.createInterface({ input, output });
const PROMPT = ">> ";

const printParserErrors = (errors: string[]): void => {
  for (const msg of errors) {
    console.error("parser errors: ", msg);
  }
};

export const start = async (): Promise<void> => {
  while (true) {
    const line = await rl.question(PROMPT);
    const l = Lexer.init(line);
    const p = Parser.init(l);
    const program = Parser.parseProgram(p);
    if (p.errors.length !== 0) {
      printParserErrors(p.errors);
      continue;
    }
    const evaluated = Evaluator.evalNode(program);
    if (evaluated) {
      console.log(Obj.inspect(evaluated));
    }
  }
};
