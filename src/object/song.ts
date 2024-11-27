type Chord = {
  tag: "chord";
  value: string;
};

type Lyric = {
  tag: "lyric";
  value: string;
};

type Endofline = {
  tag: "endofline";
  value: string;
};

export type t = Array<Chord | Lyric | Endofline>;

// export type ObjectType = "LYRIC" | "CHORD" | "ENDOFLINE" | "ERROR_OBJ";

// export const LYRIC_OBJ = "LYRIC",
//   CHORD_OBJ = "CHORD",
//   ENDOFLINE_OBJ = "ENDOFLINE",
//   ERROR_OBJ = "ERROR_OBJ";
