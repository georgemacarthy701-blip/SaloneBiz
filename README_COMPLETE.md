# 🎯 SaloneBiz - Professional Business Directory Platform

**A complete, production-ready marketplace for service providers in Sierra Leone and beyond.**

---

## 📋 Quick Overview

SaloneBiz is an enterprise-grade business directory platform built with:

- **Next.js 16** - Modern React framework
- **TypeScript** - Type-safe development
- **Supabase** - Secure database with authentication
- **Cloudinary** - Professional media management
- **Tailwind CSS** - Professional design system

**Perfect for:** Service marketplaces, business directories, professional networks.

---

## 🚀 Getting Started (Quick Path)

### For Windows 11 Users (Recommended)
👉 **[Read WINDOWS_SETUP_GUIDE.md](./WINDOWS_SETUP_GUIDE.md)** - Step-by-step Windows 11 setup

### For macOS/Linux Users
1. Install Node.js v18+ from https://nodejs.org
2. `git clone <repository>`
3. `cd sierra-business-directory-clean`
4. `npm install`
5. Create `.env.local` (see below)
6. `npm run dev`
7. Visit http://localhost:3000

---

## 🔐 Environment Setup

### Create `.env.local` File

In the root directory, create a file named `.env.local`:

```env
# SUPABASE (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# CLOUDINARY (Images & Videos)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Getting Credentials

**Supabase:**
1. Create account: https://supabase.com
2. Create new project
3. Settings → API → Copy URL and Anon Key

**Cloudinary:**
1. Create account: https://cloudinary.com
2. Dashboard → Copy Cloud Name
3. Settings → Upload → Create unsigned preset
4. Settings → API Keys → Copy API Key & Secret

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────┐
│         SaloneBiz Application               │
└─────────────────────────────────────────────┘
         │         │         │
    ┌────┴────┬────┴────┬────┴─────┐
    │          │          │         │
┌───▼──┐  ┌───▼──┐  ┌───▼──┐  ┌──▼───┐
│Users │  │Admin │  │Biz.  │  │Media │
└──────┘  └──────┘  └──────┘  └──────┘
    │          │        │         │
    └──────────┼────────┼────────┘
              │        │
          ┌───▼────────▼──┐
          │   Supabase    │
          │   PostgreSQL  │
          └───────────────┘
```

---

## 🎯 Core Features

### User Features
- ✅ Professional registration/login
- ✅ Personal dashboard
- ✅ Create service listings
- ✅ Upload images & videos (Cloudinary)
- ✅ Manage business profile
- ✅ Receive customer reviews

### Admin Features
- ✅ **Separate Admin Login** (`/admin-login`)
- ✅ **User Management Dashboard** (`/admin-dashboard`)
  - View all users
  - Approve/reject user registrations
  - Monitor system health
- ✅ **Business Verification** (`/admin`)
  - Review pending businesses
  - Approve/reject listings
  - Manage marketplace quality

### Marketplace Features
- ✅ Browse all businesses
- ✅ Advanced search & filtering
- ✅ Category browsing
- ✅ Star ratings & reviews
- ✅ Pricing information
- ✅ Contact information
- ✅ Operating hours display

---

## 📖 Documentation

### Setup & Installation
- [WINDOWS_SETUP_GUIDE.md](./WINDOWS_SETUP_GUIDE.md) - Windows 11 complete guide
- [ADMIN_PORTAL_GUIDE.md](./ADMIN_PORTAL_GUIDE.md) - Admin system documentation
- [ADMIN_SETUP.md](./ADMIN_SETUP.md) - Business verification setup
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - General setup instructions

### Design & Standards
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Professional design standards
- [FEATURES.md](./FEATURES.md) - Complete feature list
- [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) - Testing checklist

### API & Database
- [supabase/schema.sql](./supabase/schema.sql) - Database structure
- [supabase/update_schema.sql](./supabase/update_schema.sql) - Schema updates
- [lib/api.ts](./lib/api.ts) - API functions

---

## 🛠️ Development

### Project Structure

```
sierra-business-directory-clean/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth routes
│   │   ├── login/
│   │   └── register/
│   ├── admin-login/                  # Admin-only login
│   ├── admin-dashboard/              # User management
│   ├── admin/                        # Business verification
│   ├── add-business/                 # Create listings
│   ├── listings/                     # Browse marketplace
│   ├── business/[id]/                # Business details
│   └── dashboard/                    # User dashboard
│
├── components/                       # Reusable components
│   ├── Navbar.tsx
│   ├── AuthForm.tsx
│   ├── BusinessCard.tsx
│   └── MediaUpload.tsx
│
├── lib/                             # Utilities
│   ├── supabase.ts                  # DB client
│   └── api.ts                       # API functions
│
├── types/                           # TypeScript types
├── supabase/                        # Database schemas
├── public/                          # Static files
└── styles/                          # Global styles
```

### Key Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Production
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript check

# Database
# See supabase/update_schema.sql for SQL updates
```

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase auth key | Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary account | Yes |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload config | Yes |
| `CLOUDINARY_API_KEY` | API authentication | Yes |
| `CLOUDINARY_API_SECRET` | API authentication | Yes |

---

## 👥 Admin System (Two-Tier)

### Admin Login
- **URL:** `http://localhost:3000/admin-login`
- **Purpose:** Separate, secure authentication for admins only
- **Design:** Professional dark theme with purple accents

