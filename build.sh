#/bin/bash

tsc
webpack-cli
rm -r release/*
cp -r images index.html favicon.png dist release