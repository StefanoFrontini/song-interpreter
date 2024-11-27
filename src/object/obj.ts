import * as Chord from "#root/src/object/chord.ts";
import * as Endofline from "#root/src/object/endofline.ts";
import * as ErrorObj from "#root/src/object/errorObj.ts";
import * as Lyric from "#root/src/object/lyric.ts";

export type t = Lyric.t | Chord.t | Endofline.t | ErrorObj.t;

export type ObjectType = "LYRIC" | "CHORD" | "ENDOFLINE" | "ERROR_OBJ";

export const LYRIC_OBJ = "LYRIC",
  CHORD_OBJ = "CHORD",
  ENDOFLINE_OBJ = "ENDOFLINE",
  ERROR_OBJ = "ERROR_OBJ";

export const inspect = (obj: t): string => {
  switch (obj["tag"]) {
    case "lyric":
      return Lyric.inspect(obj);
    case "chord":
      return Chord.inspect(obj);
    case "endofline":
      return Endofline.inspect(obj);
    case "error":
      return ErrorObj.inspect(obj);
    default:
      const _exhaustiveCheck: never = obj;
      throw new Error(_exhaustiveCheck);
  }
};
