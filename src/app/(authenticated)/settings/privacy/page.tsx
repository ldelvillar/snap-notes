'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ContentSkeleton from '@/components/ContentSkeleton';
import Toast from '@/components/Toast';
import { useAuth } from '@/context/useGlobalContext';

export default function PrivacyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Initialize state with localStorage values
  const [shareAnalytics, setShareAnalytics] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('shareAnalytics') === 'true';
    }
    return false;
  });

  const [marketingEmails, setMarketingEmails] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('marketingEmails') === 'true';
    }
    return false;
  });

  const [shareDataWithPartners, setShareDataWithPartners] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('shareDataWithPartners') === 'true';
    }
    return false;
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    document.title = 'Privacy Settings | SnapNotes';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Manage your privacy and data settings on SnapNotes'
      );
  }, []);

  const handleShareAnalyticsChange = (value: boolean) => {
    setShareAnalytics(value);
    setHasChanges(true);
  };

  const handleMarketingEmailsChange = (value: boolean) => {
    setMarketingEmails(value);
    setHasChanges(true);
  };

  const handleShareDataChange = (value: boolean) => {
    setShareDataWithPartners(value);
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save preferences to localStorage
    localStorage.setItem('shareAnalytics', String(shareAnalytics));
    localStorage.setItem('marketingEmails', String(marketingEmails));
    localStorage.setItem(
      'shareDataWithPartners',
      String(shareDataWithPartners)
    );
    setHasChanges(false);

    // Show success toast
    setShowToast(true);
  };

  const handleResetToDefault = () => {
    setShareAnalytics(false);
    setMarketingEmails(false);
    setShareDataWithPartners(false);
    setHasChanges(true);
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
          message="Privacy settings saved successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <section className="max-w-4xl rounded-lg border border-border">
        <div className="p-6">
          <div className="space-y-6">
            {/* Privacy Policy Link */}
            <div className="rounded-lg border border-border bg-gray-800/50 p-4">
              <h2 className="mb-2 text-lg font-semibold text-text-100">
                Privacy Policy
              </h2>
              <p className="mb-3 text-sm text-text-400">
                Learn about how we collect, use, and protect your data
              </p>
              <Link
                href="/privacy-policy"
                className="inline-flex items-center gap-2 text-primary underline transition-colors hover:text-primary/80"
              >
                Read our Privacy Policy
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            </div>

            {/* Data Collection */}
            <div className="space-y-3 border-t border-border pt-4">
              <h2 className="text-lg font-semibold text-text-100">
                Data Collection
              </h2>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4 rounded-lg p-4 transition-colors hover:bg-gray-800/30">
                <div className="flex-1">
                  <h3 className="mb-1 text-text-100">Share Analytics Data</h3>
                  <p className="text-sm text-text-400">
                    Help us improve SnapNotes by sharing anonymous usage data
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={shareAnalytics}
                    onChange={e => handleShareAnalyticsChange(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-700 peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/50 peer-focus:outline-none after:absolute after:start-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
                </label>
              </div>

              {/* Marketing Emails */}
              <div className="flex items-start justify-between gap-4 rounded-lg p-4 transition-colors hover:bg-gray-800/30">
                <div className="flex-1">
                  <h3 className="mb-1 text-text-100">Marketing Emails</h3>
                  <p className="text-sm text-text-400">
                    Receive updates about new features and special offers
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={marketingEmails}
                    onChange={e =>
                      handleMarketingEmailsChange(e.target.checked)
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-700 peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/50 peer-focus:outline-none after:absolute after:start-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
                </label>
              </div>
            </div>

            {/* Data Sharing */}
            <div className="space-y-3 border-t border-border pt-4">
              <h2 className="text-lg font-semibold text-text-100">
                Data Sharing
              </h2>

              {/* Share with Partners */}
              <div className="flex items-start justify-between gap-4 rounded-lg p-4 transition-colors hover:bg-gray-800/30">
                <div className="flex-1">
                  <h3 className="mb-1 text-text-100">
                    Share Data with Partners
                  </h3>
                  <p className="text-sm text-text-400">
                    Allow trusted partners to access anonymized usage data for
                    analytics
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={shareDataWithPartners}
                    onChange={e => handleShareDataChange(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-700 peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/50 peer-focus:outline-none after:absolute after:start-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex w-full flex-col items-center justify-between gap-3 border-t border-border pt-4 md:flex-row">
              <button
                onClick={handleResetToDefault}
                disabled={!hasChanges}
                className="transform rounded-lg border border-border px-4 py-2 text-text-300 transition-colors hover:border-gray-500 focus:ring-2 focus:ring-gray-500/50 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:active:scale-100"
              >
                Do not share any data
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="transform rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary disabled:active:scale-100"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
