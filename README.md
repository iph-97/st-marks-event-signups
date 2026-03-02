# St. Mark's Event Sign Ups

A web application for managing recurring dinner parties and community events at St. Mark's Episcopal Church, Capitol Hill, Washington DC.

## Features

- 📅 **Event Series Management** - Create multiple event series with specific date ranges
- 🏠 **Host Sign-Ups** - Members can volunteer to host dinners at their homes
- 👥 **Guest Management** - Track RSVPs and dietary restrictions
- 👶 **Kid-Friendly Indicator** - Hosts can specify if children are welcome
- 💾 **PostgreSQL Database** - Shared data across all users via Neon
- 🎨 **St. Mark's Branding** - Navy, burgundy, and serif fonts matching church style

## Tech Stack

- **Frontend**: React (vanilla, no build step), Tailwind CSS
- **Backend**: Netlify Serverless Functions
- **Database**: Neon PostgreSQL
- **Hosting**: Netlify

## Project Structure

```
st-marks-signups/
├── index.html              # Main HTML file with St. Mark's styling
├── app-neon.js            # React application code
├── lucide-icons.js        # Icon components
├── package.json           # Dependencies
├── netlify.toml          # Netlify configuration
├── schema.sql            # Database schema (run in Neon)
└── netlify/
    └── functions/
        ├── series.js     # Event series CRUD operations
        └── parties.js    # Dinner party CRUD operations
```

## Setup Instructions

See [NEON_SETUP.md](NEON_SETUP.md) for complete deployment instructions.

### Quick Setup

1. **Clone and install:**
   ```bash
   git clone [your-repo-url]
   cd st-marks-signups
   npm install
   ```

2. **Set up Neon database:**
   - Create account at [neon.tech](https://neon.tech)
   - Create new project
   - Run `schema.sql` in Neon SQL Editor
   - Copy connection string

3. **Deploy to Netlify:**
   - Create account at [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Add environment variable: `DATABASE_URL` = [your Neon connection string]
   - Deploy!

## Making Updates

### Option 1: Git Push (Recommended)
```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push
```
Netlify automatically deploys within 2 minutes!

### Option 2: Netlify CLI
```bash
netlify deploy --prod
```

## Environment Variables

Required environment variable in Netlify:

- `DATABASE_URL` - PostgreSQL connection string from Neon

**Never commit this to Git!** Set it in Netlify dashboard under Site settings → Environment variables.

## Database Schema

Tables:
- `series` - Event series with date ranges
- `parties` - Individual dinner parties linked to series

See `schema.sql` for full schema.

## Development

No build step needed! Just edit the files and deploy.

To test locally:
1. Use [Netlify Dev](https://www.netlify.com/products/dev/):
   ```bash
   netlify dev
   ```
2. Visit `http://localhost:8888`

## Support

For issues or questions, contact the St. Mark's communications team.

## License

Copyright © 2025 St. Mark's Episcopal Church, Capitol Hill

---

Built with ❤️ for the St. Mark's community