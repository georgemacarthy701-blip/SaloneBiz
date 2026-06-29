# 🛡️ SaloneBiz Admin Portal - Complete Guide

## Professional Dual-System Administration

SaloneBiz features a completely separate, professional admin system with two specialized dashboards:

1. **Admin Login Portal** - Secure, separate authentication
2. **Admin Dashboard** - User & Business Management
3. **Business Verification** - Dedicated business approval system

---

## Admin Portal Architecture

```
┌─────────────────────────────────────────────────────┐
│          SaloneBiz Admin Portal                      │
└─────────────────────────────────────────────────────┘
         │
         ├─ /admin-login (Separate Authentication)
         │
         ├─ /admin-dashboard (User Management)
         │   ├─ View all users
         │   ├─ Approve/Reject users
         │   └─ Monitor system health
         │
         └─ /admin (Business Verification)
             ├─ Review businesses
             ├─ Approve/Reject listings
             └─ Manage marketplace
```

---

## Part 1: Admin Login System

### Access Point
**URL:** `http://localhost:3000/admin-login`

### Design Features
- ✅ Completely separate from regular login
- ✅ Professional dark theme (purple accent)
- ✅ Enterprise security appearance
- ✅ Dedicated admin branding
- ✅ Clear access control messaging

### Login Requirements
- **Email:** Must be registered as admin user
- **Password:** Your Supabase password
- **Access Check:** System verifies admin role before granting access
- **Security:** Failed non-admin logins are immediately rejected

### Authentication Flow
```
Enter Email & Password
        ↓
Verify with Supabase
        ↓
Check if user is admin
        ↓
IF admin: Go to /admin-dashboard
IF not:   Show error & deny access
```

---

## Part 2: Admin Dashboard (User Management)

### Dashboard URL
`http://localhost:3000/admin-dashboard`

### Two Main Sections

#### Section 1: Statistics Cards
Display real-time metrics:
- **Total Users** - All registered users
- **Pending Approval** - Users awaiting verification
- **Approved Users** - Verified users
- **Admin Accounts** - System administrators

#### Section 2: User Management Table
Shows all users with:
- Email address
- Role (User or Administrator)
- Verification Status (Pending/Approved/Rejected)
- Join date
- Review button for each user

### User Approval Workflow

#### For Pending Users

**Review Process:**
1. Click "Review" button next to user
2. Modal opens showing user details
3. Optionally add rejection notes
4. Choose action:
   - **Approve User** - Grants immediate access to all features
   - **Reject User** - Blocks access, requires rejection notes

**After Approval:**
- User status changes to "Approved"
- User can immediately use dashboard
- User can create/manage businesses

**After Rejection:**
- User status changes to "Rejected"
- Admin notes visible to user
- User account remains but restricted

### User Roles

#### Regular User
- Can register and use marketplace
- Must be approved before full access
- Can create businesses (pending verification)
- Can write reviews
- Cannot access admin functions

#### Administrator
- Cannot be rejected (displayed for info only)
- Full system access
- Can manage other users
- Can verify businesses
- Cannot be removed by regular users

---

## Part 3: Business Verification (Separate Dashboard)

### Access Point
**URL:** `http://localhost:3000/admin` (if logged in as admin)

### Purpose
Manage business listings:
- Review pending businesses
- Approve listings for marketplace
- Reject inappropriate listings
- Manage featured businesses

### Business Status Flow
```
Business Created (Pending)
        ↓
Admin Reviews Details & Cover Image
        ↓
    ┌───────────────┐
    │               │
Approve        Reject
(Visible)    (Hidden)
```

---

## Complete Admin Setup Guide

### Step 1: Database Updates (CRITICAL)

Run this SQL in Supabase:

```sql
-- Add admin-specific columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending'
  CHECK (verification_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Create index for user verification
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON public.users(verification_status);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Update RLS to protect user data
DROP POLICY IF EXISTS "Users can read their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

CREATE POLICY "Users can read own profile" ON public.users FOR SELECT
  USING (auth.uid() = id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can update user verification" ON public.users FOR UPDATE
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');
```

### Step 2: Create Admin Account

