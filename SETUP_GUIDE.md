# SaloneBiz Setup Guide

Complete guide to configure SaloneBiz with Supabase and Cloudinary.

## Prerequisites

- Node.js 18+ installed
- Git installed
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Supabase Configuration (Database & Authentication)

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Enter project name (e.g., "SaloneBiz")
4. Create a strong password
5. Select your region
6. Click **"Create new project"** and wait for initialization

### Get Your Credentials

1. Go to **Settings → API** in your Supabase project
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Set Up Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Open the file: `supabase/schema.sql`
3. Copy all content and paste into Supabase SQL Editor
4. Click **Run** button
5. Tables and Row Level Security (RLS) policies are now created ✓

## Step 3: Cloudinary Configuration (Images & Videos)

### Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a **Free account**
3. Complete email verification

### Get Cloud Name

1. Go to **Dashboard**
2. Copy your **Cloud Name** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

### Create Upload Preset (Unsigned)

Unsigned presets allow frontend uploads without exposing API secrets.

1. Go to **Settings → Upload**
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Configuration:
   - **Name:** `salonebiz_uploads`
   - **Unsigned:** Toggle ON (blue)
   - **Resource types:** All
   - **Auto format:** Yes
   - **Auto optimize:** Yes
5. Click **Save**
6. Copy the preset name → `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

### Get API Keys (For Server-Side Only)

1. Go to **Settings → API Keys**
2. Copy these values:
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

> ⚠️ **Never expose API Secret to frontend**

## Step 4: Configure Environment Variables

1. In project root, find or create `.env.local`
2. Add all values from above:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=salonebiz_uploads
CLOUDINARY_API_KEY=xxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxx
```

## Step 5: Run Application

```bash
npm run dev
```

App will start at `http://localhost:3000`

## Step 6: Test Features

### 1. **Homepage**
- Open `http://localhost:3000`
- See SaloneBiz branding and features

### 2. **Register Account**
- Click **"Get Started"** or **"Sign Up"**
- Enter email and password
- Account is created in Supabase ✓

### 3. **List a Service**
- Log in with your account
- Go to **Dashboard → Create Your First Service Profile**
- Upload images and videos using Cloudinary widget
- Submit form

### 4. **Browse Services**
- Go to **Marketplace**
- See all listed services with images/videos
- Click service card for details

## Troubleshooting

### "Database not connected" message

**Solution:** Verify in `.env.local`:
```bash
# Check these values exist and are correct
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Then restart server:
```bash
# Kill current process (Ctrl+C)
npm run dev
```

### Upload widget not appearing

**Solution:** Check Cloudinary configuration:
```bash
# Verify these are set in .env.local
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=salonebiz_uploads
```

### Images not loading

**Solution:** Ensure Cloudinary domain is in `next.config.ts`:
- File already has `res.cloudinary.com` configured ✓

### Verification Issues

**For Supabase email verification:**
1. Check spam folder for email
2. Or go to Supabase Dashboard → Authentication → Users
3. Click user and **"Confirm Identity"** manually

## Security Checklist

- ✓ Never commit `.env.local` to git
- ✓ `.env.local` is in `.gitignore`
- ✓ API Secret keys never prefixed with `NEXT_PUBLIC_`
- ✓ Rotate API keys monthly
- ✓ Use Row Level Security (RLS) in Supabase for data protection
- ✓ Set Cloudinary upload preset to "Unsigned" only

## Next Steps

1. Customize branding colors in Tailwind CSS
2. Add more service categories if needed
3. Set up email notifications (Supabase Emails)
4. Configure custom domain
5. Deploy to Vercel: `vercel deploy`

## Support

For issues:
- **Supabase:** https://supabase.com/docs
- **Cloudinary:** https://cloudinary.com/documentation
- **Next.js:** https://nextjs.org/docs

---

**SaloneBiz is now ready for production!** 🚀
