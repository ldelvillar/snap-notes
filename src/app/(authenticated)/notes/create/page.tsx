'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import ErrorMessage from '@/components/ErrorMessage';
import PlusIcon from '@/assets/Plus';
import { useAuth } from '@/context/useGlobalContext';
import { useNotes } from '@/context/NotesContext';
import { createNote } from '@/lib/notesService';

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
    title: '',
    text: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Create New Note | SnapNotes';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', 'Create a new note with SnapNotes');

    // Auto-focus the textarea when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.text.trim()) {
      newErrors.text = 'Text is required';
    } else if (formData.text.length > 3000) {
      newErrors.text = 'Text must be less than 3000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createNote(user, formData.title, formData.text);
      refetchNotes();
      router.replace('/notes');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create note. Please try again later.');
      }
      console.error('Error creating note:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <section id="create" className="px-4 py-16 md:px-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-text-200">Create new note</h1>

        {error && (
          <div className="mt-12 md:mx-20">
            <ErrorMessage message={error} />
          </div>
        )}

        <form onSubmit={handleCreateNote} className="mt-8 flex flex-col gap-6">
          <div className="space-y-2">
            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full border-b border-border p-2 text-text-100 transition-colors focus:border-primary focus:outline-none ${
                errors.title ? 'border-red-500' : ''
              }`}
            />
            {errors.title && (
              <p
                className="text-sm text-red-500"
                role="alert"
                aria-live="polite"
              >
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="text" className="sr-only">
              Text
            </label>
            <textarea
              ref={textareaRef}
              id="text"
              name="text"
              placeholder="Start typing..."
              value={formData.text}
              onChange={handleChange}
              required
              rows={6}
              disabled={isSubmitting}
              className={`w-full rounded-lg border border-border p-3 text-text-100 transition-colors focus:border-primary focus:outline-none ${
                errors.text ? 'border-red-500' : ''
              }`}
            />
            {errors.text && (
              <p
                role="alert"
                aria-live="polite"
                className="text-sm text-red-500"
              >
                {errors.text}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-primary px-10 py-4 text-lg font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
            disabled={isSubmitting}
          >
            <div className="flex flex-row items-center justify-center gap-2">
              {isSubmitting ? (
                <div
                  className="size-5 animate-spin rounded-full border-b-2 border-white"
                  role="status"
                  aria-label="Creating note"
                />
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
