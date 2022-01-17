#!/bin/bash

set -e

# cd to project root directory
cd "$(dirname "$(dirname "$0")")"

docker build -t chess-engine-dapp .
python3 -m pip install pytest
