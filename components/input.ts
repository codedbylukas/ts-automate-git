import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function input(text_info: string): Promise<string> {
  try {
    return new Promise((resolve) => {
      rl.question(text_info, (message: string) => {
        resolve(message);
      });
    });
  }
  catch (e) {
    console.error("Error: " + e);
    return Promise.reject(e);
  }
}

export function closeInput() {
  rl.close();
}
