#!/usr/bin/env bash

# This script is intended to be executed by the webhoook. Do NOT execute it manually.
set -e

eval $(ssh-agent)
ssh-add repo_key
cd ../council.csie-frontend
git pull
cd ../council.csie-backend
git pull

pm2 restart $@
