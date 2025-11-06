"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import ErrorMessage from "@/components/ErrorMessage";
import { auth, db } from "@/config/firebase";

interface SignupForm {
  fname: string;
  lname: string;
  phone: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const INITIAL_FORM_STATE: SignupForm = {
  fname: "",
  lname: "",
  phone: "",
  email: "",
  password: "",
  repeatPassword: "",
};

const ERROR_MESSAGES: { [key: string]: string } = {
  "auth/email-already-in-use": "This email is already registered.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/operation-not-allowed": "Email/password accounts are not enabled.",
  "auth/weak-password": "Password is too weak. Please use a stronger password.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupForm>(INITIAL_FORM_STATE);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Register | SnapNotes";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Create a new account on Snap Notes to start taking and organizing your notes."
      );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.fname || !formData.lname) {
      setError("First and last name are required");
      return false;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.phone && !formData.phone.match(/^\+?[\d\s-]{10,}$/)) {
      setError("Please enter a valid phone number");
      return false;
    }

    if (!formData.password || formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (formData.password !== formData.repeatPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: formData.fname,
          lastName: formData.lname,
          phone: formData.phone,
          photo: "",
        });
      }
      router.push("/notes");
    } catch (err) {
      if (err instanceof FirebaseError) {
        const errorCode = err.code as string;
        setError(
          ERROR_MESSAGES[errorCode] || "Failed to register. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="login" className="pt-20 pb-8 px-4 min-h-screen text-white">
      <h1 className="text-4xl text-gray-100 font-bold text-center">
        Get started
      </h1>
      <p className="text-sm text-gray-200 text-center pt-1">
        by creating a free account
      </p>

      <form className="mt-6 mx-auto max-w-3xl" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative flex flex-col mb-3">
            <label htmlFor="fname">First name*</label>
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              className="py-2 border-b border-primary focus:outline-none"
              placeholder="First name"
              required
              disabled={isLoading}
            />
          </div>
          <div className="relative flex flex-col mb-3">
            <label htmlFor="lname">Last name*</label>
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              className="py-2 border-b border-primary focus:outline-none"
              placeholder="Last name"
              required
              disabled={isLoading}
            />
          </div>
          <div className="relative flex flex-col mb-3">
            <label htmlFor="phone">Phone number</label>
            <input
              type="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="py-2 border-b border-primary focus:outline-none"
              placeholder="Phone number"
              disabled={isLoading}
            />
          </div>
          <div className="relative flex flex-col mb-3">
            <label htmlFor="email">Email address*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="py-2 border-b border-primary focus:outline-none"
              placeholder="Your email"
              required
              disabled={isLoading}
            />
          </div>
          <div className="relative flex flex-col mb-3">
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="py-2 border-b border-primary focus:outline-none"
              placeholder="Password"
              required
              disabled={isLoading}
            />
          </div>
          <div className="relative flex flex-col mb-3">
            <label htmlFor="repeat-password">Repeat Password*</label>
            <input
              type="password"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleChange}
              className="py-2 border-b border-primary focus:outline-none"
              placeholder="Repeat password"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex flex-row items-center gap-3">
          <input
            type="checkbox"
            id="check"
            required
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary
                            cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          />
          <label
            htmlFor="check"
            className="text-xs text-gray-600 cursor-pointer"
          >
            By checking the box you agree to our{" "}
            <Link
              href="/terms-of-service"
              className="text-primary hover:underline"
            >
              terms and conditions
            </Link>
            .
          </label>
        </div>
        {error && (
          <div className="mt-12 md:mx-20">
            <ErrorMessage message={error} />
          </div>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-lg font-semibold mt-10"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
        <p className="text-center mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Login here
          </Link>
        </p>
      </form>
    </section>
  );
}
