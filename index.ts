import { execSync } from "child_process";
import readline from "readline";

let push:string;
let init:string;

export {}; 

console.log('\n--- Starte Git Workflow ---');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function run(command:string) {
  try {
    console.log(`Run command: ${command}`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Error: ${command}`);
    process.exit(1);
  }
}

function input(text_info: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(text_info, (message: string) => {
      resolve(message);
    });
  });
}

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
