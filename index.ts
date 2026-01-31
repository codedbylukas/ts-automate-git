import { run } from "./run.js";
import { input, closeInput } from "./input.js";
import { gitInit } from "./gitInit.js";
import { gitPushConfig } from "./gitPush.js";

let pushing:boolean;
let message:string;

console.log('\n--- Starte Git Workflow ---');

await gitInit();

pushing = await gitPushConfig();
console.log("Write your changes or q to to exit. ")
console.log("Write b to switch to the brach mode. ")
while (true) {
  message = await input("Enter your commit message or q to to exit: ");
  if (message.toLowerCase() === "q") {
    break;
  }
  run(`git add .`);
  run(`git commit -m "${message}"`);
  if (pushing) {
    run('git push');
  }
}
console.log("\n--- Git Workflow beendet ---");
closeInput();
