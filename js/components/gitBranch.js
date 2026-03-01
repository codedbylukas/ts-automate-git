import { input } from "./input.js";
import { run } from "./run.js";
let branchName;
let choice;
function showBegining() {
    console.log("\n--- Git Branch ---");
    console.log("Do you want to switch or create a new branch? (default: create)");
    console.log("1. Switch to a branch");
    console.log("2. Create a new branch");
}
async function switchBranch() {
    branchName = await input("Enter your branch name: ");
    if (branchName.trim() === "") {
        console.log("Branch name cannot be empty");
        return;
    }
    try {
        run("git switch " + branchName);
        run("git branch");
        process.exit();
    }
    catch (e) {
        console.log("Error: " + e);
        return;
    }
}
async function createBranch() {
    branchName = await input("Enter your branch name: ");
    if (branchName.trim() === "") {
        console.log("Branch name cannot be empty");
        return;
    }
    try {
        run("git switch -c " + branchName);
        run("git branch");
        process.exit();
    }
    catch (error) {
        console.log("Error: " + error);
        return;
    }
}
export async function gitBranch() {
    showBegining();
    choice = await input("Enter your choice (1/2) (default: 2): ");
    if (choice.trim() === "1") {
        switchBranch();
    }
    else if (choice.trim() === "2") {
        createBranch();
    }
}
