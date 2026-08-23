# Database Structure Documentation

## Overview
Your Tcoons International application uses Supabase PostgreSQL database with Row Level Security (RLS) for secure data management.

## Tables

### 1. Enquiries Table
Stores all business and product enquiry submissions.

**Columns:**
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | Yes | Primary key (auto-generated) |
| type | TEXT | Yes | Either 'business' or 'product' |
| name | TEXT | Yes | Full name of enquirer |
| mobile | TEXT | Yes | 10-digit mobile number |
| email | TEXT | No | Email address (optional) |
| address | TEXT | Yes | Full address |
| product_category | TEXT | No | Category (only for product enquiries) |
| status | TEXT | Yes | Status: 'new', 'contacted', or 'resolved' (default: 'new') |
| created_at | TIMESTAMPTZ | Yes | Submission timestamp (auto-generated) |

**Indexes:**
- `idx_enquiries_type` - For filtering by type
- `idx_enquiries_status` - For filtering by status
- `idx_enquiries_created_at` - For sorting by date

**RLS Policies:**
| Policy | Operation | Access Level | Condition |
|--------|-----------|--------------|-----------|
| "Anyone can submit enquiry" | INSERT | Public | Validates type, name, mobile, address not empty |
| "Authenticated users view all enquiries" | SELECT | Authenticated | Can view all enquiries |
| "Authenticated users update enquiries" | UPDATE | Authenticated | Can update any enquiry |

---

### 2. Homepage Content Table
Stores all customizable homepage text and content.

**Columns:**
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| id | UUID | Yes | Primary key (auto-generated) |
| key | TEXT | Yes | Unique identifier (e.g., 'hero_title') |
| value | TEXT | Yes | Content value (text or HTML) |
| section | TEXT | Yes | Section name: 'hero', 'stats', 'offer', 'journey', 'footer' |
| updated_at | TIMESTAMPTZ | Yes | Last modification timestamp (auto: now()) |

**Sample Data:**
- **Hero Section**: hero_subtitle, hero_cta1_text, hero_cta2_text (3 items)
- **Statistics**: stat1_value, stat1_label, ..., stat4_value, stat4_label (8 items)
- **Offer Section**: offer_title, offer_subtitle (2 items)
- **Journey Section**: journey_title, journey_subtitle (2 items)
- **Footer**: footer_company, footer_tagline, footer_partner (3 items)

**Total**: 18 content items

**Indexes:**
- `idx_homepage_content_key` - For quick lookups by key
- `idx_homepage_content_section` - For filtering by section

**RLS Policies:**
| Policy | Operation | Access Level | Condition |
|--------|-----------|--------------|-----------|
| "Public view homepage content" | SELECT | Public | Anyone can read content |
| "Authenticated insert content" | INSERT | Authenticated | Admins can add new content |
| "Authenticated update content" | UPDATE | Authenticated | Admins can modify content |

---

## Security Model

### Row Level Security (RLS) Enabled
Both tables have RLS enabled. By default, no one can access data unless a policy explicitly grants access.

### Authentication Levels

**Public (anon)**
- Can INSERT enquiries
- Can SELECT homepage content
- Cannot UPDATE or DELETE anything

**Authenticated (logged-in admins)**
- Can SELECT all enquiries
- Can UPDATE enquiry status
- Can INSERT/UPDATE homepage content
- Cannot DELETE (prevents accidental data loss)

### User Roles

**Guest Users**
- Submit enquiries
- View public website and content

**Admin Users**
- View all enquiries
- Update enquiry status
- Edit homepage content
- Manage admin account (via Supabase dashboard)

---

## Data Validation

### Enquiry Submission Validation
The database enforces:
- `type` must be 'business' or 'product'
- `name` cannot be empty
- `mobile` must be provided and cannot be empty
- `address` must be provided and cannot be empty
- `status` must be 'new', 'contacted', or 'resolved'

