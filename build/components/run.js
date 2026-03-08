import { spawnSync } from "child_process";
export function run(command, args = []) {
    console.log(`Executing: ${command} ${args.join(" ")}`);
    const result = spawnSync(command, args, {
        stdio: "inherit",
        shell: true
    });
    if (result.error) {
        console.error(`Failed to start command: ${result.error.message}`);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(`Command exited with code: ${result.status}`);
        process.exit(result.status || 1);
    }
}
