# Admin Dashboard Setup Guide

## Overview
Your Tcoons International website includes a secure admin dashboard for managing enquiries and customizing homepage content. This guide provides complete setup instructions.

## Step 1: Create Your Admin Account

### Via Supabase Dashboard (Recommended)

1. Open **Supabase Dashboard**: https://app.supabase.com
2. Sign in with your Supabase account
3. Select your project from the list
4. Click **Authentication** in the left sidebar
5. Click the **Users** tab
6. Click **+ Create a new user** button
7. Enter your details:
   - **Email**: Your admin email (e.g., `admin@tcoonsintl.com`)
   - **Password**: Strong password (minimum 6 characters, recommend 12+ with mixed case and numbers)
   - **Auto Confirm User**: Toggle ON (to confirm immediately)
8. Click **Create user**

Your admin account is now active!

### Find Your Supabase Project URL & Keys

1. Go to **Project Settings** (bottom left in Supabase)
2. Click **API** tab
3. Copy:
   - **Project URL** → Store as `VITE_SUPABASE_URL`
   - **Anon public key** → Store as `VITE_SUPABASE_ANON_KEY`
4. Add these to your `.env` file (already done in most setups)

## Step 2: Access Admin Dashboard

1. Go to your website
2. Click **Admin** in the top navigation
3. You'll see the login form
4. Enter:
   - **Email**: The email from Step 1
   - **Password**: The password you created
5. Click **Sign In**

## Step 3: Admin Dashboard Features

### Enquiry Management
- **View All Enquiries**: See all business and product enquiries in real-time
- **Filter**: Toggle between "All Enquiries", "Business", and "Product"
- **Track Status**: View enquiry status (New, Contacted, Resolved)
- **Update Status**: Click any enquiry row to expand and change status
- **View Details**: See full details including email, address, and submission date
- **Refresh**: Click refresh icon to get latest enquiries

### Key Metrics
- **Total Enquiries**: All submissions combined
- **Business Enquiries**: Business opportunity inquiries
- **Product Enquiries**: Product interest inquiries
- **New/Pending**: Enquiries not yet contacted

### Customizable Sections
- **Edit Content** button opens content management
- Update homepage text without coding
- Changes appear immediately (no redeploy needed)

## Step 4: Edit Homepage Content

1. From Admin Dashboard, click **Edit Content** button
2. Browse sections:
   - **Hero Section**: Main title, subtitle, button text
   - **Statistics**: All stat values and labels
   - **What We Offer**: Section title and description
   - **Start Your Journey**: Section content
   - **Footer**: Company name, tagline, partner info
3. Click into any field and edit text
4. Click **Save** button (turns gold when changes made)
5. Changes live immediately on public site

## Step 5: Troubleshooting

### Login Not Working

**"Invalid email or password"**
- Verify the email matches exactly what you created in Supabase
- Check for extra spaces before/after email
- Verify "Auto Confirm User" was ON when you created the account
- Try resetting password (Step 6 below)

**"Please check your email and password"**
- Ensure email is correct
- Verify password has no typos
- Password is case-sensitive

**Still Having Issues?**
1. Open browser console (F12)
2. Check for error messages in the console
3. Verify your `.env` file has correct Supabase credentials
4. Try creating a new admin user in Supabase

### Can't See Enquiries

- Make sure you're logged in (check top right for "Sign Out" button)
- Refresh the page (F5 or Cmd+R)
- Click the refresh icon in the dashboard
- Check that form submissions worked (they show in real-time)

### Content Not Updating

- Ensure you clicked **Save** button (you'll see "Content updated successfully!")
- Refresh the public website (F5) to see changes
- Check browser console for errors

## Step 6: Reset Admin Password

If you forget your password:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find your admin user
3. Click the **...** menu (three dots)
4. Select **Reset password**
5. Check your email for reset link
6. Click link and create new password

## Step 7: Security Best Practices

1. **Strong Password**: Use 12+ characters with uppercase, lowercase, numbers, and symbols
2. **Keep Confidential**: Never share your admin credentials
3. **Sign Out**: Always sign out on shared devices
4. **Change Regularly**: Update password every 30-60 days
5. **Backup Access**: Keep recovery codes safe if Supabase offers them

## Step 8: Database Structure Overview

Your database includes:

### Enquiries Table
- Stores all business and product enquiries
- Fields: name, mobile, email, address, type, product_category, status
- Public INSERT (anyone can submit)
- Authenticated SELECT (admins can view)
- Authenticated UPDATE (admins can update status)

### Homepage Content Table
- Stores all customizable homepage text
- Fields: key, value, section
- Public SELECT (website reads content)
- Authenticated UPDATE (admins edit)

## Common Questions

**Q: Can I create multiple admin accounts?**
A: Yes! Repeat Step 1 for each admin. All authenticated users can access the dashboard.

**Q: What if I need to remove an admin?**
A: Go to Supabase Dashboard → Authentication → Users, find the user, click "..." → Delete user.

**Q: Is data backed up?**
A: Yes! Supabase provides automatic daily backups. Your project settings show backup schedule.

**Q: Can I export enquiry data?**
A: Yes! Go to Supabase Dashboard → Database → enquiries table → Export option (top right).

**Q: How long are enquiries stored?**
A: Indefinitely. They stay in your database until you delete them.

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Project Settings**: Check `.env` file for connection details
- **Status Page**: https://status.supabase.com (check if service has issues)
- **Reset Everything**: Contact Supabase support or delete and recreate the project

---

**Next Steps:**
1. Create your admin account (Step 1)
2. Log in and test (Step 2)
3. Customize your homepage (Step 4)
4. Share admin credentials securely with team members if needed

Your Tcoons International admin panel is ready to use!
