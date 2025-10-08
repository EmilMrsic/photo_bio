# Instructions to Update Main Branch

Since the main branch on GitHub contains commits with secrets, we need to force-push the clean warp branch to main. 

**WARNING**: This will rewrite the history of the main branch!

## Option 1: Via GitHub Web UI (Recommended)

1. Go to https://github.com/EmilMrsic/photo_bio
2. Click "Pull requests" → "New pull request"
3. Set base: `main`, compare: `warp`
4. Create the pull request and merge it

## Option 2: Force Push (Use with caution)

If you want to completely replace main with the clean warp branch:

```bash
# First, make sure you're on the warp branch
git checkout warp

# Create a backup of the current main branch
git branch main-backup origin/main

# Force push warp to main
git push origin warp:main --force-with-lease

# Update your local main branch
git checkout main
git reset --hard origin/main
```

## Option 3: Merge locally and push

```bash
# Switch to main
git checkout main

# Reset main to match origin/main
git reset --hard origin/main

# Merge warp branch
git merge warp

# Push to origin (this might fail due to secrets)
git push origin main
```

After updating main, all branches should have the same starting point.
