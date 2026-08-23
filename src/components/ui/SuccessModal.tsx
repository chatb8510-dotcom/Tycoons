import { CheckCircle, X } from 'lucide-react';

interface SuccessModalProps {
  onClose: () => void;
  type: 'business' | 'product';
}

export default function SuccessModal({ onClose, type }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative glass-strong rounded-2xl p-8 max-w-sm w-full text-center animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[rgba(232,184,109,0.12)] flex items-center justify-center">
          <CheckCircle size={32} className="text-[#E8B86D]" />
        </div>

        <h3 className="font-display text-xl font-700 text-white mb-2">
          Enquiry Submitted!
        </h3>
        <p className="text-muted text-sm leading-relaxed mb-6">
          Thank you for your {type === 'business' ? 'business' : 'product'} enquiry.
          Our team will reach out to you shortly.
        </p>

        <button
          onClick={onClose}
          className="btn-gold w-full py-3 rounded-xl text-sm"
        >
          <span>Done</span>
        </button>
      </div>
    </div>
  );
}
