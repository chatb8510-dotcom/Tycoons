import { useState } from 'react';
import { ArrowLeft, Send, CheckCircle, User, Phone, Mail, MapPin, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Page, REQUIREMENT_TYPES } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface CustomerRequirementPageProps {
  onNavigate: (page: Page) => void;
}

export default function CustomerRequirementPage({ onNavigate }: CustomerRequirementPageProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    city: '',
    requirement_type: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!formData.customer_name.trim()) newErrors.customer_name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(formData.phone.trim()))
      newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!formData.requirement_type) newErrors.requirement_type = 'Please select a requirement type';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    submitEnquiry();
  }

  async function submitEnquiry() {
    try {
      const { error } = await supabase.from('requirement_enquiries').insert({
        customer_name: formData.customer_name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        city: formData.city.trim() || null,
        requirement_type: formData.requirement_type,
        message: formData.message.trim() || null,
        status: 'new',
      });

      if (error) throw error;

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting requirement:', err);
      setErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center border-subtle">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h2 className="font-display text-2xl font-700 text-white mb-3">Requirement Submitted!</h2>
          <p className="text-muted mb-6">
            Thank you for sharing your requirements. Our wellness experts will contact you with personalized recommendations.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-3 gold-gradient rounded-xl text-black font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080808] via-[#0a0a0a] to-[#080808] pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-muted hover:text-white text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-[#E8B86D] mb-4 border-subtle">
            <FileText size={14} />
            Share Your Needs
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-800 text-white mb-3">
            Tell Us Your Requirements
          </h1>
          <p className="text-muted text-lg">
            Let us know what you need and our experts will guide you with personalized wellness solutions
          </p>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-6 sm:p-8 border-subtle">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#cccccc] mb-1.5">
                <User size={14} />
                Name *
              </label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) =>
                  setFormData({ ...formData, customer_name: e.target.value })
                }
                className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                placeholder="Your full name"
              />
              {errors.customer_name && (
                <p className="text-red-400 text-xs mt-1">{errors.customer_name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#cccccc] mb-1.5">
                <Phone size={14} />
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                placeholder="10-digit mobile number"
                maxLength={10}
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#cccccc] mb-1.5">
                <Mail size={14} />
                Email (optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                placeholder="your@email.com"
              />
            </div>

            {/* City */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#cccccc] mb-1.5">
                <MapPin size={14} />
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                placeholder="Your city"
              />
            </div>

            {/* Requirement Type */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#cccccc] mb-2">
                <FileText size={14} />
                Requirement Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {REQUIREMENT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, requirement_type: type })
                    }
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      formData.requirement_type === type
                        ? 'gold-gradient text-black'
                        : 'glass text-muted hover:text-white border-subtle'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {errors.requirement_type && (
                <p className="text-red-400 text-xs mt-2">{errors.requirement_type}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-[#cccccc] mb-1.5">
                Message / Additional Details
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={4}
                className="input-dark w-full px-4 py-3 rounded-lg text-sm resize-none"
                placeholder="Tell us more about your requirements, health goals, or any specific questions..."
              />
            </div>

            {errors.submit && (
              <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-3">
                <p className="text-red-300 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 gold-gradient rounded-xl text-black font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size={16} />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Requirement
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
