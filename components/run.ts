import { execSync } from "child_process";

export function run(command: string) {
  try {
    console.log(`Run command: ${command}`);
    execSync(command, { stdio: "inherit" });
  } catch (e) {
    console.error(`Error: ${command}`);
    console.error(`Error details: ${e}`);
    process.exit(1);
  }
}
