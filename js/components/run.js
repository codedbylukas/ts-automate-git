import { execSync } from "child_process";
export function run(command) {
    try {
        console.log(`Run command: ${command}`);
        execSync(command, { stdio: "inherit" });
    }
    catch (error) {
        console.error(`Error: ${command}`);
        process.exit(1);
    }
}
