import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      enquiries: {
        Row: {
          id: string;
          type: 'business' | 'product';
          name: string;
          mobile: string;
          email: string | null;
          address: string;
          product_category: string | null;
          status: 'new' | 'contacted' | 'resolved';
          created_at: string;
        };
        Insert: {
          type: 'business' | 'product';
          name: string;
          mobile: string;
          email?: string | null;
          address: string;
          product_category?: string | null;
          status?: 'new' | 'contacted' | 'resolved';
        };
      };
      homepage_content: {
        Row: {
          id: string;
          key: string;
          value: string;
          section: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
          section: string;
        };
        Update: {
          value?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string;
          image_url: string;
          image_url_alt: string | null;
          mrp: number;
          dp: number;
          sp: number;
          qty: string;
          benefits: string;
          usage: string;
          ingredients: string;
          featured: boolean;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          category: string;
          description: string;
          image_url: string;
          image_url_alt?: string | null;
          mrp?: number;
          dp?: number;
          sp?: number;
          qty?: string;
          benefits?: string;
          usage?: string;
          ingredients?: string;
          featured?: boolean;
          active?: boolean;
        };
        Update: {
          name?: string;
          category?: string;
          description?: string;
          image_url?: string;
          image_url_alt?: string | null;
          mrp?: number;
          dp?: number;
          sp?: number;
          qty?: string;
          benefits?: string;
          usage?: string;
          ingredients?: string;
          featured?: boolean;
          active?: boolean;
        };
      };
      cart_enquiries: {
        Row: {
          id: string;
          customer_name: string;
          mobile_number: string;
          email: string | null;
          city: string | null;
          state: string | null;
          message: string | null;
          cart_items: Json;
          status: 'new' | 'contacted' | 'resolved';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          customer_name: string;
          mobile_number: string;
          email?: string | null;
          city?: string | null;
          state?: string | null;
          message?: string | null;
          cart_items: Json;
          status?: 'new' | 'contacted' | 'resolved';
        };
      };
      requirement_enquiries: {
        Row: {
          id: string;
          customer_name: string;
          phone: string;
          email: string | null;
          city: string | null;
          requirement_type: string;
          message: string | null;
          status: 'new' | 'contacted' | 'resolved';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          customer_name: string;
          phone: string;
          email?: string | null;
          city?: string | null;
          requirement_type: string;
          message?: string | null;
          status?: 'new' | 'contacted' | 'resolved';
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          image_url_alt: string | null;
          uploaded_at: string;
          updated_at: string;
        };
        Insert: {
          product_id: string;
          image_url: string;
          image_url_alt?: string | null;
          uploaded_at?: string;
          updated_at?: string;
        };
        Update: {
          image_url?: string;
          image_url_alt?: string | null;
          updated_at?: string;
        };
      };
    };
  };
};

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
