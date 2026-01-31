import { run } from "./run.js";
import { input, closeInput } from "./input.js";

let push:string;
let init:string;
let pushing:boolean;
let message:string;

console.log('\n--- Starte Git Workflow ---');

init = await input("Do you want to init it? (y/n) ");
console.log(init);
if (init.trim().toLowerCase() === "y") {
    run('git init');
} else if (init.trim().toLowerCase() === "n") {
  console.log("Okay, I don't init it.");
} else {
  console.log("Invalid Choice");
  process.exit();
}

push = await input("Do you want to push it after every modifire? (y/n) ");
console.log(push);
if (push.trim().toLowerCase() === "y") {
    pushing = true;
} else if (push.trim().toLowerCase() === "n") {
    pushing = false;
} else {
  console.log("Invalid Choice");
  process.exit();
}
console.log("Write your changes or q to to exit.")
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
