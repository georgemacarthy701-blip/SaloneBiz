# 🪟 SaloneBiz - Windows 11 Complete Setup Guide

## Professional Setup for Your Friend's Machine

This guide is specifically for **Windows 11** with **VS Code** and **Node.js**.

---

## Prerequisites Check

Before starting, verify you have:

- ✅ **Windows 11** (Home, Pro, or Enterprise)
- ✅ **VS Code** (Download from https://code.visualstudio.com)
- ✅ **Git** (Download from https://git-scm.com)
- ✅ **Node.js v18+** (Download from https://nodejs.org - LTS version recommended)

---

## Step 1: Install Required Software

### 1.1 Install Node.js on Windows 11

1. Go to https://nodejs.org
2. Click **"Download LTS"** (Long-Term Support)
3. Run the `.msi` installer
4. Follow the installation wizard:
   - Accept the license agreement
   - Choose install location (default is fine)
   - Keep "npm package manager" checked
   - Click "Install" 
5. Click "Finish"

**Verify Installation:**
- Open PowerShell (press `Win + X`, then `I`)
- Type: `node --version`
- You should see: `v18.x.x` or higher
- Type: `npm --version`
- You should see: `9.x.x` or higher

### 1.2 Install Git on Windows 11

1. Go to https://git-scm.com
2. Click "Download for Windows"
3. Run the `.exe` installer
4. Follow the setup wizard:
   - Accept license
   - Choose installation folder
   - Select components (use defaults)
   - Choose default editor for Git (VS Code is good)
   - Click "Install"

**Verify Installation:**
- Open PowerShell
- Type: `git --version`
- You should see: `git version x.x.x`

### 1.3 Install/Update VS Code

1. Go to https://code.visualstudio.com
2. Click the Windows download button
3. Run the installer
4. Follow the setup wizard
5. Check "Add to PATH" during installation

---

## Step 2: Download SaloneBiz Project

### Option A: Using Git (Recommended)

1. Open PowerShell
2. Navigate to where you want the project:
   ```powershell
   cd C:\Users\YourUsername\Documents
   ```
3. Clone the project:
   ```powershell
   git clone https://github.com/your-username/sierra-business-directory-clean.git
   cd sierra-business-directory-clean
   ```

### Option B: Manual Download

1. Get the project files (ZIP from GitHub)
2. Extract to: `C:\Users\YourUsername\Documents\sierra-business-directory-clean`

---

## Step 3: Open Project in VS Code

1. Open VS Code
2. Press `Ctrl + K` then `Ctrl + O`
3. Navigate to: `C:\Users\YourUsername\Documents\sierra-business-directory-clean`
4. Click "Select Folder"
5. Trust the project when prompted

---

## Step 4: Install Dependencies

1. In VS Code, press `Ctrl + `` (backtick) to open Terminal
2. You should see PowerShell prompt: `PS C:\...\sierra-business-directory-clean>`
3. Run:
   ```powershell
   npm install
   ```
4. Wait for installation to complete (2-3 minutes)
5. You should see "added X packages"

---

## Step 5: Configure Environment Variables

1. In VS Code, in the file explorer on the left
2. Look for `.env.local` file (if you don't see it, press `Ctrl + Shift + P`, type "Show Hidden Files", press Enter)
3. Open `.env.local`
4. You'll see placeholder values like:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
   ```

### Getting Your Credentials:

**For Supabase:**
1. Go to https://supabase.com/dashboard
2. Click on your project
3. Go to Settings → API
4. Copy the URL and Anon Key
5. Replace the placeholders in `.env.local`

**For Cloudinary:**
1. Go to https://cloudinary.com/console
2. Copy your Cloud Name
3. Replace in `.env.local`

---

## Step 6: Update Database Schema

This is CRITICAL - do this in Supabase console:

1. Go to https://supabase.com/dashboard
2. Click your project
3. Go to SQL Editor (left sidebar)
4. Click "New Query"
5. Copy the content from:
   ```
   supabase/update_schema.sql
   ```
   (in VS Code, open that file and copy all)
6. Paste into Supabase SQL Editor
7. Click "Run"
8. Wait for success message ✅

---

## Step 7: Start Development Server

1. In VS Code terminal, make sure you're in the project directory:
   ```powershell
   C:\...\sierra-business-directory-clean>
   ```

2. Start the development server:
   ```powershell
   npm run dev
   ```

3. You'll see output like:
   ```
   > next dev
   - ready started server on 0.0.0.0:3000, url: http://localhost:3000
   ```

4. Open your browser and go to: `http://localhost:3000`

---

## Step 8: Create Admin Account

1. In Supabase console, go to SQL Editor
2. Run this query:
   ```sql
   UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```
3. Replace `your-email@example.com` with your actual email

---

## Step 9: Test Everything

1. Go to `http://localhost:3000` in your browser
2. Click "Sign Up"
3. Create an account
4. Go to `http://localhost:3000/admin-login`
5. Sign in with your credentials
6. You should see the Admin Dashboard

---

## Common Issues & Solutions

### Issue 1: "npm: The term 'npm' is not recognized"

**Solution:**
- Node.js wasn't installed correctly
- Restart your computer
- Reinstall Node.js from https://nodejs.org
- Use the LTS version

### Issue 2: "Port 3000 already in use"

**Solution:**
- Another app is using port 3000
- In VS Code terminal, press `Ctrl + C` to stop the server
- Then restart: `npm run dev`
- Or change port: `npm run dev -- -p 3001`

### Issue 3: "ENOTFOUND: getaddrinfo ENOTFOUND localhost"

**Solution:**
- Check your internet connection
- Verify Supabase credentials in `.env.local`
- Make sure you've run the update_schema.sql

### Issue 4: "Database not connected" error

**Solution:**
1. Go to `.env.local`
2. Verify all values are correct (no spaces, exact copy)
3. Save the file (`Ctrl + S`)
4. Restart dev server (`Ctrl + C`, then `npm run dev`)

### Issue 5: "Access Error: infinite recursion"

**Solution:**
1. Go to Supabase SQL Editor
2. Run the RLS policy fix SQL above
3. Refresh your browser

### Issue 6: Can't see files/folders in VS Code

**Solution:**
- Press `Ctrl + Shift + P`
- Type "Files: Exclude"
- Find `.env.local` and remove it from exclude list
- Or press `Ctrl + B` to toggle file explorer

---

## File Structure You'll See

```
sierra-business-directory-clean/
├── app/                          # Main application pages
│   ├── page.tsx                  # Homepage
│   ├── login/page.tsx            # User login
│   ├── register/page.tsx         # User registration
│   ├── admin-login/page.tsx      # Admin login (SEPARATE!)
│   ├── admin-dashboard/page.tsx  # Admin user management
│   ├── admin/page.tsx            # Admin business verification
│   ├── add-business/page.tsx     # Create business listing
│   ├── listings/page.tsx         # View all businesses
│   └── dashboard/page.tsx        # User dashboard
│
├── components/                   # Reusable components
│   ├── Navbar.tsx               # Navigation bar
│   ├── AuthForm.tsx             # Login/Register form
│   ├── BusinessCard.tsx         # Business listing card
│   └── MediaUpload.tsx          # Image/video upload
│
├── lib/                         # Utilities
│   ├── supabase.ts              # Database connection
│   └── api.ts                   # API functions
│
├── supabase/                    # Database schemas
│   ├── schema.sql               # Initial schema
│   └── update_schema.sql        # Schema updates
│
├── .env.local                   # Your API keys (SECRET!)
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies
└── README.md                   # Documentation
```

---

## Key URLs to Remember

| Purpose | URL |
|---------|-----|
| Homepage | http://localhost:3000 |
| User Login | http://localhost:3000/login |
| User Register | http://localhost:3000/register |
| **Admin Login** | http://localhost:3000/admin-login |
| **Admin Dashboard** | http://localhost:3000/admin-dashboard |
| **Business Verification** | http://localhost:3000/admin |
| View Businesses | http://localhost:3000/listings |
| User Dashboard | http://localhost:3000/dashboard |
| Add Service | http://localhost:3000/add-business |

---

## Development Workflow

### Daily Development

1. Open PowerShell
2. Navigate to project: `cd C:\...\sierra-business-directory-clean`
3. Start server: `npm run dev`
4. Make code changes in VS Code
5. Changes auto-reload in browser
6. When done, press `Ctrl + C` to stop server

### Installing New Packages

If you need to add a package:
```powershell
npm install package-name
```

### Checking for Updates

```powershell
npm outdated
npm update
```

---

## Database Management (Supabase)

### Viewing Data
1. Go to https://supabase.com/dashboard
2. Click your project
3. Go to "Table Editor" (left sidebar)
4. Select table to view data

### Running SQL Queries
1. Go to "SQL Editor"
2. Click "New Query"
3. Write your SQL
4. Click "Run"

### Backup Your Data
1. In Supabase, go to Database
2. Click "Backups"
3. Click "Create Backup"

---

## Performance Tips

### Make Your Dev Server Faster
1. Use Turbopack (included by default)
2. Close unused browser tabs
3. Have at least 4GB RAM available
4. Use SSD instead of HDD

### Clear Cache When Needed
```powershell
npm run build
npm run dev
```

---

## Security Reminders

⚠️ **NEVER:**
- Share `.env.local` file
- Commit `.env.local` to Git
- Post your API keys online
- Use the same password for multiple accounts

✅ **DO:**
- Keep `.env.local` private (it's in `.gitignore`)
- Use strong, unique admin password
- Rotate API keys periodically
- Monitor your Supabase usage

---

## Getting Help

### Common Resources
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Cloudinary Docs: https://cloudinary.com/documentation
- Node.js Help: https://nodejs.org/en/docs/

### Troubleshooting Commands

**Check Node/NPM versions:**
```powershell
node --version
npm --version
```

**Check if port 3000 is available:**
```powershell
netstat -ano | findstr :3000
```

**Clear npm cache:**
```powershell
npm cache clean --force
```

**Reinstall all dependencies:**
```powershell
rm -r node_modules
npm install
```

---

## Next Steps After Setup

1. ✅ Create regular user account
2. ✅ Test user registration/login
3. ✅ Create admin account
4. ✅ Test admin login
5. ✅ Test creating a business
6. ✅ Approve business as admin
7. ✅ View on marketplace
8. ✅ Customize for your needs

---

## Production Deployment (Future)

When ready to go live:
1. Push code to GitHub
2. Deploy on Vercel (free tier available)
3. Set up custom domain
4. Configure production database
5. Set up monitoring

---

## Version Information

- **Next.js:** 16.2.9
- **Node.js:** 18.x or higher
- **npm:** 9.x or higher
- **React:** 19.2.4
- **TypeScript:** Latest

---

## Support

**For Windows-specific issues:**
- Check Windows 11 is fully updated
- Run disk cleanup monthly
- Keep antivirus updated but exclude node_modules folder

**For development issues:**
- Check VS Code has latest extensions
- Make sure .env.local is configured correctly
- Verify Supabase project is active

---

**You're all set! Happy development! 🚀**

If anything doesn't work, check this guide first - most issues are covered above.
