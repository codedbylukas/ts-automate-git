#!/bin/bash

echo "Starting Windows Build-Prozess..."

# --- test and build ---
echo "TypeScript kompilieren & Tests ausführen..."
npm run build
npm run test

# --- compile Windows .exe with Bun (cross-compilation) ---
echo "Compiling Windows .exe with Bun (cross-compile)..."
npx bun build ./index.ts --compile --target=bun-windows-x64 --outfile git-tool-64.exe


# --- make folder if needed ---
mkdir -p for_installation/Windows/

# --- move .exe to installation folder ---
echo "Moving git-tool.exe to for_installation/Windows/..."
rm -f for_installation/Windows/git-tool-64.exe
mv git-tool-64.exe for_installation/Windows/git-tool-64.exe

# --- build Windows installer with NSIS ---
echo "Building Windows installer (git-tool-setup.exe)..."
makensis installer.nsi

# --- compile macOS .exe with Bun (cross-compilation) ---
echo "Compiling macOS .exe with Bun (cross-compile)..."
mkdir -p for_installation/macOS/
bun build --compile --target=bun-darwin-arm64 ./index.ts --outfile ./for_installation/macOS/git-tool-arm64.exe
bun build --compile --target=bun-darwin-x64 ./index.ts --outfile ./for_installation/macOS/git-tool-x64.exe