# TypeScript Git Automator 

Welcome to the **TypeScript Git Automator**! This project helps you to automate your Git workflow and make it super easy. No more typing boring commands – let the script do the work! 

## Features

*   **Automatic Initialization**: Asks you if you want to initialize a new Git repo (`git init`). Defaults to 'n' (skip).
*   **Auto-Push Configuration**: Decide if you want to push automatically after every commit (`git push`). Defaults to 'y' (auto-push).
*   **Branch Mode**: Switch between branches or create new ones on the fly with the `b` command.
*   **Infinite Commit Loop**: Just enter your commit message, and the tool handles the rest:
    *   `git add .`
    *   `git commit -m "Your message"`
    *   `git pull` (for safety)
    *   `git push` (if enabled)
*   **Robust & Tested**: Written correctly in TypeScript and tested with Jest! 

## Installation

Make sure you have [Node.js](https://nodejs.org/) installed. Then follow these steps:

1.  **Clone the repository** (or download):
    ```bash
    git clone https://github.com/YourUsername/typescript_automate_git.git
    cd typescript_automate_git
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Usage

To start the automator, simply run the following command:

```bash
npx tsx index.ts
```

### Workflow

1.  **Init?** 
    *   Answer `Do you want to init it? (y/n) (default: n)` with `y` to run `git init`.
    *   Press `Enter` or answer `n` to skip (default behavior).

2.  **Auto-Push?** 
    *   `Do you want to push it after every modifire? (y/n) (default: y)`
    *   Press `Enter` or answer `y` = Automatic push after every commit (default behavior).
    *   `n` = Commit locally only.

3.  **Let's go!** 
    *   Enter your commit message and press `Enter`.
    *   Type `b` to enter **Branch Mode** and switch/create branches. 
    *   To exit, simply type `q`. 

## Tests

We take quality seriously! You can run the tests to make sure everything is working:

```bash
npm test
```

The project uses **Jest** for unit tests. 

## Build

When you want to build the project to js please use my own build script. Make sure that the build folder already exists. 

#### Linux:

```bash
./build.sh
```

#### Windows:

```bash
./build.bat
```

## Project Structure

*   `index.ts`: The main entry point. 
*   `gitInit.ts`: Logic for `git init` prompt. 
*   `gitPush.ts`: Configuration for auto-push. 
*   `gitBranch.ts`: Branch switching and creation logic. 
*   `run.ts`: Helper to execute shell commands. 
*   `input.ts`: Helper for user input. 
*   `tests/`: Where the tests live. 

## Contributing

Want to contribute? Awesome! 

1.  Fork the repo. 🍴
2.  Create a branch (`git switch -c feature/CoolFeature`). 
3.  Commit your changes (`git commit -m 'Add CoolFeature'`). 
4.  Push the branch (`git push origin feature/CoolFeature`). 
5.  Open a Pull Request. 

