#!/bin/bash


npm run build
npm run test
cp -r ./build/* ./js/
npx bun build ./index.ts --compile --outfile git-tool
cp git-tool ./Linux/usr/bin/git-tool
dpkg-deb --root-owner-group --build Linux
rm for_installation/Linux/Linux.deb for_installation/Linux/git-tool
mv Linux.deb for_installation/Linux/Linux.deb 
mv git-tool for_installation/Linux/git-tool
git add .
git commit -m "Build and prepare for installation"
git pull
git push