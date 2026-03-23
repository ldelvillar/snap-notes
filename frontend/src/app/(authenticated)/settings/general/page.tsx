'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import ContentSkeleton from '@/components/ContentSkeleton';
import Toast from '@/components/Toast';
import { useAuth } from '@/context/useGlobalContext';

type Theme = 'light' | 'dark' | 'system';
type Font = 'default' | 'roboto';

export default function GeneralSettingsPage() {
  useEffect(() => {
    document.title = 'General Settings | SnapNotes';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', 'Manage your general settings on SnapNotes');
  }, []);

  const { user, loading } = useAuth();
  const router = useRouter();

  // Initialize state with localStorage values
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  const [font, setFont] = useState<Font>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('font') as Font) || 'default';
    }
    return 'default';
  });

  const [showToast, setShowToast] = useState(false);

  const resolveTheme = (theme: Theme) => {
    let resolvedTheme = theme;
    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolvedTheme);
  };

  useEffect(() => {
    // Apply theme on mount
    resolveTheme(theme);

    // Set up listener for system theme changes (only when theme is "system")
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleSystemThemeChange = () => {
        resolveTheme('system');
      };

      // Modern browsers
      mediaQuery.addEventListener('change', handleSystemThemeChange);

      // Cleanup
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    resolveTheme(newTheme);
    setShowToast(true);
  };

  const handleFontChange = (newFont: Font) => {
    setFont(newFont);
    localStorage.setItem('font', newFont);
    window.dispatchEvent(new Event('fontChange'));
    setShowToast(true);
  };

  if (loading) return <ContentSkeleton lines={3} />;

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <Toast
          message="Settings saved successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <section className="max-w-4xl rounded-lg border border-border">
        <div className="p-6">
          {/* Theme preference */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-text-100">
                Color mode
              </h2>
              <div className="flex flex-col gap-2">
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`rounded-lg border px-4 py-2 transition-all ${
                      theme === 'light'
                        ? 'border-primary bg-primary/70 text-white'
                        : 'border-border hover:border-gray-500'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`rounded-lg border px-4 py-2 transition-all ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/70 text-white'
                        : 'border-border hover:border-gray-500'
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => handleThemeChange('system')}
                    className={`rounded-lg border px-4 py-2 transition-all ${
                      theme === 'system'
                        ? 'border-primary bg-primary/70 text-white'
                        : 'border-border hover:border-gray-500'
                    }`}
                  >
                    System
                  </button>
                </div>
              </div>
            </div>

            {/* Font family preference */}
            <div className="space-y-3 border-t border-border pt-4">
              <h2 className="text-lg font-semibold text-text-100">
                Typography
              </h2>
              <div className="flex flex-col gap-2">
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => handleFontChange('default')}
                    className={`rounded-lg border px-4 py-2 transition-all ${
                      font === 'default'
                        ? 'border-primary bg-primary/70 text-white'
                        : 'border-border hover:border-gray-500'
                    }`}
                  >
                    <span className="font-onest">Default</span>
                  </button>

                  <button
                    onClick={() => handleFontChange('roboto')}
                    className={`rounded-lg border px-4 py-2 transition-all ${
                      font === 'roboto'
                        ? 'border-primary bg-primary/70 text-white'
                        : 'border-border hover:border-gray-500'
                    }`}
                  >
                    <span className="font-roboto">Roboto</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
