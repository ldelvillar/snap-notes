"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";

import ContentSkeleton from "@/components/ContentSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
import EyeIcon from "@/assets/Eye";
import EyedClosedIcon from "@/assets/EyeClosed";
import { auth } from "@/config/firebase";
import { useAuth } from "@/context/useGlobalContext";

interface LoginForm {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const ERROR_MESSAGES: { [key: string]: string } = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Invalid email or password.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
};

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect after render to avoid updating Router during render
  useEffect(() => {
    if (user) {
      router.push("/notes");
    }
  }, [user, router]);
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push("/notes");
    } catch (err) {
      if (err instanceof FirebaseError) {
        const errorCode = err?.code as string;
        setError(
          ERROR_MESSAGES[errorCode] || "Failed to login. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }

      // Clear password on error for security
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12 mx-10 md:mx-20">
        <ContentSkeleton lines={3} className="max-w-xl" />
      </div>
    );
  }

  if (user) {
    // User already present: don't render the login form while redirecting
    return null;
  }

  return (
    <section className="min-h-screen bg-[#FFF8F2] py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-black font-bold">Welcome back!</h1>
          <p className="text-sm text-gray-800 mt-2">
            Log in to access your account
          </p>
        </div>

        {error && (
          <div className="mt-12 md:mx-20">
            <ErrorMessage message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all
                                ${
                                  errors.email ? "border-2 border-red-500" : ""
                                }`}
              placeholder="your@email.com"
              disabled={isSubmitting}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-gray-200 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary transition-all
                                    ${
                                      errors.password
                                        ? "border-2 border-red-500"
                                        : ""
                                    }`}
                placeholder="Enter your password"
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyedClosedIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 rounded-lg bg-primary hover:bg-[#E64A35] text-white text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              </div>
            ) : (
              "Login"
            )}
          </button>

          <div className="text-center space-y-4">
            <p className="text-sm">
              New user?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-[#E64A35] transition-colors"
              >
                Register Here
              </Link>
            </p>
            <Link
              href="/"
              className="block text-primary hover:text-[#E64A35] transition-colors"
            >
              Back to home
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
