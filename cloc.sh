#/bin/bash

cloc . --exclude-dir=node_modules,build,dist --not-match-f='package-lock.json|package.json' > count_code.txt
