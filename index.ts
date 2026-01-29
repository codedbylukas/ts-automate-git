const { execSync } = require("child_process");
const readline = require("readline");
let text_info: string;
let message: string;

console.log('\n--- Starte Git Workflow ---');

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


// }
// rl.question('Gib deine Commit-Nachricht ein: ', (message) => {

//   console.log('\n--- Starte Git Workflow ---');

//   run('git init');
//   run('git add .');

//   // Hier nutzen wir die Benutzereingabe für den Commit
//   run(`git commit -m "${message}"`);

//   console.log('\nFertig! Der Commit wurde erstellt.');

//   rl.close();
// });

