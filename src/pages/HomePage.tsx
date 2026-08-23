import { Briefcase, ShoppingBag, Award, Users, Globe, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const stats = [
  { value: '100+', label: 'Premium Products' },
  { value: '15+', label: 'Product Categories' },
  { value: 'PAN India', label: 'Network Reach' },
  { value: 'AWPL', label: 'Certified Partner' },
];

const features = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Ayurveda-inspired formulations crafted with natural ingredients and modern science.',
  },
  {
    icon: Users,
    title: 'Growing Network',
    description: 'Join a thriving community of wellness entrepreneurs across India.',
  },
  {
    icon: Globe,
    title: 'Wide Reach',
    description: 'Access to a vast distribution network spanning the entire country.',
  },
  {
    icon: Shield,
    title: 'Trusted Brand',
    description: 'Backed by Asclepius Wellness Pvt Ltd, a company with strong market presence.',
  },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20"
        style={{ background: '#080808' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,184,109,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(232,184,109,0.2), transparent)' }}
        />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8 animate-fade-in-up">
            <img
              src="/photo.jpg"
              alt="Tcoons International Logo"
              className="h-32 sm:h-40 mx-auto mb-8 drop-shadow-2xl object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-medium text-[#E8B86D] mb-8 border-subtle animate-fade-in-up">
            <Sparkles size={12} />
            Official AWPL Business Associate
          </div>

          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 text-white mb-6 animate-fade-in-up animate-delay-100 leading-[1.05]"
          >
            Welcome to
            <span className="block gold-text">Tcoons International</span>
          </h1>

          <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up animate-delay-200">
            Your trusted partner for AWPL wellness products and business opportunities.
            Build a healthier life while building a profitable future.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-300">
            <button
              onClick={() => onNavigate('business-enquiry')}
              className="btn-gold px-8 py-4 rounded-xl text-sm w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Briefcase size={16} />
              <span>Business Enquiry</span>
            </button>
            <button
              onClick={() => onNavigate('product-enquiry')}
              className="glass px-8 py-4 rounded-xl text-sm text-white w-full sm:w-auto flex items-center justify-center gap-2 hover:bg-white/8 transition-all duration-200 border border-white/10 hover:border-white/20"
            >
              <ShoppingBag size={16} />
              <span>Product Enquiry</span>
            </button>
          </div>
        </div>

        <div className="relative mt-24 w-full max-w-5xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up animate-delay-400">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-5 text-center border-subtle">
                <div className="font-display text-2xl sm:text-3xl font-800 gold-text mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="py-20 px-4" style={{ background: '#0a0a0a' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-4">
              What We Offer
            </h2>
            <p className="text-muted max-w-xl mx-auto text-base">
              Tcoons International bridges the gap between quality wellness products and
              life-changing business opportunities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass rounded-2xl p-6 hover-lift border-subtle group"
              >
                <div className="w-10 h-10 rounded-xl bg-[rgba(232,184,109,0.1)] flex items-center justify-center mb-4 group-hover:bg-[rgba(232,184,109,0.16)] transition-colors">
                  <feature.icon size={18} className="text-[#E8B86D]" />
                </div>
                <h3 className="font-display font-700 text-white text-lg mb-2">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4" style={{ background: '#080808' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-700 text-white mb-4">
              Start Your Journey
            </h2>
            <p className="text-muted max-w-xl mx-auto text-base">
              Whether you're looking for premium wellness products or a profitable business opportunity,
              we have the right path for you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-8 hover-lift border-subtle group cursor-pointer" onClick={() => onNavigate('business-enquiry')}>
              <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center mb-6">
                <Briefcase size={20} className="text-black" />
              </div>
              <h3 className="font-display font-700 text-white text-xl mb-3">Business Enquiry</h3>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Join us as a business associate and build your own wellness empire with AWPL's
                proven direct selling model and comprehensive product portfolio.
              </p>
              <div className="flex items-center gap-2 text-[#E8B86D] text-sm font-medium group-hover:gap-3 transition-all">
                Get Started
                <ArrowRight size={16} />
              </div>
            </div>

            <div className="glass rounded-2xl p-8 hover-lift border-subtle group cursor-pointer" onClick={() => onNavigate('product-enquiry')}>
              <div className="w-12 h-12 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center mb-6">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <h3 className="font-display font-700 text-white text-xl mb-3">Product Enquiry</h3>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Explore 100+ premium AWPL products across wellness, cosmetics, agriculture,
                home care, and more. Find products tailored to your needs.
              </p>
              <div className="flex items-center gap-2 text-[#E8B86D] text-sm font-medium group-hover:gap-3 transition-all">
                Explore Products
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-subtle py-10 px-4" style={{ background: '#080808' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-display font-700 text-white">Tcoons International</div>
            <div className="text-xs text-muted mt-1">Authorized AWPL Business Associate</div>
          </div>
          <div className="text-xs text-muted text-center sm:text-right">
            <div>In partnership with Asclepius Wellness Pvt Ltd</div>
            <div className="mt-1">© {new Date().getFullYear()} All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
