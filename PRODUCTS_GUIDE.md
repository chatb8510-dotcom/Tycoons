# Products & E-Commerce Guide

## Overview
Your Tcoons International platform now includes a complete e-commerce product catalog system with AWPL-style product display, similar to Asclepius Wellness.

## Features

### For Customers (Public)
- **Browse Products**: View full product catalog with beautiful grid layout
- **Category Filtering**: Filter by 14 different product categories
- **Search**: Quick search by product name or description
- **Product Details**: See MRP, DP, SP pricing tiers
- **Favorites**: Save favorite products (local browser storage)
- **Multiple Images**: Hover over products to see alternate images
- **Enquiry**: Click "Enquire Now" to submit product inquiry

### For Admins (Dashboard)
- **Add Products**: Create new products with all details
- **Edit Products**: Update existing product information
- **Delete Products**: Remove discontinued products
- **Featured Products**: Mark bestsellers for special display
- **Active/Inactive**: Control product visibility
- **Bulk Management**: Manage entire product catalog

## Accessing Products

### Customer View
1. Click **Products** in the navigation menu
2. Browse the full catalog with:
   - Category filter pills (tap to filter)
   - Search bar (search by name or description)
   - Product count indicator
   - Result count display

### Admin View
1. Log in to Admin Dashboard
2. Click **Products** button (top right)
3. Manage your entire catalog:
   - View all products in list format
   - Click **Add Product** to create new
   - Click **Edit** icon to modify existing
   - Click **Delete** icon to remove

## Product Structure

### Product Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Name | Text | Yes | Product name (e.g., "Premium Herbal Wellness Set") |
| Category | Select | Yes | Choose from 14 predefined categories |
| Description | Text | Yes | Short product description |
| Image URL | URL | Yes | Primary product image (use Pexels links) |
| Alt Image URL | URL | No | Secondary image (shown on hover) |
| MRP | Number | Yes | Maximum Retail Price (₹) |
| DP | Number | Yes | Distributor Price (₹) |
| SP | Number | Yes | Selling Price / Commission (₹) |
| Featured | Checkbox | No | Mark as bestseller |
| Active | Checkbox | No | Make product visible |

### Categories Available
1. Wellness Product
2. WellRoot
3. Agriculture Products
4. Jeeveda Spices
5. Baby Care
6. Sniss Cosmetic
7. Sniss Herbal
8. Sniss Elite
9. Sniss Fragrances
10. Oral Care
11. Veterinary
12. Apparels
13. Home Care
14. Food Product

## How to Add a Product

### Step 1: Go to Product Management
1. Log in to Admin Dashboard
2. Click **Products** button

### Step 2: Click "Add Product"
- Green button in top right corner
- Form will open

### Step 3: Fill in Product Details
- **Name**: Enter product name
- **Category**: Select from dropdown
- **Description**: Write 1-2 sentences about the product
- **Image URL**: Paste URL to product image
  - Tip: Use Pexels.com for free high-quality images
  - Format: `https://images.pexels.com/photos/[ID]/pexels-photo-[ID].jpeg`
- **Alt Image URL**: (Optional) Second image for hover effect
- **MRP**: Enter maximum retail price
- **DP**: Enter distributor price
- **SP**: Enter selling/commission price
- **Featured**: Check if bestseller
- **Active**: Check to show on website

### Step 4: Save
- Click **Save Product** button
- Product appears immediately in catalog

## How to Edit a Product

1. Go to Product Management
2. Find product in the list
3. Click the **Edit** icon (pencil)
4. Form opens with current details
5. Update any fields
6. Click **Save Product**

## How to Delete a Product

1. Go to Product Management
2. Find product in the list
3. Click **Delete** icon (trash)
4. Confirm deletion
5. Product removed immediately

## Image Tips

### Best Practices
- Use high-quality, professional images
- Minimum resolution: 600x600 pixels
- Aspect ratio: Square (1:1) works best
- Format: JPG or PNG
- File size: <500KB recommended

### Free Image Sources
- **Pexels**: https://pexels.com (Recommended)
- **Unsplash**: https://unsplash.com
- **Pixabay**: https://pixabay.com

### Adding Pexels Images
1. Go to https://pexels.com
2. Search for your product
3. Right-click image → Copy Image Link
4. Paste in Image URL field

