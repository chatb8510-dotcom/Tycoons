# Quick Start Guide - Tcoons International Admin

## Getting Started in 5 Minutes

### Step 1: Create Admin Account (2 minutes)
1. Go to https://app.supabase.com
2. Select your project
3. Click **Authentication** → **Users**
4. Click **+ Create a new user**
5. Enter:
   - Email: `your-email@example.com`
   - Password: `YourSecurePassword123`
   - Toggle **Auto Confirm User** ON
6. Click **Create user**

### Step 2: Log In to Admin Dashboard (1 minute)
1. Go to your website → Click **Admin** link
2. Enter the email and password from Step 1
3. Click **Sign In**

### Step 3: View Enquiries (1 minute)
- You're now in the Admin Dashboard
- See all enquiries with stats at top
- Click any enquiry to view full details
- Change status with buttons (New → Contacted → Resolved)

### Step 4: Edit Homepage (1 minute)
1. Click **Edit Content** button (top right)
2. Edit any text field
3. Click **Save** button
4. Refresh public website to see changes

---

## Common Tasks

### Check New Enquiries
- Dashboard shows real-time count under "New / Pending"
- Click "All Enquiries" filter to see everything
- Click enquiry row to expand details

### Contact Someone
1. Click the enquiry
2. Get their phone number and email
3. Click status button → **Contacted**
4. Note: You'll add your own contact system

### Update Homepage Text
1. Click **Edit Content**
2. Find the section you want to edit
3. Click in the text field
4. Edit the text
5. Click **Save** (gold button)
6. Refresh website to see live changes

### Change Enquiry Status
1. Click enquiry row to expand
2. Scroll to "Update Status" section
3. Click **New**, **Contacted**, or **Resolved**
4. Status updates instantly

---

## What You Can't Do (Protected)

- Delete enquiries (preserved for records)
- Delete admin accounts from dashboard (Supabase only)
- Change RLS security policies (database protection)
- Access other users' accounts

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid email or password" | Check email spelling, verify account created with "Auto Confirm User" ON |
| Can't see enquiries | Make sure you're logged in, click refresh icon |
| Content not saving | Click Save button, check for error message, refresh page |
| Page showing old content | Clear browser cache (Ctrl+Shift+Delete) or use Incognito window |

---

## Key Files

| File | Purpose |
|------|---------|
| ADMIN_SETUP.md | Detailed setup and troubleshooting |
| DATABASE_STRUCTURE.md | Technical database documentation |
| .env | Supabase connection credentials |

---

## Important Notes

✓ Your database is secure with RLS policies
✓ Enquiry data is automatically backed up
✓ Multiple admins can share one dashboard
✓ All changes are instant (no deployment needed)
✓ Content updates don't require code changes

---

## Next Steps

1. ✅ Create your admin account
2. ✅ Log in and explore the dashboard
3. ✅ Update your homepage content
4. ✅ Set up team member access
5. Optional: Add email notifications for new enquiries

---

## Need Help?

See full documentation:
- **Setup Issues**: Read ADMIN_SETUP.md
- **Database Questions**: Read DATABASE_STRUCTURE.md
- **Technical Details**: Check project files in src/

Your website is ready! Start managing enquiries and content now.
