import readline from "readline"

/*
    Deletes lines from the console
*/
export const deleteLines = async (lines: number) => {
    readline.moveCursor(process.stdout, 0, -lines)
    readline.clearScreenDown(process.stdout)
    readline.moveCursor(process.stdout, 0, -1)
}