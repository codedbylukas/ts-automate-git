import { input } from "./input.js";
import { run } from "./run.js";

export async function gitInit() {
  const init = await input("Do you want to init it? (y/n) ");
  console.log(init);
  if (init.trim().toLowerCase() === "y") {
    run('git init');
  } else if (init.trim().toLowerCase() === "n") {
    console.log("Okay, I don't init it.");
  } else {
    console.log("Invalid Choice");
    process.exit();
  }
}
