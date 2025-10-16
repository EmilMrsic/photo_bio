#!/bin/bash

echo "Deleting old codex branches from remote..."

# Delete old codex branches
git push origin --delete codex/add-provider-resources-page
git push origin --delete codex/provide-project-progress-update
git push origin --delete codex/scaffold-tailwind-based-web-platform
git push origin --delete eybq8w-codex/scaffold-tailwind-based-web-platform
git push origin --delete tr0d5v-codex/scaffold-tailwind-based-web-platform
git push origin --delete yu6l2v-codex/scaffold-tailwind-based-web-platform

echo "Old branches deleted!"

# Now push the new codex branch
echo "Pushing new codex branch..."
git push -u origin codex

echo "Done!"
