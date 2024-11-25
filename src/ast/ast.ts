import * as Expression from "#root/src/ast/expression.ts";
import * as Program from "#root/src/ast/program.ts";
import * as Statement from "#root/src/ast/statement.ts";

export type t = Expression.t | Statement.t | Program.t;
