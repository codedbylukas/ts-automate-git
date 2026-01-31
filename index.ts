import { run } from "./run.js";
import { input } from "./input.js";

let push:string;
let init:string;

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

// if (push.toLowerCase() === "y") {
//     run('git push');
// }
// if (push !== "y" && push !== "n") {
//   console.log("Invalid Choice");
//   process.exit();
// }

// rl.close();
