#!/bin/bash

# --- test and build ---
echo "Starting Build-Prozess..."
npm run build
npm run test


# --- update version ---
set -e

CURRENT_VERSION=$(grep "Version:" Linux/DEBIAN/control | awk '{print $2}')
NEW_VERSION=$(echo $CURRENT_VERSION | awk -F. '{$NF = $NF + 1;} 1' OFS=.)
echo "⬆Update Version: $CURRENT_VERSION -> $NEW_VERSION"
sed -i "s/Version: .*/Version: $NEW_VERSION/" Linux/DEBIAN/control

# --- build package ---
echo "Compiling Binary with Bun..."
npx bun build ./index.ts --compile --outfile git-tool

# --- make folder if needed ---
mkdir -p ./Linux/usr/bin/
mkdir -p for_installation/Linux/

# --- copy binary to package folder ---
cp git-tool ./Linux/usr/bin/git-tool

# --- build debian package ---
echo "build Debian-package..."
dpkg-deb --root-owner-group --build Linux

# --- move package to installation folder ---
rm -f for_installation/Linux/Linux.deb for_installation/Linux/git-tool
mv Linux.deb for_installation/Linux/Linux.deb 
mv git-tool for_installation/Linux/git-tool

# --- analyze code ---
echo "analyzing Code..."
cloc . --exclude-dir=node_modules,build,dist --not-match-f='package-lock.json|package.json' > count_code.txt

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

# --- commit and push changes ---
echo "Synchronisiere with Git..."
git add .
git commit -m "Build and prepare for installation"
git pull --rebase
git push

# --- finish ---
echo "Finish! Package is in for_installation/Linux/Linux.deb"