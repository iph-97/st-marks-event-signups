# Deploying Your Dinner Party Manager to Netlify

## Quick Start (Drag & Drop Method - 5 minutes)

This is the easiest way to get your site online!

### Step 1: Download Your Files
You should have these 3 files:
- `index.html`
- `app.js`
- `lucide-icons.js`

### Step 2: Create a Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Click "Sign up" (it's free!)
3. Sign up with GitHub, GitLab, or email

### Step 3: Deploy Your Site
1. Once logged in, you'll see your dashboard
2. Look for the area that says "Want to deploy a new site without connecting to Git?"
3. **Drag and drop** all 3 files onto that area
4. Netlify will upload and deploy your site automatically!
5. In about 30 seconds, you'll get a live URL like: `https://random-name-12345.netlify.app`

### Step 4: Customize Your URL (Optional)
1. Click "Site settings" on your site dashboard
2. Click "Change site name"
3. Enter something like `your-dinner-parties` or `smithfamily-dinners`
4. Your new URL will be: `https://your-dinner-parties.netlify.app`

### Step 5: Share the Link!
Send your Netlify URL to everyone who should be able to sign up. Anyone with the link can:
- View upcoming dinner parties
- Sign up without creating an account
- See the guest list

---

## Setting Up Email Reminders (Optional)

To enable automated email reminders, you'll need to set up EmailJS:

### Step 1: Create EmailJS Account
1. Go to [emailjs.com](https://emailjs.com)
2. Sign up for free (200 emails/month included)

### Step 2: Add Email Service
1. Go to "Email Services" in the dashboard
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the instructions to connect your email
5. **Save your Service ID** (you'll need this)

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use these template variables:
   ```
   Hello {{guest_name}},

   This is a reminder about the dinner party on {{party_date}}.

   Host: {{host_name}}
   Location: {{location}}

   Looking forward to seeing you!
   ```
4. **Save your Template ID**

### Step 4: Get Your Public Key
1. Go to "Account" → "General"
2. Find your **Public Key**
3. Copy it

### Step 5: Update Your Code
1. Open `app.js` in a text editor
2. Find these lines near the top:
   ```javascript
   const EMAILJS_SERVICE_ID = 'your_service_id';
   const EMAILJS_TEMPLATE_ID = 'your_template_id';
   const EMAILJS_PUBLIC_KEY = 'your_public_key';
   ```
3. Replace with your actual IDs and key
4. Find the commented code around line 94 (the section with `emailjs.send`)
5. Uncomment it by removing the `/*` and `*/`
6. Add this line in the `<head>` section of `index.html`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   ```

### Step 6: Re-deploy
1. Drag your updated files to Netlify again
2. They'll automatically replace the old version
3. Email reminders are now active! ✅

---

## Advanced Deployment (GitHub Method)

If you want version control and easier updates:

### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Create a new repository (can be private or public)
3. Upload your 3 files to the repository

### Step 2: Connect to Netlify
1. In Netlify, click "Add new site" → "Import an existing project"
2. Choose GitHub
3. Select your repository
4. Click "Deploy site"

### Benefits:
- Every time you push changes to GitHub, Netlify auto-deploys
- Version history of all changes
- Easier collaboration if multiple people manage the site

---

## Important Notes

### Data Storage
- All dinner party data is stored in each user's browser (localStorage)
- This means different people might see different data unless they're on the same device
- For a shared database that everyone sees, you'd need a backend service (more complex)

### Browser Compatibility
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript to be enabled
- Mobile-friendly design

### Privacy
- No user accounts required
- Email addresses are only stored locally in the browser
- For GDPR compliance, add a privacy notice if collecting emails

---

## Troubleshooting

**Problem: Site shows blank page**
- Check browser console for errors (F12 → Console)
- Make sure all 3 files are uploaded
- Clear browser cache and refresh

**Problem: Changes not showing**
- Netlify can take 1-2 minutes to deploy
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

**Problem: Emails not sending**
- Verify EmailJS credentials are correct
- Check the browser console for error messages
- Make sure the code is uncommented
- Test from EmailJS dashboard first

**Problem: Data not persisting**
- Check if browser is in private/incognito mode
- Ensure cookies/localStorage aren't blocked
- Different devices will have different data

---

## Need Help?

- Netlify docs: [docs.netlify.com](https://docs.netlify.com)
- EmailJS docs: [emailjs.com/docs](https://www.emailjs.com/docs/)
- React docs: [react.dev](https://react.dev)

Enjoy your dinner parties! 🍽️
