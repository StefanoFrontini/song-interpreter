import * as Obj from "#root/src/object/obj.ts";
export type t = {
  tag: "lyric";
  value: string;
};

export const type = (): Obj.ObjectType => Obj.LYRIC_OBJ;

export const inspect = (s: t): string => s.value;
