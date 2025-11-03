"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import ErrorMessage from "@/components/ErrorMessage";
import PlusIcon from "@/assets/Plus";
import { useAuth } from "@/context/useGlobalContext";
import { useNotes } from "@/context/NotesContext";
import { createNote } from "@/lib/notesService";

interface NoteFormData {
  title: string;
  text: string;
}

interface FormErrors {
  title?: string;
  text?: string;
}

export default function CreateNotePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { refetchNotes } = useNotes();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [formData, setFormData] = useState<NoteFormData>({
    title: "",
    text: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Create New Note | SnapNotes";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", "Create a new note with SnapNotes");

    // Auto-focus the textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.text.trim()) {
      newErrors.text = "Text is required";
    } else if (formData.text.length > 3000) {
      newErrors.text = "Text must be less than 3000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createNote(user, e, formData.title, formData.text);
      refetchNotes(); // Refetch notes to update sidebar
      router.replace("/notes");
    } catch (err) {
      setError("Failed to create note. Please try again later.");
      console.error("Error creating note:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <section id="create" className="mt-12 mx-10 md:mx-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl text-gray-200 font-bold">Create New Note</h1>

        {error && (
          <div className="mt-12 md:mx-20">
            <ErrorMessage message={error} />
          </div>
        )}

        <form onSubmit={handleCreateNote} className="flex flex-col gap-6 mt-8">
          <div className="space-y-2">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full text-gray-100 border-b border-gray-200 p-2 placeholder:text-gray-100 focus:outline-none focus:border-primary transition-colors
                                ${errors.title ? "border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <textarea
              ref={textareaRef}
              name="text"
              placeholder="Start typing..."
              value={formData.text}
              onChange={handleChange}
              required
              rows={6}
              className={`w-full text-gray-100 border border-gray-200 rounded-lg p-3 placeholder:text-gray-100 focus:outline-none focus:border-primary transition-colors
                                ${errors.text ? "border-red-500" : ""}`}
              disabled={isSubmitting}
            />
            {errors.text && (
              <p className="text-red-500 text-sm">{errors.text}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-10 py-4 mt-6 text-white text-lg font-medium bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            <div className="flex flex-row items-center justify-center gap-2">
              {isSubmitting ? (
                <div className="animate-spin size-5 border-b-2 border-white rounded-full" />
              ) : (
                <>
                  <PlusIcon /> Create Note
                </>
              )}
            </div>
          </button>
        </form>
      </div>
    </section>
  );
}
