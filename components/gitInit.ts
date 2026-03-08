import { input } from "./input.js";
import { run } from "./run.js";

export async function gitInit() {
  console.log("\n--- Starte Git Workflow ---");
  try {
    const init = await input("Do you want to init it? (y/n) (default: n) ");
    if (init.trim().toLowerCase() === "y") {
      run("git init");
    } else if (init.trim().toLowerCase() === "n" || init.trim() === "") {
      console.log("Okay, I don't init it.");
    } else {
      console.log("Invalid Choice");
      process.exit();
    }
  } catch (e) {
    console.error("An error occurred while initializing git:", e);
    process.exit(1);
  }
  console.log("Write your changes or q to to exit. ");
  console.log("Write b to switch to the brach mode. ");
}
