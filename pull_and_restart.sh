#!/usr/bin/env bash

# This script is intended to be executed by the webhoook. Do NOT execute it manually.
set -e

if [[ $# -ne 2 ]]; then
    echo "Usage: $0 <directory> <pm2_name>"
    exit 1
fi
if [[ ! -f repo_key ]]; then
    echo "Error: expected repo_key"
    exit 1
fi

eval $(ssh-agent)
ssh-add repo_key
cd "$1"
git pull

pm2 restart "$2"
