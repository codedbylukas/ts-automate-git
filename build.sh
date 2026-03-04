#!/bin/bash

npm run build
cp -r ./build/* ./js/
npx bun build ./index.ts --compile --outfile git-tool
cp git-tool ./Linux/usr/bin/git-tool
dpkg-deb --root-owner-group --build Linux
npm run test