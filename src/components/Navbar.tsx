import { useState, useEffect } from 'react';
import { Menu, X, Zap, ShoppingBag, FileText } from 'lucide-react';
import { Page } from '../types';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { totalItems } = useCart();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { label: 'Home', page: 'home' as Page },
    { label: 'Products', page: 'products' as Page },
    { label: 'My Needs', page: 'customer-requirement' as Page },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-subtle' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-black" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-800 text-white text-sm tracking-wide">TCOONS</span>
              <span className="text-[10px] text-muted tracking-widest uppercase">International</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  currentPage === link.page
                    ? 'gold-text bg-[rgba(232,184,109,0.08)]'
                    : 'text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label === 'My Needs' && <FileText size={14} />}
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={() => onNavigate('cart')}
              className={`relative p-2 rounded-lg transition-all duration-200 ${
                currentPage === 'cart'
                  ? 'gold-text bg-[rgba(232,184,109,0.08)]'
                  : 'text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gold-gradient text-black text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('admin')}
              className="hidden md:block text-xs text-muted hover:text-white border border-subtle hover:border-white/20 px-3 py-1.5 rounded-lg transition-all duration-200"
            >
              Admin
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-muted hover:text-white transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden glass border-t border-subtle animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => { onNavigate(link.page); setMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  currentPage === link.page
                    ? 'gold-text bg-[rgba(232,184,109,0.08)]'
                    : 'text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label === 'My Needs' && <FileText size={14} />}
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { onNavigate('admin'); setMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-muted hover:text-white hover:bg-white/5 transition-all"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
