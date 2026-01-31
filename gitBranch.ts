import { input } from "./input.js";
import { run } from "./run.js";

let branchName:string;

export async function gitBranch() {
    branchName = await input("Enter your branch name: ");
    if (branchName.trim() === "") {
      console.log("Branch name cannot be empty");
      return;
    }
    try {
      run("git switch -c " + branchName);
      run("git branch");
    } catch (error) {
      console.log("Error: " + error);
      return;
    }
}