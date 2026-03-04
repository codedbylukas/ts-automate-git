#!/bin/bash

echo "Starting Build-Prozess..."
npm run build
npm run test

echo "Compiling Binary with Bun..."
npx bun build ./index.ts --compile --outfile git-tool

mkdir -p ./Linux/usr/bin/
mkdir -p for_installation/Linux/

cp git-tool ./Linux/usr/bin/git-tool

echo "build Debian-package..."
dpkg-deb --root-owner-group --build Linux

rm -f for_installation/Linux/Linux.deb for_installation/Linux/git-tool
mv Linux.deb for_installation/Linux/Linux.deb 
mv git-tool for_installation/Linux/git-tool

echo "analyzing Code-Menge..."
cloc . --exclude-dir=node_modules,build,dist --not-match-f='package-lock.json|package.json' > count_code.txt

echo "Synchronisiere with Git..."
git add .
git commit -m "Build and prepare for installation"
git pull --rebase
git push

echo "Finish! Package is in for_installation/Linux/Linux.deb"