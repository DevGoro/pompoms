import inquirer from "inquirer";
import readline from "readline";
import checkbox from "@inquirer/checkbox"
import { deleteLines } from "./deleteLine";

export class TaskManager {
    public static active: boolean = false                               // Status of the TaskManager       
    public static pausedLoop: (value: void | PromiseLike<void>) => void // Function to resolve an Promise and continue the PomodoroLoop this way
    public static tasks: Array<string> = []

    /*
        Asks for tasks at start
    */
    public static async setup() {
        const result = await inquirer.prompt([
            {
              name: "tasks",
              type: "input",
              message: `What are your tasks? \n      Separate tasks with a ;`,
            },
        ]);

        const resultArray =  result.tasks.split(";")
        resultArray.forEach((task: string) => {
            this.tasks.push(task.trim())
        })
    }

    /*
        Adds a listener for keypress events so that the TaskManager can be controlled with shortcuts
    */
    public static registerListener() {
        process.stdin.setRawMode(true);
        process.stdin.resume()

        process.stdin.on('keypress', async (str, key) => {
            if (key.ctrl && key.name === 'c') {
                process.exit();
            }
        
            if(!TaskManager.active) {
                TaskManager.active = true

                if (key.name === "t") {
                    await this.menu()
                }

                if (key.name === "a") {
                    await this.addTask()
                }

                if (key.name === "c") {
                    await this.completeTask()
                }
                
                process.stdin.resume()          // Has to be resumed because inquirer messes with the stdin
                process.stdin.setRawMode(true);
                TaskManager.active = false
                if (TaskManager.pausedLoop) TaskManager.pausedLoop()            // Continues PomodoroLoop
            }
        });
    }

    /* 
        Opens the TaskManager Menu
    */
    static async menu() {
        process.stdout.write("\n")          // New Line so that the prompt is not written on the line of the bar
        
        const choice = await inquirer.prompt({
            name: "option",
            type: "list",
            message: "What do you want to do?",
            choices: [
                "Add task",
                "Mark task as complete"
            ]
        })

        if (choice.option === "Add task") {
            await this.addTask(true)
        }

        else if (choice.option === "Mark task as complete") {
            await this.completeTask(true)
        }

        await deleteLines(0)
    }

    /*
        Adds tasks to the list
    */
    static async addTask(menu?: boolean) {
        if (!menu) process.stdout.write("\n")           // Menu already creates a new line

        const answers = await inquirer.prompt([
            {
              name: "tasks",
              type: "input",
              message: `What tasks do you want to add? \n      (Separate tasks with a ;)`,
            },
        ]);

        for (let task of answers.tasks.split(";")) {
            this.tasks.push(task)
        }

        await deleteLines(2)
    }

    /* 
        Removes tasks from the list
    */
    static async completeTask(menu?: boolean) {
        if (!menu) process.stdout.write("\n")           // Menu already creates a new line

        const choices: Array<{ name: string, value: string }> = []
        this.tasks.forEach(task => {
            choices.push({ name: task, value: task })
        })

        const result = await checkbox({
            message: "Mark tasks as complete",
            choices: choices
        })

        const taskLines = this.tasks.length

        result.forEach(task => {
            this.tasks.splice(this.tasks.indexOf(task), 1)
        })

        await deleteLines(1)
   }
}