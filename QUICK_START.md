# SaloneBiz Quick Start (5 Minutes)

## Prerequisites

```bash
# Node.js 18+ required
node --version

# Install dependencies
npm install
```

## 1️⃣ Supabase Setup (2 minutes)

```bash
# 1. Go to https://supabase.com → New Project
# 2. Copy these values from Settings → API:
#    - Project URL
#    - Anon Key
#
# 3. Run schema.sql in SQL Editor (supabase/schema.sql)
```

## 2️⃣ Cloudinary Setup (2 minutes)

```bash
# 1. Go to https://cloudinary.com → Dashboard
# 2. Copy Cloud Name
# 3. Go to Settings → Upload → Add Upload Preset
#    - Name: salonebiz_uploads
#    - Toggle: Unsigned ON
#    - Click: Save
# 4. Go to Settings → API Keys
#    - Copy: API Key and API Secret
```

## 3️⃣ Configure .env.local (1 minute)

Create file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=salonebiz_uploads
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

## 4️⃣ Run App

```bash
npm run dev
# Opens: http://localhost:3000
```

## 5️⃣ Test

- ✅ Register account
- ✅ Upload service with images/videos
- ✅ View marketplace
- ✅ Browse services

---

**Done!** 🎉

See `SETUP_GUIDE.md` for detailed instructions.
