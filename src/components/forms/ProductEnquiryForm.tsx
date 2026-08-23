import { useState } from 'react';
import { ArrowLeft, Send, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ProductEnquiryFormData, Page, PRODUCT_CATEGORIES } from '../../types';
import FormField from '../ui/FormField';
import LoadingSpinner from '../ui/LoadingSpinner';
import SuccessModal from '../ui/SuccessModal';

interface ProductEnquiryFormProps {
  onNavigate: (page: Page) => void;
}

const INITIAL: ProductEnquiryFormData = {
  name: '',
  mobile: '',
  email: '',
  address: '',
  product_category: '',
};

type Errors = Partial<Record<keyof ProductEnquiryFormData, string>>;

function validate(data: ProductEnquiryFormData): Errors {
  const errors: Errors = {};
  if (!data.name.trim()) errors.name = 'Name is required';
  if (!data.mobile.trim()) {
    errors.mobile = 'Mobile number is required';
  } else if (!/^[6-9]\d{9}$/.test(data.mobile.trim())) {
    errors.mobile = 'Enter a valid 10-digit mobile number';
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!data.address.trim()) errors.address = 'Address is required';
  if (!data.product_category) errors.product_category = 'Please select a product category';
  return errors;
}

export default function ProductEnquiryForm({ onNavigate }: ProductEnquiryFormProps) {
  const [form, setForm] = useState<ProductEnquiryFormData>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ProductEnquiryFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      const { error } = await supabase.from('enquiries').insert({
        type: 'product',
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim() || null,
        address: form.address.trim(),
        product_category: form.product_category,
      });

      if (error) throw error;

      setSuccess(true);
      setForm(INITIAL);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {success && (
        <SuccessModal type="product" onClose={() => onNavigate('home')} />
      )}

      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-muted hover:text-white text-sm mb-8 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <div className="mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-[#E8B86D] mb-4 border-subtle">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E8B86D]" />
              AWPL Products
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-800 text-white mb-3">
              Product Enquiry
            </h1>
            <p className="text-muted text-base leading-relaxed">
              Explore our range of AWPL wellness products. Select a category and
              we'll help you find exactly what you need.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-6 sm:p-8 space-y-5 animate-fade-in-up animate-delay-100"
          >
            <FormField label="Product Category" required error={errors.product_category}>
              <div className="relative">
                <select
                  name="product_category"
                  value={form.product_category}
                  onChange={handleChange}
                  className="input-dark w-full px-4 py-3 rounded-xl text-sm appearance-none pr-10"
                  style={{ color: form.product_category ? '#f5f5f5' : '#555555' }}
                >
                  <option value="" disabled>Select a category</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} style={{ background: '#1a1a1a', color: '#f5f5f5' }}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              </div>
            </FormField>

            <FormField label="Full Name" required error={errors.name}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="input-dark w-full px-4 py-3 rounded-xl text-sm"
              />
            </FormField>

            <FormField label="Mobile Number" required error={errors.mobile} hint="10-digit Indian mobile number">
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                maxLength={10}
                className="input-dark w-full px-4 py-3 rounded-xl text-sm"
              />
            </FormField>

            <FormField label="Email Address" error={errors.email}>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="input-dark w-full px-4 py-3 rounded-xl text-sm"
              />
            </FormField>

            <FormField label="Full Address" required error={errors.address}>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Street, City, State, Pincode"
                rows={3}
                className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none"
              />
            </FormField>

            {submitError && (
              <p className="text-red-400 text-sm bg-red-400/10 rounded-xl px-4 py-3">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <LoadingSpinner size={16} />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Product Enquiry</span>
                  <Send size={15} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
