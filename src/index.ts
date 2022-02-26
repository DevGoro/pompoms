#!/usr/bin/env node

import { pomodoroLoop } from "./pomodoro/loop";
import { endMessage, readyMessage, welcomeMessage } from "./utils/messages";
import { getUserInput } from "./utils/userInput";

const workInMins = 25;
const shortBreakInMins = 5;

let roundsToComplete = 0;
let roundsCompleted = 0;
let longBreakInMins = 25;

const main = async () => {
  welcomeMessage();
  ({ longBreakInMins, roundsToComplete } = await getUserInput(longBreakInMins));
  await readyMessage();
  while (roundsCompleted < roundsToComplete || roundsToComplete === 0) {
    ({ roundsCompleted } = await pomodoroLoop(
      roundsToComplete,
      longBreakInMins
    ));
  }
};

["SIGINT", "exit"].forEach((e) =>
  process.on(e, () => endMessage(roundsCompleted, roundsToComplete, e))
);

main();