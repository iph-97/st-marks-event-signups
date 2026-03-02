# Quick Reference Guide

## Common Tasks

### Making Updates

```bash
# 1. Edit your files (app-neon.js, index.html, etc.)

# 2. Save and commit
git add .
git commit -m "Updated dinner party signup form"

# 3. Push to GitHub (auto-deploys to Netlify)
git push
```

### Update Database Schema

```sql
-- 1. Go to Neon dashboard → SQL Editor
-- 2. Run your SQL commands, for example:

ALTER TABLE parties ADD COLUMN rsvp_deadline DATE;

-- 3. No Netlify deployment needed!
```

### Update Environment Variables

1. Go to Netlify dashboard
2. Site settings → Environment variables
3. Edit `DATABASE_URL` or add new variables
4. Next deployment will use new values

### View Logs (Debugging)

```bash
# View function logs
netlify functions:log series
netlify functions:log parties

# Or in Netlify dashboard:
# Functions → [function name] → Function log
```

### Roll Back to Previous Version

```bash
# See commit history
git log --oneline

# Roll back to a specific commit
git revert [commit-hash]
git push

# Or in Netlify dashboard:
# Deploys → Find old deploy → "Publish deploy"
```

### Test Locally Before Deploying

```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Run local development server
netlify dev

# Visit http://localhost:8888
# Functions will work at http://localhost:8888/.netlify/functions/series
```

### Create a Preview Branch

```bash
# Create a new branch for testing
git checkout -b test-new-feature

# Make changes and commit
git add .
git commit -m "Testing new guest notification feature"

# Push to GitHub
git push -u origin test-new-feature

# Netlify automatically creates a preview URL!
# Find it in: Netlify dashboard → Deploys → Branch deploys
```

### Export Database Data

```bash
# Using psql (PostgreSQL command line)
# Get your Neon connection string from Netlify env vars

# Export entire database
pg_dump [YOUR_NEON_CONNECTION_STRING] > backup.sql

# Export specific table as CSV
psql [YOUR_NEON_CONNECTION_STRING] -c "COPY series TO STDOUT CSV HEADER" > series.csv
psql [YOUR_NEON_CONNECTION_STRING] -c "COPY parties TO STDOUT CSV HEADER" > parties.csv
```

## File Change Reference

| File Modified | Impact | How to Deploy |
|--------------|--------|---------------|
| `app-neon.js` | Frontend behavior | `git push` |
| `index.html` | Page structure/styling | `git push` |
| `lucide-icons.js` | Icon updates | `git push` |
| `netlify/functions/series.js` | Series API logic | `git push` (rebuilds functions) |
| `netlify/functions/parties.js` | Parties API logic | `git push` (rebuilds functions) |
| `package.json` | Dependencies | `git push` (full rebuild) |
| Database schema | Data structure | Run SQL in Neon (no deploy) |
| Environment variables | Configuration | Update in Netlify dashboard |

## Useful Commands

```bash
# Check Git status
git status

# See what changed
git diff

# View commit history
git log --oneline

# Undo uncommitted changes
git checkout -- [filename]

# Check which remote is connected
git remote -v

# Pull latest changes (if collaborating)
git pull

# See Netlify site info
netlify status

# Open Netlify dashboard
netlify open

# Open site in browser
netlify open:site
```

## Troubleshooting

### "Everything up-to-date" but changes not showing
```bash
# Make sure you committed
git status

# If files are uncommitted:
git add .
git commit -m "Your message"
git push
```

### Function not updating after deploy
```bash
# Clear function cache in Netlify
# Netlify dashboard → Site settings → Build & deploy → Clear cache and deploy
```

### Database connection failing
```bash
# Check environment variable is set
netlify env:list

# If not set, add it:
netlify env:set DATABASE_URL "your-connection-string"
```

### Local development not working
```bash
# Make sure you're in the project directory
cd st-marks-signups

# Link to your Netlify site
netlify link

# Set environment variables locally
netlify env:pull

# Try again
netlify dev
```

## Contact

For help with Git/deployment: [your IT contact]
For help with content: [your communications contact]