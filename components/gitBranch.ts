import { input } from "./input.js";
import { run } from "./run.js";

let branchName: string;
let choice: string;

function showBegining() {
  console.log("\n--- Git Branch ---");
  console.log(
    "Do you want to switch or create a new branch? (default: create)",
  );
  console.log("1. Switch to a branch");
  console.log("2. Create a new branch");
}
async function is_avalible(branchName: string): Promise<boolean> {
  try {
    if (branchName.trim() === "") {
      console.log("Branch name cannot be empty");
      return false;
    } else if (branchName.trim() === "main" || branchName.trim() === "master") {
      console.log("You cannot switch to main or master branch");
      return false;
    } else if (
      branchName.trim().includes("&&") ||
      branchName.trim().includes("|") ||
      branchName.trim().includes(";")
    ) {
      console.log(
        "Invalid branch name. Please avoid using special characters.",
      );
      return false;
    } else {
      return true;
    }
  } catch (e) {
    console.error("Error IN BRANCH FILE: " + e);
    return false;
  }
}
async function switchBranch() {
  branchName = await input("Enter your branch name: ");
  if (await is_avalible(branchName)) {
    try {
      run("git switch " + branchName);
      run("git branch");
      process.exit();
    } catch (e) {
      console.error("Error IN SWITCH BRANCH FILE: " + e);
      return;
    }
  } else {
    console.log("Please try again.");
    process.exit(1);
  }
}

async function createBranch(pushing: boolean) {
  branchName = await input("Enter your branch name: ");
  if (branchName.trim() === "") {
    console.log("Branch name cannot be empty");
    return;
  }
  try {
    run("git switch -c " + branchName);
    if (pushing) {
      try {
        run("git push -u origin " + branchName);
      } catch (e) {
        console.error("Error pushing branch: " + e);
        return;
      }
    }
    run("git branch");
    process.exit();
  } catch (error) {
    console.log("Error: " + error);
    return;
  }
}
export async function gitBranch(pushing: boolean) {
  try {
    showBegining();
    choice = await input("Enter your choice (1/2) (default: 2): ");
    if (choice.trim() === "1") {
      switchBranch();
    } else if (choice.trim() === "2") {
      createBranch(pushing);
    }
  } catch (e) {
    console.error("Error IN GIT BRANCH FILE: " + e);
    return Promise.reject(e);
  }
}
