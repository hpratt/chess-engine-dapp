#!/bin/bash

set -e

# cd to project root directory
cd "$(dirname "$(dirname "$0")")"
scripts/build.sh

python3 -m pytest
