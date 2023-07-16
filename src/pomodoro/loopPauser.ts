import { TaskManager } from "../utils/TaskManager"
import cliProgress from "cli-progress"

/*
    Pauses the loop if the TaskManager is active, so that the menu can be displayed properly.
*/
export const pomodoroLoopPauser = async (bar?: cliProgress.Bar, i?: number) => {
    return new Promise<void>(async resolve => {
        if (!TaskManager.active) resolve()
        else {
            TaskManager.pausedLoop = resolve
        }
    })
}