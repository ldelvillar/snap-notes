"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ContentSkeleton from "@/components/ContentSkeleton";
import Toast from "@/components/Toast";
import { useAuth } from "@/context/useGlobalContext";

type Theme = "light" | "dark" | "system";
type FontSize = "small" | "medium" | "large";

export default function GeneralPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Initialize state with localStorage values
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "system";
    }
    return "system";
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("fontSize") as FontSize) || "medium";
    }
    return "medium";
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    document.title = "General Settings | SnapNotes";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", "Manage your general settings on SnapNotes");
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setHasChanges(true);
  };

  const handleFontSizeChange = (newSize: FontSize) => {
    setFontSize(newSize);
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save preferences to localStorage
    localStorage.setItem("theme", theme);
    localStorage.setItem("fontSize", fontSize);
    setHasChanges(false);

    // Show success toast
    setShowToast(true);
  };

  const handleReset = () => {
    setTheme("system");
    setFontSize("medium");
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
          message="Settings saved successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <section className="mx-2 max-w-4xl rounded-lg border border-[#4d4d4d]">
        <div className="p-6">
          {/* Theme Preference */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-100">
                Appearance
              </h3>
              <div className="flex flex-col gap-2">
                <h4 className="text-gray-100">Theme</h4>
                <p className="text-sm text-gray-400">
                  Select your preferred color scheme
                </p>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      theme === "light"
                        ? "bg-primary/70 border-primary text-white"
                        : "border-[#4d4d4d] hover:border-gray-500"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      theme === "dark"
                        ? "bg-primary/70 border-primary text-white"
                        : "border-[#4d4d4d] hover:border-gray-500"
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => handleThemeChange("system")}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      theme === "system"
                        ? "bg-primary/70 border-primary text-white"
                        : "border-[#4d4d4d] hover:border-gray-500"
                    }`}
                  >
                    System
                  </button>
                </div>
              </div>
            </div>

            {/* Font Size Preference */}
            <div className="space-y-3 pt-4 border-t border-[#4d4d4d]">
              <h3 className="text-lg font-semibold text-gray-100">
                Typography
              </h3>
              <div className="flex flex-col gap-2">
                <h4 className="text-gray-100">Font Size</h4>
                <p className="text-sm text-gray-400">
                  Choose your preferred reading size
                </p>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleFontSizeChange("small")}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      fontSize === "small"
                        ? "bg-primary/70 border-primary text-white"
                        : "border-[#4d4d4d] hover:border-gray-500"
                    }`}
                  >
                    <span className="text-sm">Small</span>
                  </button>
                  <button
                    onClick={() => handleFontSizeChange("medium")}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      fontSize === "medium"
                        ? "bg-primary/70 border-primary text-white"
                        : "border-[#4d4d4d] hover:border-gray-500"
                    }`}
                  >
                    <span className="text-base">Medium</span>
                  </button>
                  <button
                    onClick={() => handleFontSizeChange("large")}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      fontSize === "large"
                        ? "bg-primary/70 border-primary text-white"
                        : "border-[#4d4d4d] hover:border-gray-500"
                    }`}
                  >
                    <span className="text-lg">Large</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 w-full flex flex-col md:flex-row items-center justify-between gap-3 border-t border-[#4d4d4d]">
              <button
                onClick={handleReset}
                disabled={!hasChanges}
                className="px-4 py-2 text-gray-300 border border-[#4d4d4d] rounded-lg hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/50 active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#4d4d4d] disabled:active:scale-100"
              >
                Reset to defaults
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
