import cliProgress from "cli-progress";
import chalk from "chalk";
import emoji from "node-emoji";

import { waitOneMin } from "../utils/sleep";
import { pomodoroLoopPauser } from "./loopPauser";

export const pomodoroLongBreak = async (longBreakInMins: number) => {
  const lb1 = new cliProgress.Bar({
    format: ` ${emoji.get("sun_with_face")} ${chalk.blue(
      "{bar}"
    )} Long break  | {value}/{total} minutes`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  await pomodoroLoopPauser(lb1, 0)
  
  lb1.start(longBreakInMins, 0);

  let i = 0;
  while (i < longBreakInMins) {
    await waitOneMin();
    await pomodoroLoopPauser(lb1, i)
    i++;
    lb1.update(i);
  }

  lb1.stop();
};
