import { run } from "./components/run.js";
import { input, closeInput } from "./components/input.js";
import { gitInit } from "./components/gitInit.js";
import { gitPushConfig } from "./components/gitPush.js";
import { gitBranch } from "./components/gitBranch.js";
let pushing;
let message;
console.log('\n--- Starte Git Workflow ---');
await gitInit();
pushing = await gitPushConfig();
console.log("Write your changes or q to to exit. ");
console.log("Write b to switch to the brach mode. ");
while (true) {
    message = await input("Enter your commit message or q to to exit: ");
    if (message.toLowerCase() === "q") {
        break;
    }
    if (message.toLowerCase() === "b") {
        gitBranch();
    }
    else {
        run(`git add .`);
        run(`git commit -m "${message}"`);
        if (pushing) {
            run("git pull");
            run('git push');
        }
    }
}
console.log("\n--- Git Workflow beendet ---");
closeInput();