### Mobile Number Validation
Currently allows any 10-character string. For stricter validation (India phone numbers starting with 6-9), update in form validation layer.

---

## Data Flow

### Enquiry Submission Flow
```
User fills form
↓
Client-side validation (format check)
↓
Supabase INSERT (RLS policy checks access)
↓
Server-side validation (database constraints)
↓
Data stored in enquiries table
↓
Admin Dashboard displays enquiry
↓
Admin updates status
↓
RLS policy allows authenticated user to update
```

### Homepage Content Flow
```
Website loads
↓
App fetches from homepage_content table
↓
Public SELECT policy grants access
↓
Content displays on page
↓
Admin edits content via Content Management
↓
RLS policy allows authenticated user to update
↓
Changes saved to database
↓
Website reloads and shows updated content
```

---

## Backup & Recovery

### Automatic Backups
Supabase provides:
- Daily automated backups
- 7-day backup retention (on most plans)
- Point-in-time recovery available

### Manual Backup (Export Data)
1. Go to Supabase Dashboard
2. Select your project
3. Database → enquiries table
4. Click "..." menu → Export
5. Choose CSV or JSON format
6. Download file

---

## Performance Considerations

### Queries with Indexes
- Filter by type: Fast (uses idx_enquiries_type)
- Filter by status: Fast (uses idx_enquiries_status)
- Sort by date: Fast (uses idx_enquiries_created_at DESC)
- Get content by key: Fast (uses idx_homepage_content_key)

### Expected Performance
- Small database (<10K enquiries): Sub-millisecond responses
- Medium database (10K-100K enquiries): Millisecond responses
- Large database (>100K enquiries): May need query optimization

### Optimization Tips
- Add more indexes if filtering by frequently used columns
- Archive old enquiries to separate table if needed
- Use pagination for large result sets

---

## Maintenance Tasks

### Regular
- Monitor enquiry volume
- Archive old enquiries (optional)
- Review admin access (monthly)

### As Needed
- Reset admin passwords
- Create additional admin accounts
- Update homepage content
- Export enquiry reports

### Never Do
- DELETE data directly (use Supabase dashboard)
- Modify RLS policies without understanding impact
- Share admin credentials
- Expose Supabase keys in client code

---

## Troubleshooting

### Enquiry Not Submitting
1. Check browser console for errors
2. Verify required fields not empty
3. Check mobile number is 10 digits
4. Verify Supabase project is active

### Content Not Updating
1. Ensure logged in as admin
2. Check that Save button was clicked
3. Verify browser console has no errors
4. Refresh page to see updates

### Can't Access Dashboard
1. Verify admin account created in Supabase
2. Check credentials are correct
3. Verify "Auto Confirm User" was enabled
4. Try password reset

---

## API Reference

### Insert Enquiry
```javascript
const { error } = await supabase
  .from('enquiries')
  .insert({
    type: 'business',
    name: 'John Doe',
    mobile: '9876543210',
    email: 'john@example.com',
    address: '123 Main St, City'
  });
```

### Get All Enquiries (Admin)
```javascript
const { data } = await supabase
  .from('enquiries')
  .select('*')
  .order('created_at', { ascending: false });
```

### Update Enquiry Status
```javascript
const { error } = await supabase
  .from('enquiries')
  .update({ status: 'contacted' })
  .eq('id', enquiry_id);
```

### Get Homepage Content
```javascript
const { data } = await supabase
  .from('homepage_content')
  .select('*')
  .eq('section', 'hero');
```

### Update Homepage Content
```javascript
const { error } = await supabase
  .from('homepage_content')
  .update({ value: 'New text' })
  .eq('key', 'hero_subtitle');
```

---

## Support

For issues with:
- **Database access**: Check Supabase project status
- **RLS policies**: Review policies in Supabase Dashboard
- **Data**: Use Supabase table viewer to inspect data
- **Backups**: Contact Supabase support

**Supabase Documentation**: https://supabase.com/docs
