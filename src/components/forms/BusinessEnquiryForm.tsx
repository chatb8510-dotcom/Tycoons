import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { BusinessEnquiryFormData, Page } from '../../types';
import FormField from '../ui/FormField';
import LoadingSpinner from '../ui/LoadingSpinner';
import SuccessModal from '../ui/SuccessModal';

interface BusinessEnquiryFormProps {
  onNavigate: (page: Page) => void;
}

const INITIAL: BusinessEnquiryFormData = {
  name: '',
  mobile: '',
  email: '',
  address: '',
};

type Errors = Partial<Record<keyof BusinessEnquiryFormData, string>>;

function validate(data: BusinessEnquiryFormData): Errors {
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
  return errors;
}

export default function BusinessEnquiryForm({ onNavigate }: BusinessEnquiryFormProps) {
  const [form, setForm] = useState<BusinessEnquiryFormData>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof BusinessEnquiryFormData]) {
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
        type: 'business',
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim() || null,
        address: form.address.trim(),
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
        <SuccessModal type="business" onClose={() => onNavigate('home')} />
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
              Business Opportunity
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-800 text-white mb-3">
              Business Enquiry
            </h1>
            <p className="text-muted text-base leading-relaxed">
              Interested in joining Tcoons International as an AWPL business partner?
              Fill in your details and we'll connect with you.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-6 sm:p-8 space-y-5 animate-fade-in-up animate-delay-100"
          >
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
                  <span>Submit Business Enquiry</span>
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
