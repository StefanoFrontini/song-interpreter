import * as Obj from "#root/src/object/obj.ts";
export type t = {
  tag: "endofline";
  value: string;
};

export const type = (): Obj.ObjectType => Obj.ENDOFLINE_OBJ;

export const inspect = (s: t): string => s.value;
