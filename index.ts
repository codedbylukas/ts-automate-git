import { run } from "./components/run.js";
import { input, closeInput } from "./components/input.js";
import { gitInit } from "./components/gitInit.js";
import { gitPushConfig } from "./components/gitPush.js";
import { gitBranch } from "./components/gitBranch.js";

await gitInit();

let pushing: boolean = await gitPushConfig();
let message: string;

while (true) {
  try {
    message = await input("Enter your commit message or q to to exit: ");
    if (message.trim() === "") {
      console.log("Commit message cannot be empty. Please try again.");
      continue;
    }
    if (message.toLowerCase() === "q") {
      break;
    }
    if (message.toLowerCase() === "b") {
      gitBranch(pushing);
    } else {
      run(`git add .`);
      run(`git commit -m "${message}"`);
      if (pushing) {
        run("git pull --rebase");
        run("git push");
      }
    }
  } catch (e) {
    console.error("Error IN MAIN FILE: " + e);
  }
}
console.log("\n--- Git Workflow beendet ---");
closeInput();
