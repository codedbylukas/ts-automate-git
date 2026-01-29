const { execSync } = require('child_process');
const readline = require('readline');

const rl:any = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function run(command:string) {
  try {
    console.log(`Run command: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error: ${command}`);
    process.exit(1);
  }
}
