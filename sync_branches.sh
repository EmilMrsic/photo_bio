#!/bin/bash

echo "Syncing all branches to have the same starting point..."

# First, fetch all remote branches
git fetch --all

# Update claude branch
echo "Updating claude branch..."
git checkout claude
git reset --hard warp
git push origin claude --force-with-lease

# Update codex branch (after old ones are deleted)
echo "Updating codex branch..."
git checkout codex
git reset --hard warp
git push origin codex --force-with-lease

# Go back to warp
git checkout warp

echo "All branches are now synced!"
echo "- main: needs manual update (see UPDATE_MAIN.md)"
echo "- claude: synced with warp"
echo "- codex: synced with warp"
echo "- warp: current working branch"
