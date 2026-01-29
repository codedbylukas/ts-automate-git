const { execSync } = require('child_process');
const readline = require('readline');

const rl:any = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function run(command:string) {
  try {
    console.log(`Führe aus: ${command}`);
    // stdio: 'inherit' sorgt dafür, dass du den Output (z.B. Git-Status) direkt siehst
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Fehler beim Befehl: ${command}`);
    process.exit(1);
  }
}
