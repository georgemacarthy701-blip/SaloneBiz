# 🛡️ SaloneBiz Admin Dashboard Setup Guide

## Professional Admin System for Business Verification

This guide sets up the complete admin dashboard for verifying and managing business listings on SaloneBiz - a professional marketplace for Sierra Leone's service industry.

---

## Step 1: Deploy Database Schema Updates

The admin system requires additional database columns for verification tracking.

**Action Required:**
1. Go to your Supabase project: https://supabase.com/dashboard/project/xtudqbkrudebnhdkpcbh/sql
2. Click "New Query"
3. Copy and paste the entire content of `supabase/update_schema.sql`
4. Click "Run"
5. Wait for success ✅

**What this does:**
- Adds `verification_status` (pending/approved/rejected)
- Adds `admin_notes` for rejection feedback
- Adds verification tracking fields
- Updates RLS policies for business visibility
- Creates indexes for performance

---

## Step 2: Create Your Admin Account

**In Supabase Console:**

1. Go to Authentication → Users
2. Create a new user with your email
3. Then go to SQL Editor and run:

```sql
UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

## Step 3: Access Admin Dashboard

**Once setup is complete:**

1. Sign in at: http://localhost:3000/login
2. Navigate to: http://localhost:3000/admin
3. You should see:
   - 📊 Statistics cards (Pending, Approved, Rejected, Total)
   - 📋 Business listing table with filters
   - ✓ Review & Approval interface

---

## Admin Dashboard Features

### 1. **Dashboard Overview**
- Real-time statistics of business status
- Quick metrics for performance tracking

### 2. **Business Review & Verification**
- View all pending businesses
- Review business details and cover images
- Make approval or rejection decisions
- Leave detailed feedback for business owners

### 3. **Filters & Search**
- Filter by: All, Pending, Approved, Rejected
- Quick status overview with counts
- Table view with sortable columns

### 4. **Verification Actions**

**Approve Business:**
- Business becomes visible on marketplace immediately
- Owner receives confirmation
- Status becomes "approved" and "active"

**Reject Business:**
- Admin must provide feedback notes
- Owner can resubmit after addressing concerns
- Status becomes "rejected" (not visible publicly)

---

## Business Visibility Rules

### Public Marketplace
- ✅ Only **APPROVED** businesses are visible
- ❌ Pending businesses are hidden from public
- ❌ Rejected businesses are hidden

### Business Owner Dashboard
- ✓ Can see their own listings regardless of status
- ✓ Can see rejection notes and resubmit
- ✓ Notified when status changes

### Admin Dashboard
- ✓ Can see ALL businesses (pending, approved, rejected)
- ✓ Full control over verification status

---

## Verification Workflow

```
Business Created (Pending)
         ↓
    Admin Reviews
         ↓
    ┌─────────────┐
    │             │
    ↓             ↓
 APPROVED     REJECTED
 (Visible)   (Not Visible)
             + Feedback
             ↓
        Owner Resubmits
```

---

## Best Practices for Admin Review

### Approval Criteria ✓
- Business name clearly stated
- Professional cover image uploaded
- Valid contact information
- Category appropriate
- Description is detailed and professional
- Operating hours specified

### Rejection Reasons ❌
- No cover image or placeholder used
- Inappropriate business content
- Incomplete information
- Duplicate business listing
- Non-professional presentation
- Contact details invalid

### Feedback Guidelines
When rejecting, always provide:
- **Specific issue** - What needs to be fixed
- **Example** - How it should look
- **Support** - Direct to resources/help

Example:
```
"Professional cover image required. Please upload a clear photo 
of your business location or service. Minimum 400x300 pixels. 
Avoid low-quality or blurry images. Resubmit when ready."
```

---

## Security & Data Protection

### Admin Permissions
- ✅ View all businesses
- ✅ Approve/reject listings
- ✅ Add verification notes
- ✅ See business contact details

### What Admins CANNOT Do
- ❌ Edit business information (must request owner to update)
- ❌ Delete businesses
- ❌ Modify pricing or contact details
- ❌ Access customer reviews without approval

### Data Privacy
- Admin actions are logged
- All verification decisions are timestamped
- Notes are visible only to admin and business owner
- Personal data protected under RLS policies

---

## Performance Optimization

### For Faster Reviews
1. Use filter tabs to focus on pending businesses
2. Sort by date to review new submissions first
3. Batch similar categories together
4. Set daily review goals

### Monitoring Dashboard
- Statistics auto-update when you approve/reject
- Table refreshes instantly
- No page reload needed

---

## Troubleshooting

### Can't Access Admin Panel
**Issue:** "Access Denied" when navigating to /admin

**Solution:**
1. Verify you're signed in
2. Check user role in Supabase: `SELECT role FROM public.users WHERE email = 'your-email@example.com';`
3. If role is 'user', update it: `UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';`

### Businesses Not Showing
**Issue:** No pending businesses in the admin dashboard

**Solution:**
1. Verify update_schema.sql was run successfully
2. Check that new businesses have `verification_status = 'pending'`
3. Run: `SELECT COUNT(*) FROM public.businesses WHERE verification_status = 'pending';`

### Can't Approve/Reject
**Issue:** Action buttons disabled or error occurs

**Solution:**
1. Ensure you're an admin user
2. Check browser console for errors
3. Verify Supabase connection is active
4. Try refreshing the page

---

## Monthly Admin Tasks

### Week 1: Catch-up
- Clear backlog of pending businesses
- Aim for 48-hour turnaround on reviews

### Week 2-3: Maintenance
- Monitor approved businesses for compliance
- Review rejection feedback effectiveness

### Week 4: Analysis
- Review approval/rejection ratio
- Identify improvement areas
- Update verification criteria if needed

---

## Professional Standards for SaloneBiz

### Sierra Leone Market Context
SaloneBiz serves the vibrant service industry of Sierra Leone while maintaining international quality standards:

- ✓ Supports local businesses and entrepreneurs
- ✓ Accepts valid phone formats (+232 preferred)
- ✓ Currency: Sierra Leone Leone (Le)
- ✓ International business standards
- ✓ Professional English requirement for listings

### Quality Assurance
- Professional image quality required
- Clear, grammatically correct descriptions
- Valid contact information
- Professional business presentation
- Respect for customer privacy

---

## Next Steps

1. ✅ Run the update_schema.sql in Supabase
2. ✅ Create admin user account
3. ✅ Sign in and test admin dashboard
4. ✅ Approve/reject a test business
5. ✅ Verify changes appear on marketplace

---

## Support & Documentation

- **Supabase Docs:** https://supabase.com/docs
- **Database:** PostgreSQL with RLS policies
- **Auth:** Supabase Auth with role-based access control
- **Architecture:** Next.js 16 App Router + TypeScript

---

**Version:** 1.0  
**Last Updated:** June 2026  
**Status:** ✅ Production Ready

---

## Admin Dashboard Access

**URL:** `http://localhost:3000/admin` (production: your-domain.com/admin)

**Requirements:**
- Must be signed in
- Account role must be 'admin'
- Database schema must be updated

**Contact:** For setup issues, check Supabase logs and verify SQL executed successfully.
