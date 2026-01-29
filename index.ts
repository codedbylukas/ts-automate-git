const { execSync } = require("child_process");
const readline = require("readline");
let text_info: string;
let message: string;

const rl: any = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function run(command: string) {
  try {
    console.log(`Run command: ${command}`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Error: ${command}`);
    process.exit(1);
  }
}

function input(text_info: string) {
  rl.question(text_info, (message: string) => {
    return message;
  });
}
