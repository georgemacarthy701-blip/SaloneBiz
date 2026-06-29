# 🚀 SaloneBiz - Professional Business Directory

Enterprise-grade business directory platform built with Next.js, Supabase, and Cloudinary.

## Quick Start (2 Minutes)

### 1. Open .env.local File
```bash
# Use VS Code
code /Users/SkiaDev/Documents/sierra-business-directory-clean/.env.local
```

### 2. Add Your API Keys
See `ADD_API_KEYS.md` for detailed instructions.

**Get from Supabase:**
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

**Get from Cloudinary:**
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

### 3. Start the App
```bash
npm run dev
# Opens http://localhost:3000
```

## Key Features

✅ **Professional Service Directory** - List and discover services  
✅ **Image & Video Upload** - Cloudinary integration  
✅ **Advanced Search** - Find services by category, location, price  
✅ **Client Reviews** - 5-star rating system with verified reviews  
✅ **Authentication** - Secure Supabase auth  
✅ **Service Dashboard** - Manage your listings  
✅ **Responsive Design** - Works on all devices  
✅ **Enterprise Grade** - Production-ready code  

## Project Structure

```
sierra-business-directory-clean/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Login/Register pages
│   ├── business/[id]/            # Service detail page
│   ├── listings/                 # Browse marketplace
│   ├── dashboard/                # User dashboard
│   ├── add-business/             # Create service
│   └── page.tsx                  # Homepage
├── components/                   # Reusable components
│   ├── Navbar.tsx                # Navigation
│   ├── AuthForm.tsx              # Login/Register form
│   ├── BusinessCard.tsx           # Service card
│   └── MediaUpload.tsx            # Image/Video upload
├── lib/                          # Utilities
│   ├── supabase.ts               # Supabase client
│   └── api.ts                    # Database queries
├── types/                        # TypeScript types
├── public/                       # Static assets
├── supabase/                     # Database schema
└── .env.local                    # Your API keys (⚠️ keep secret)
```

## Getting Help

📖 **Setup Help:** See `SETUP_GUIDE.md`  
🔑 **API Keys:** See `ADD_API_KEYS.md`  
✨ **Features:** See `FEATURES.md`  
⚡ **Quick Start:** See `QUICK_START.md`  

## Integrated Features

All features from your friend's original code have been integrated:
- ✅ Categories with service counts
- ✅ Business search and filtering
- ✅ Service galleries
- ✅ Pricing ranges with custom info
- ✅ Featured services
- ✅ Client testimonials
- ✅ Statistics dashboard
- ✅ Professional UI/UX

**Plus new enterprise features:**
- ✅ Video upload support
- ✅ Cloudinary media management
- ✅ Advanced security (RLS)
- ✅ TypeScript for type safety
- ✅ Modern React patterns
- ✅ Responsive mobile design

## Production Checklist

Before deploying to production:

- [ ] Test all authentication flows
- [ ] Upload images and videos
- [ ] Test search and filters
- [ ] Leave reviews and ratings
- [ ] Verify Supabase backups are enabled
- [ ] Set up custom domain
- [ ] Configure email notifications
- [ ] Deploy to Vercel

## Security

✅ No secrets exposed (all in .env.local)  
✅ Row Level Security enabled in Supabase  
✅ Unsigned Cloudinary uploads (API secret protected)  
✅ TypeScript for type safety  
✅ Input validation on all forms  

⚠️ **Never commit .env.local to git** — it's in .gitignore

## Support & Documentation

| Topic | File |
|-------|------|
| 📖 Setup Guide | `SETUP_GUIDE.md` |
| 🔑 API Keys | `ADD_API_KEYS.md` |
| ⚡ Quick Start | `QUICK_START.md` |
| ✨ All Features | `FEATURES.md` |
| 🏗️ Architecture | `README.md` |

## Technology Stack

- **Framework:** Next.js 16.2.9
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Media:** Cloudinary
- **UI:** Tailwind CSS + React 19
- **Deployment:** Vercel (recommended)

## Next Steps

1. ✅ Add API keys to .env.local
2. ✅ Test all features
3. ✅ Customize branding
4. ✅ Deploy to Vercel
5. ✅ Set up domain
6. ✅ Configure email notifications

## License

MIT - Feel free to use this for your project

---

**Version:** 1.0.0  
**Status:** 🟢 Production Ready  
**Built with:** Next.js + TypeScript + Supabase + Cloudinary  

**Ready to launch? Start here:** `QUICK_START.md`
