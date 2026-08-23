import { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Page } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface ContentManagementPageProps {
  onNavigate: (page: Page) => void;
}

interface ContentItem {
  id: string;
  key: string;
  value: string;
  section: string;
}

const SECTIONS = {
  hero: 'Hero Section',
  stats: 'Statistics',
  offer: 'What We Offer Section',
  journey: 'Start Your Journey Section',
  footer: 'Footer',
};

export default function ContentManagementPage({ onNavigate }: ContentManagementPageProps) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      const { data, error: err } = await supabase
        .from('homepage_content')
        .select('*')
        .order('section', { ascending: true })
        .order('key', { ascending: true });

      if (err) throw err;
      setContent(data || []);
    } catch (err) {
      setError('Failed to load content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(item: ContentItem) {
    setSaving(true);
    setError('');
    try {
      const { error: err } = await supabase
        .from('homepage_content')
        .update({ value: item.value, updated_at: new Date().toISOString() })
        .eq('id', item.id);

      if (err) throw err;

      setSuccess('Content updated successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to save content');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function handleChange(id: string, value: string) {
    setContent((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item))
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const groupedContent = Object.entries(SECTIONS).reduce(
    (acc, [key, label]) => {
      acc[key] = {
        label,
        items: content.filter((item) => item.section === key),
      };
      return acc;
    },
    {} as Record<string, { label: string; items: ContentItem[] }>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => onNavigate('admin')}
          className="flex items-center gap-2 text-muted hover:text-white text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Admin
        </button>

        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-800 text-white mb-3">
            Homepage Content Management
          </h1>
          <p className="text-muted text-base">
            Customize your homepage content. Changes appear immediately on the public site.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-400/10 border border-red-400/30 rounded-xl p-4">
            <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-400/10 border border-green-400/30 rounded-xl text-green-300 text-sm">
            {success}
          </div>
        )}

        <div className="space-y-8">
          {Object.entries(groupedContent).map(([sectionKey, { label, items }]) => (
            <div key={sectionKey} className="glass rounded-2xl p-6 border-subtle">
              <h2 className="font-display font-700 text-white text-lg mb-6">{label}</h2>

              <div className="space-y-5">
                {items.map((item) => (
                  <div key={item.id} className="bg-white/5 rounded-xl p-4">
                    <label className="text-xs font-medium text-[#E8B86D] uppercase tracking-wide mb-2 block">
                      {item.key.replace(/_/g, ' ')}
                    </label>

                    {item.key.includes('title') || item.key.includes('cta') ? (
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => handleChange(item.id, e.target.value)}
                        className="input-dark w-full px-4 py-3 rounded-lg text-sm mb-3"
                        placeholder="Enter text"
                      />
                    ) : (
                      <textarea
                        value={item.value}
                        onChange={(e) => handleChange(item.id, e.target.value)}
                        rows={3}
                        className="input-dark w-full px-4 py-3 rounded-lg text-sm resize-none mb-3"
                        placeholder="Enter text"
                      />
                    )}

                    <button
                      onClick={() => handleSave(item)}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8B86D] text-black rounded-lg text-sm font-medium hover:bg-[#F5C67D] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <LoadingSpinner size={14} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={14} />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
