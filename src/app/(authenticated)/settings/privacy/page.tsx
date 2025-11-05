"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import ContentSkeleton from "@/components/ContentSkeleton";
import Toast from "@/components/Toast";
import { useAuth } from "@/context/useGlobalContext";

export default function PrivacyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Initialize state with localStorage values
  const [shareAnalytics, setShareAnalytics] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("shareAnalytics") === "true";
    }
    return false;
  });

  const [marketingEmails, setMarketingEmails] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("marketingEmails") === "true";
    }
    return false;
  });

  const [shareDataWithPartners, setShareDataWithPartners] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("shareDataWithPartners") === "true";
    }
    return false;
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    document.title = "Privacy Settings | SnapNotes";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Manage your privacy and data settings on SnapNotes"
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
    localStorage.setItem("shareAnalytics", String(shareAnalytics));
    localStorage.setItem("marketingEmails", String(marketingEmails));
    localStorage.setItem(
      "shareDataWithPartners",
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

  if (loading) {
    return (
      <div className="mt-12 mx-10 md:mx-20">
        <ContentSkeleton lines={3} />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
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

      <section className="mx-2 max-w-4xl rounded-lg border border-border">
        <div className="p-6">
          <div className="space-y-6">
            {/* Privacy Policy Link */}
            <div className="p-4 bg-gray-800/50 rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-text-100 mb-2">
                Privacy Policy
              </h3>
              <p className="text-sm text-text-400 mb-3">
                Learn about how we collect, use, and protect your data
              </p>
              <Link
                href="/privacy-policy"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors underline"
              >
                Read our Privacy Policy
                <svg
                  className="w-4 h-4"
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
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-text-100">
                Data Collection
              </h3>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-lg hover:bg-gray-800/30 transition-colors">
                <div className="flex-1">
                  <h4 className="text-text-100 mb-1">Share Analytics Data</h4>
                  <p className="text-sm text-text-400">
                    Help us improve SnapNotes by sharing anonymous usage data
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareAnalytics}
                    onChange={(e) =>
                      handleShareAnalyticsChange(e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Marketing Emails */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-lg hover:bg-gray-800/30 transition-colors">
                <div className="flex-1">
                  <h4 className="text-text-100 mb-1">Marketing Emails</h4>
                  <p className="text-sm text-text-400">
                    Receive updates about new features and special offers
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingEmails}
                    onChange={(e) =>
                      handleMarketingEmailsChange(e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            {/* Data Sharing */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-text-100">
                Data Sharing
              </h3>

              {/* Share with Partners */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-lg hover:bg-gray-800/30 transition-colors">
                <div className="flex-1">
                  <h4 className="text-text-100 mb-1">
                    Share Data with Partners
                  </h4>
                  <p className="text-sm text-text-400">
                    Allow trusted partners to access anonymized usage data for
                    analytics
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareDataWithPartners}
                    onChange={(e) => handleShareDataChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 w-full flex flex-col md:flex-row items-center justify-between gap-3 border-t border-border">
              <button
                onClick={handleResetToDefault}
                disabled={!hasChanges}
                className="px-4 py-2 text-text-300 border border-border rounded-lg hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/50 active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:active:scale-100"
              >
                Do not share any data
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:active:scale-100"
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
