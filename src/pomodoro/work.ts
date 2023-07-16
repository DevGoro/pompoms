import cliProgress from "cli-progress";
import chalk from "chalk";
import emoji from "node-emoji";

import { waitOneMin } from "../utils/sleep";
import { pomodoroLoopPauser } from "./loopPauser";

const workInMins = 25;

export const pomodoroWork = async () => {
  const w1 = new cliProgress.Bar({
    format: ` ${emoji.get("memo")} ${chalk.redBright(
      "{bar}"
    )} Working      | {value}/{total} minutes`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  await pomodoroLoopPauser(w1, 0)
  
  w1.start(workInMins, 0);

  let i = 0;
  while (i < workInMins) {
    await waitOneMin();
    await pomodoroLoopPauser(w1, i)
    i++;
    w1.update(i);
  }

  w1.stop();
};
