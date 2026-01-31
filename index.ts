import { run } from "./run.js";
import { input, closeInput } from "./input.js";

let push:string;
let init:string;
let pushing:boolean;
let message:string;

console.log('\n--- Starte Git Workflow ---');

init = await input("Do you want to init it? (y/n) ");

if (init.toLowerCase() === "y") {
    run('git init');
}
if (init.toLowerCase() === "n") {
  console.log("Okay, I dont init it.");
}
else {
  console.log("Invalid Choice");
  process.exit();
}

push = await input("Do you want to push it after every modifire? (y/n) ");

if (push.toLowerCase() === "y") {
    pushing = true;
}
if (push.toLowerCase() === "n") {
    pushing = false;
}
else {
  console.log("Invalid Choice");
  process.exit();
}

closeInput();
