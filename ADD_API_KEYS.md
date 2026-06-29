# 🔑 How to Add Your API Keys to SaloneBiz

## Location of .env.local File

The `.env.local` file is located at:
```
/Users/SkiaDev/Documents/sierra-business-directory-clean/.env.local
```

**This file is hidden in VS Code by default. To view it:**
1. Open VS Code
2. Press `Cmd + Shift + P`
3. Type "Files: Exclude"
4. Find `.env.local` in the exclude list and remove it
5. Or use terminal: `code /Users/SkiaDev/Documents/sierra-business-directory-clean/.env.local`

---

## Step-by-Step: Add Your API Keys

### 1️⃣ Get Supabase Credentials

```
1. Go to https://supabase.com/dashboard
2. Click on your project
3. Go to Settings → API
4. Copy these exact values:
```

In `.env.local`, replace:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```
With your actual Project URL (looks like: `https://abcdefg.supabase.co`)

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
With your actual Anon Key (long string starting with `eyJ`)

### 2️⃣ Get Cloudinary Credentials

```
1. Go to https://cloudinary.com/console
2. In the Dashboard, copy your Cloud Name
```

In `.env.local`, replace:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```
With your actual Cloud Name (usually one word like `abc123def`)

```
3. Go to Settings → Upload
4. Scroll to "Upload presets"
5. Click "Add upload preset"
   - Name: salonebiz_uploads
   - Unsigned: Toggle ON (blue)
   - Save
6. Copy the preset name
```

In `.env.local`, replace:
```env
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```
With your preset name (`salonebiz_uploads`)

```
7. Go back to Settings → API Keys
8. Copy your API Key and API Secret
```

In `.env.local`, replace:
```env
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
With your actual keys

---

## Complete .env.local Example

After adding all keys, your file should look like:

```env
# ============================================================================
# SALONEBIZ ENVIRONMENT CONFIGURATION
# ============================================================================

# ===== SUPABASE CONFIGURATION (Database & Auth) =====
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===== CLOUDINARY CONFIGURATION (Images & Videos) =====
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=mycloud123
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=salonebiz_uploads
CLOUDINARY_API_KEY=123456789abcdef
CLOUDINARY_API_SECRET=abcdef123456789xyz

# ============================================================================
# ⚠️  SECURITY: Never commit this file to git. It's in .gitignore already.
# ============================================================================
```

---

## Verify Everything Works

After adding your keys:

```bash
# 1. Restart the development server
Ctrl + C  (to stop current server)
npm run dev

# 2. Open http://localhost:3000

# 3. Test features:
✅ Homepage loads (no errors)
✅ Register account → Check Supabase works
✅ Upload images/videos → Check Cloudinary works
✅ Browse marketplace → See pricing and data
```

---

## Troubleshooting

### "Database not connected" message
→ Check Supabase URL and Anon Key are correct (no spaces, exact copy)

### Upload widget not showing
→ Check Cloudinary Cloud Name and Upload Preset are correct

### Images not loading
→ Cloudinary domain is already whitelisted in `next.config.ts` ✓

### Environment variables not updating
→ Restart dev server: `Ctrl + C` then `npm run dev`

---

## Security Reminders

✅ **Safe to expose (NEXT_PUBLIC_):**
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

❌ **KEEP SECRET (Never expose):**
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- Database passwords
- Admin tokens

**Never commit `.env.local` to git** — it's already in `.gitignore` ✓

---

## Next Steps

Once everything is working:
1. Customize brand colors in Tailwind CSS
2. Add your own business categories
3. Deploy to Vercel: https://vercel.com
4. Set up custom domain

🎉 **SaloneBiz is ready!**
