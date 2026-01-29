const { execSync } = require("child_process");
const readline = require("readline");

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

function input(text_info:string) {
  rl.question(text_info, (message:string) => {
    return message;
  });
}

//   run('git init');
//   run('git add .');
//   run(`git commit -m "${message}"`);
//   console.log('\nFertig! Der Commit wurde erstellt.');
