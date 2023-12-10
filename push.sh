#!/bin/sh
git checkout
git add .
git commit -am "made changes"
git pull
git push -f
echo Press Enter...