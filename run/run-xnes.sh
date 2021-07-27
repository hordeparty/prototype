#!/bin/bash
git clone https://github.com/hordeparty/xnes.git
mkdir -p xnes/output
cp ../*.html xnes/output
cp ../*.js xnes/output
cd xnes && ./docker-run.sh
