export type EnquiryType = 'business' | 'product';
export type EnquiryStatus = 'new' | 'contacted' | 'resolved';

export interface Enquiry {
  id: string;
  type: EnquiryType;
  name: string;
  mobile: string;
  email: string | null;
  address: string;
  product_category: string | null;
  status: EnquiryStatus;
  created_at: string;
}

export interface BusinessEnquiryFormData {
  name: string;
  mobile: string;
  email: string;
  address: string;
}

export interface ProductEnquiryFormData {
  name: string;
  mobile: string;
  email: string;
  address: string;
  product_category: string;
}

export const PRODUCT_CATEGORIES = [
  'Wellness Product',
  'WellRoot',
  'Agriculture Products',
  'Jeeveda Spices',
  'Sniss Cosmetic',
  'Sniss Herbal',
  'Baby Care',
  'Sniss Fragrances',
  'Oral Care',
  'Veterinary',
  'Apparels',
  'Home Care',
  'Food Product',
  'Sniss Elite',
  'Others',
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

export type Page =
  | 'home'
  | 'business-enquiry'
  | 'product-enquiry'
  | 'admin'
  | 'content-management'
  | 'products'
  | 'product-management'
  | 'product-detail'
  | 'cart'
  | 'customer-requirement'
  | 'image-management';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string;
  image_url_alt: string | null;
  qty: string;
  benefits: string;
  usage: string;
  ingredients: string;
  featured: boolean;
}

export const REQUIREMENT_TYPES = [
  'Weight Loss',
  'Weight Gain',
  'Diabetes',
  'Skin Care',
  'Hair Care',
  'Immunity',
  'Protein',
  'Personal Care',
  'Business Opportunity',
  'Other',
] as const;

export type RequirementType = typeof REQUIREMENT_TYPES[number];
