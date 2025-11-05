"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ContentSkeleton from "@/components/ContentSkeleton";
import Toast from "@/components/Toast";
import { useAuth } from "@/context/useGlobalContext";

type Theme = "light" | "dark" | "system";
type FontSize = "small" | "medium" | "large";

export default function GeneralSettingsPage() {
  useEffect(() => {
    document.title = "General Settings | SnapNotes";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", "Manage your general settings on SnapNotes");
  }, []);

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

  const [showToast, setShowToast] = useState(false);

  const resolveTheme = (theme: Theme) => {
    let resolvedTheme = theme;
    if (theme === "system") {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolvedTheme);
  };

  useEffect(() => {
    // Apply theme on mount
    resolveTheme(theme);

    // Set up listener for system theme changes (only when theme is "system")
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleSystemThemeChange = () => {
        resolveTheme("system");
      };

      // Modern browsers
      mediaQuery.addEventListener("change", handleSystemThemeChange);

      // Cleanup
      return () => {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      };
    }
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    resolveTheme(newTheme);
    setShowToast(true);
  };

  const handleFontSizeChange = (newSize: FontSize) => {
    setFontSize(newSize);
    localStorage.setItem("fontSize", newSize);
    setShowToast(true);
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

      <section className="mx-2 max-w-4xl rounded-lg border border-border">
        <div className="p-6">
          {/* Theme Preference */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-text-100">
                Color mode
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      theme === "light"
                        ? "bg-primary/70 border-primary text-white"
                        : "border-border hover:border-gray-500"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      theme === "dark"
                        ? "bg-primary/70 border-primary text-white"
                        : "border-border hover:border-gray-500"
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => handleThemeChange("system")}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      theme === "system"
                        ? "bg-primary/70 border-primary text-white"
                        : "border-border hover:border-gray-500"
                    }`}
                  >
                    System
                  </button>
                </div>
              </div>
            </div>

            {/* Font Size Preference */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-text-100">
                Typography
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleFontSizeChange("small")}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      fontSize === "small"
                        ? "bg-primary/70 border-primary text-white"
                        : "border-border hover:border-gray-500"
                    }`}
                  >
                    <span className="text-sm">Small</span>
                  </button>
                  <button
                    onClick={() => handleFontSizeChange("medium")}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      fontSize === "medium"
                        ? "bg-primary/70 border-primary text-white"
                        : "border-border hover:border-gray-500"
                    }`}
                  >
                    <span className="text-base">Medium</span>
                  </button>
                  <button
                    onClick={() => handleFontSizeChange("large")}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      fontSize === "large"
                        ? "bg-primary/70 border-primary text-white"
                        : "border-border hover:border-gray-500"
                    }`}
                  >
                    <span className="text-lg">Large</span>
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
