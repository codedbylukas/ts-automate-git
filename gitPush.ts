import { input } from "./input.js";

export async function gitPushConfig(): Promise<boolean> {
  const push = await input("Do you want to push it after every modifire? (y/n) (default: y)");
  console.log(push);
  if (push.trim().toLowerCase() === "y" || push.trim().toLowerCase() === "") {
    return true;
  } else if (push.trim().toLowerCase() === "n") {
    return false;
  } else {
    console.log("Invalid Choice");
    process.exit();
  }
}
