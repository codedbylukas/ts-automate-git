import { execSync } from "child_process";
import readline from "readline";

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

let choice: string = await input("Do you want to init it? (y/n) ");

if (choice.toLowerCase() === "y") {
    run('git init');
}

rl.close();