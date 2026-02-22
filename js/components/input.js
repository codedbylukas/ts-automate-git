import readline from "readline";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
export function input(text_info) {
    return new Promise((resolve) => {
        rl.question(text_info, (message) => {
            resolve(message);
        });
    });
}
export function closeInput() {
    rl.close();
}
