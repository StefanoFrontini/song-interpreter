import * as Obj from "#root/src/object/obj.ts";
export type t = {
  tag: "chord";
  value: string;
};

export const type = (): Obj.ObjectType => Obj.CHORD_OBJ;

export const inspect = (s: t): string => s.value;