**Method 1: In Supabase Console**
1. Go to Authentication → Users
2. Create new user with your email: `admin@salonebiz.com`
3. In SQL Editor, run:
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'admin@salonebiz.com';
```

**Method 2: Via Application**
1. Register regular account first
2. Have existing admin run SQL update above
3. Log out and go to `/admin-login`
4. Use your credentials

### Step 3: First Login

1. Navigate to: http://localhost:3000/admin-login
2. Enter admin email: admin@salonebiz.com
3. Enter password: your password
4. System verifies admin role
5. Redirected to /admin-dashboard

### Step 4: Verify Access

You should see:
- ✅ Statistics cards with user counts
- ✅ User management table
- ✅ Link to business verification
- ✅ Sign out button

---

## Admin Responsibilities

### Daily Tasks
- Review pending user registrations (5-10 min)
- Verify business listings (10-15 min)
- Monitor system health (5 min)
- Respond to escalations (as needed)

### Weekly Tasks
- Review approval metrics
- Monitor user feedback
- Check for suspicious activity
- Update verification policies if needed

### Monthly Tasks
- Generate admin report
- Review user trends
- Update approval guidelines
- Plan improvements

---

## User Verification Guidelines

### Approve When User Has:
✅ Valid email address  
✅ Clear purpose for account  
✅ Professional presence  
✅ No suspicious activity  

### Reject When User:
❌ Provides fake/incomplete information  
❌ Shows signs of spam/bot activity  
❌ Violates terms of service  
❌ Has multiple failed login attempts  

### Rejection Reasons (Examples)
- "Incomplete profile information required"
- "Email verification failed"
- "Account flagged for suspicious activity"
- "Please complete profile setup before approval"

---

## Security Features

### Built-in Protections
- Admin-only access control
- Role-based access verification
- Automatic admin role checking
- Secure session management
- Activity logging ready

### Best Practices
1. Never share admin credentials
2. Log out after each session
3. Use strong, unique password
4. Monitor account for unusual activity
5. Report security issues immediately

---

## Troubleshooting

### Can't Access Admin Login
**Problem:** "Page not found" or "Access denied"

**Solution:**
1. Verify admin user exists: `SELECT email, role FROM public.users WHERE role = 'admin';`
2. Update role if needed: `UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';`

### Database Error on Login
**Problem:** "Database connection failed"

**Solution:**
1. Verify Supabase credentials in .env.local
2. Check that update_schema.sql was run
3. Run this to verify: `SELECT COUNT(*) FROM public.users;`

### Can't See Users in Dashboard
**Problem:** Empty user list

**Solution:**
1. Verify users exist: `SELECT COUNT(*) FROM public.users;`
2. Check that admin user verification columns exist: `SELECT verification_status FROM public.users LIMIT 1;`
3. If columns missing, run the schema SQL again

### User Approval Not Working
**Problem:** Approve button doesn't work

**Solution:**
1. Check browser console for errors
2. Verify you have admin role
3. Ensure user status is "pending"
4. Try refreshing page

---

## Multi-Admin Setup

You can create multiple admins:

```sql
-- Create multiple admin accounts
UPDATE public.users SET role = 'admin' WHERE email IN (
  'admin1@salonebiz.com',
  'admin2@salonebiz.com',
  'admin3@salonebiz.com'
);
```

### Admin Team Coordination
- Assign different admins to user vs. business verification
- Communicate via system notes
- Share approval guidelines
- Maintain consistent standards

---

## Admin Portal vs Regular Dashboard

| Feature | Admin Portal | User Dashboard |
|---------|--------------|----------------|
| **Access** | `/admin-login` | `/login` |
| **Purpose** | Manage system | Manage businesses |
| **Users** | Admin accounts only | All users |
| **Can Approve** | Users & Businesses | N/A |
| **View Stats** | System-wide | Personal only |
| **Security** | Highest level | Standard level |

---

## Monitoring & Analytics

### User Metrics
- New registrations per day
- Approval rate percentage
- Rejection reasons (track patterns)
- Active users percentage

### Business Metrics
- Pending businesses count
- Approval turnaround time
- Rejection reasons
- Featured business ratio

### System Health
- Database connections
- Admin login attempts
- Failed authentications
- API response times

---

## Professional Standards

### Admin Behavior
✅ Professional communication  
✅ Timely responses (< 48 hours)  
✅ Fair, consistent decisions  
✅ Documented reasoning  
✅ No personal bias  

### Marketplace Quality
✅ Only approve professional businesses  
✅ Maintain community standards  
✅ Protect user trust  
✅ Encourage quality listings  

---

## Emergency Procedures

### If Admin Account Compromised
1. Immediately log out all sessions
2. Change password in Supabase
3. Review recent actions
4. Report to leadership
5. Audit all approvals

### If System Error Occurs
1. Take screenshots of error
2. Document exact steps to reproduce
3. Contact database admin
4. Restore from backup if needed

---

## Version & Support

**Admin Portal Version:** 1.0  
**Last Updated:** June 2026  
**Status:** Production Ready  

**Support Contacts:**
- Database: Supabase Console
- Authentication: Supabase Auth
- Bugs: System admin email

---

## Next Steps

1. ✅ Run database schema SQL
2. ✅ Create admin account
3. ✅ Log into /admin-login
4. ✅ Review first users
5. ✅ Approve/reject as needed
6. ✅ Manage businesses in /admin
7. ✅ Monitor system health

**You're ready to administer SaloneBiz professionally!** 🚀
