#!/bin/bash

npm run build
cp -r ./build/* ./js/
npm run test