### Admin Dashboard
- **URL:** `http://localhost:3000/admin-dashboard`
- **Purpose:** User management and system monitoring
- **Features:**
  - View all users with verification status
  - Approve/reject user registrations
  - Real-time statistics
  - Professional user review modal

### Business Verification
- **URL:** `http://localhost:3000/admin`
- **Purpose:** Manage business listings
- **Features:**
  - Review pending businesses
  - Approve/reject with feedback
  - Monitor marketplace quality

---

## 🔒 Security Features

✅ **Authentication**
- Supabase Auth with email/password
- Session management
- Role-based access control (admin/user)

✅ **Database**
- Row-Level Security (RLS) policies
- User data isolation
- Encrypted connections

✅ **Media**
- Cloudinary unsigned uploads (no keys exposed)
- Image optimization
- CDN delivery

✅ **Secrets**
- API keys in `.env.local` (not committed)
- Never exposed to frontend
- Environment-based configuration

---

## 🚀 Deployment

### For Production (Vercel Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import repository
4. Set environment variables
5. Deploy

### Environment Variables (Production)
- Same as local `.env.local`
- Set in Vercel dashboard
- Auto-deployed to live site

### Database (Production)
- Use Supabase hosting
- Configure backups
- Enable monitoring

---

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tablet optimized (iPad, etc.)
- ✅ Desktop fully featured
- ✅ Touch-friendly (44px+ targets)
- ✅ Fast on slow networks

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 🎨 Professional Design Standards

### Color Palette
- **Primary:** Blue (#1e3a8a, #2563eb)
- **Success:** Green (#16a34a)
- **Warning:** Amber (#d97706)
- **Error:** Red (#dc2626)
- **Admin:** Purple (#7c3aed)

### Typography
- Sans-serif system fonts
- Clear hierarchy (32px → 12px)
- Professional appearance

### Spacing
- 8px base unit
- Consistent gaps and padding
- Responsive adjustments

---

## 🌍 Market Context

### Sierra Leone Optimized
- ✅ Currency: Le (Leone)
- ✅ Phone format: +232
- ✅ Professional English
- ✅ Trust-building features
- ✅ Accessible to local internet speeds

### International Standards
- ✅ Modern design patterns
- ✅ Enterprise UX
- ✅ Accessibility (WCAG AA)
- ✅ Performance optimized
- ✅ Security best practices

---

## 🐛 Troubleshooting

### Common Issues

**"Port 3000 already in use"**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

**"Module not found"**
```bash
rm -r node_modules
npm install
```

**"Database not connected"**
- Check `.env.local` values
- Verify Supabase project is active
- Ensure internet connection

**"Image won't upload"**
- Check Cloudinary credentials
- Verify upload preset exists
- Check file size limits

### More Help

- See [WINDOWS_SETUP_GUIDE.md](./WINDOWS_SETUP_GUIDE.md) for detailed troubleshooting
- Check [ADMIN_PORTAL_GUIDE.md](./ADMIN_PORTAL_GUIDE.md) for admin issues
- Review [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for design questions

---

## 📊 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js | 16.2.9 |
| **Language** | TypeScript | Latest |
| **Runtime** | Node.js | 18+ |
| **React** | React | 19.2.4 |
| **Database** | Supabase | Latest |
| **Auth** | Supabase Auth | Latest |
| **Storage** | Cloudinary | Latest |
| **Styling** | Tailwind CSS | Latest |

---

## 📈 Performance

- ✅ Optimized images (Cloudinary)
- ✅ Fast builds (Turbopack)
- ✅ Code splitting
- ✅ Database indexing
- ✅ CDN delivery
- ✅ Caching strategies

### Core Web Vitals
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

---

## 📝 License

MIT License - See LICENSE file

---

## 🤝 Contributing

To contribute:

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Create pull request

---

## 📞 Support

### Documentation
- Start with [WINDOWS_SETUP_GUIDE.md](./WINDOWS_SETUP_GUIDE.md)
- Check relevant documentation file
- Search troubleshooting section

### Resources
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Cloudinary: https://cloudinary.com/documentation
- Node.js: https://nodejs.org/en/docs/

---

## 🎯 What's Next?

1. ✅ Complete setup (see guides)
2. ✅ Create test accounts
3. ✅ Test all features
4. ✅ Customize branding
5. ✅ Deploy to production
6. ✅ Monitor and iterate

---

## 📊 Project Status

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** June 2026  
**Maintenance:** Active  

---

**Ready to launch? Start with the [WINDOWS_SETUP_GUIDE.md](./WINDOWS_SETUP_GUIDE.md)!** 🚀

---

### File Overview

| File | Purpose |
|------|---------|
| `README_COMPLETE.md` | This file - Overview & quick start |
| `WINDOWS_SETUP_GUIDE.md` | **START HERE for Windows 11** |
| `ADMIN_PORTAL_GUIDE.md` | Admin system documentation |
| `DESIGN_SYSTEM.md` | Design standards & guidelines |
| `FEATURES.md` | Complete feature list |
| `IMPLEMENTATION_CHECKLIST.md` | Testing & verification checklist |
| `SETUP_GUIDE.md` | Initial setup instructions |
| `.env.local` | Your API credentials (SECRET!) |

**Most people should start with:** `WINDOWS_SETUP_GUIDE.md`
