import * as Repl from "#root/src/repl/repl.ts";
import * as os from "node:os";

const main = async (): Promise<void> => {
  const username = os.userInfo().username;
  console.log(`Hello ${username}! This is a song interpreter!`);
  console.log("Feel free to type in commands");
  await Repl.start();
};

main();