Example links:
```
https://images.pexels.com/photos/4194857/pexels-photo-4194857.jpeg
https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg
https://images.pexels.com/photos/6608234/pexels-photo-6608234.jpeg
```

## Pricing Structure

### Understanding MRP, DP, SP
- **MRP**: Maximum Retail Price (what customer sees as "original")
- **DP**: Distributor Price (wholesale rate for partners)
- **SP**: Selling Price or Commission (partner margin)

### Example
```
Product: Premium Wellness Set
MRP: ₹1299 (retail customer pays this)
DP: ₹899 (distributor/business partner cost)
SP: ₹599 (what you earn per sale)
```

### Setting Prices
- Keep DP < MRP (discount for partners)
- Keep SP < DP (profit margin)
- Update regularly based on costs

## Product Display

### On Products Page
- Grid layout: 1 column (mobile), 2 (tablet), 3 (desktop), 4 (wide)
- Product card shows:
  - Product image with hover effect
  - Category badge
  - Product name
  - Description
  - Pricing (MRP, DP, SP)
  - Bestseller badge (if featured)
  - Favorite button
  - "Enquire Now" button

### Featured Products
- Featured products appear first in list
- "Bestseller" badge displayed
- Great for promoting top sellers

## Filtering & Search

### Category Filter
- Click any category pill to filter
- Shows products only in that category
- Click "All Products" to see everything

### Search
- Type in search bar to find products
- Searches product name and description
- Real-time results

### Combining Filters
- Select category AND search
- Both filters work together
- Count updates automatically

## Product Enquiry Integration

When customer clicks "Enquire Now":
1. Taken to Product Enquiry form
2. Can select product category
3. Inquiry saved to database
4. Admin sees in Enquiry Dashboard
5. DP/SP prices match product pricing

## Database Structure

### Products Table
Located in Supabase `products` table:
- 12 sample products pre-loaded
- All AWPL categories included
- Premium wellness imagery
- Pricing examples provided

### Indexes
- `idx_products_category`: Fast category filtering
- `idx_products_featured`: Quick bestseller lookup
- `idx_products_active`: Efficient visibility control
- `idx_products_created_at`: Sorted by newest first

## Customization Options

### Add More Categories
Edit `PRODUCT_CATEGORIES` in ProductDisplayPage.tsx:
```typescript
const CATEGORIES = [
  'Wellness Product',
  'Your New Category',
  // ... more categories
];
```

### Change Grid Layout
Modify grid columns in ProductDisplayPage.tsx:
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// Change to: grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 for more columns
```

### Modify Product Card
Edit product card styling in ProductDisplayPage.tsx around line 250+

## Common Tasks

### Export Products
1. Go to Supabase Dashboard
2. Select your project
3. Database → products table
4. Click "..." menu → Export
5. Choose CSV or JSON
6. Download file

### Bulk Upload Products
Current: Manual one-by-one via admin form
Future: Can add CSV import feature

### Archive Old Products
Instead of deleting:
1. Edit the product
2. Uncheck **Active** checkbox
3. Save
4. Product hidden but data preserved

## Performance

### Optimization
- Products load from database in real-time
- Caching: Images cached by browser
- Search is instant (client-side)
- No page reloads needed

### Best Practices
- Keep images <500KB each
- Use descriptive product names
- Write clear descriptions
- Update prices periodically

## Troubleshooting

### Products Not Showing
- Check **Active** checkbox is enabled
- Verify category is correct
- Clear browser cache
- Refresh page

### Images Not Loading
- Verify URL is correct
- Check image still exists on Pexels
- Try different image
- Check internet connection

### Can't Add Product
- Make sure logged in as admin
- Fill all required fields (marked with *)
- Check for error message
- Try refreshing page

### Prices Not Updating
- Click Save button (not just close)
- Wait for "Product updated" message
- Refresh Products page to verify

## Admin Permissions

Only authenticated admins can:
- Add new products
- Edit existing products
- Delete products
- Access Product Management page

Public users can only:
- View products
- Filter and search
- Click Enquire button

## Next Steps

1. ✅ View Products page in navigation
2. ✅ Add your first product
3. ✅ Set up 3-5 featured products
4. ✅ Test product enquiry flow
5. ✅ Share Products link with customers

---

**Need Help?**
- Check ADMIN_SETUP.md for authentication issues
- See DATABASE_STRUCTURE.md for technical details
- Review code comments for customization help
