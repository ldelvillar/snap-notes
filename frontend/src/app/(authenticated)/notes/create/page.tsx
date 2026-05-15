'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ErrorMessage from '@/components/ErrorMessage';
import PlusIcon from '@/assets/Plus';
import HalfArrow from '@/assets/HalfArrow';
import { useAuth } from '@/context/useGlobalContext';
import { useNotes } from '@/context/NotesContext';
import { createNote, noteToListItem } from '@/lib/notesService';

const TEXT_MAX = 10000;
const TITLE_MAX = 200;

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
  const { mutateNotes } = useNotes();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [formData, setFormData] = useState<NoteFormData>({ title: '', text: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Create Note | SnapNotes';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', 'Create a new note with SnapNotes');
    textareaRef.current?.focus();
  }, []);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${el.scrollHeight}px`;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (formData.title.length > TITLE_MAX)
      newErrors.title = `Title must be less than ${TITLE_MAX} characters`;
    if (!formData.text.trim()) newErrors.text = 'Note text is required';
    else if (formData.text.length > TEXT_MAX)
      newErrors.text = `Text must be less than ${TEXT_MAX} characters`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'text') resizeTextarea();
    if (errors[name as keyof FormErrors])
      setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!user) { router.push('/login'); return; }

    setIsSubmitting(true);
    setError(null);

    try {
      const newNote = await createNote(user, formData.title, formData.text);
      await mutateNotes(notes => [noteToListItem(newNote), ...notes]);
      router.replace('/notes');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create note. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div
          className="size-8 animate-spin rounded-full border-b-2 border-primary"
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

  const charCount = formData.text.length;
  const charWarning = charCount > TEXT_MAX * 0.9;
  const charOver = charCount > TEXT_MAX;

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 md:px-0">
      {/* Back */}
      <Link
        href="/notes"
        className="mb-8 inline-flex items-center gap-1 text-sm text-text-400 transition-colors hover:text-text-100"
      >
        <HalfArrow className="size-4 rotate-180" />
        Back to notes
      </Link>

      <h1 className="mb-6 text-3xl font-bold text-text-100">New note</h1>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <form onSubmit={handleCreateNote}>
        {/* Card */}
        <div
          className={`rounded-xl border bg-bg-800 shadow-sm transition-colors ${
            errors.title || errors.text ? 'border-red-400/50' : 'border-border'
          }`}
        >
          {/* Title */}
          <div className="px-6 pt-6">
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Note title"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
              maxLength={TITLE_MAX}
              className="w-full bg-transparent text-xl font-semibold text-text-100 placeholder:text-text-400 focus:outline-none disabled:opacity-60"
            />
            {errors.title && (
              <p role="alert" className="mt-1 text-xs text-red-400">
                {errors.title}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="mx-6 my-4 border-b border-border" />

          {/* Text */}
          <div className="px-6 pb-4">
            <textarea
              ref={textareaRef}
              id="text"
              name="text"
              placeholder="Start writing your note..."
              value={formData.text}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full resize-none bg-transparent text-sm leading-relaxed text-text-100 placeholder:text-text-400 focus:outline-none disabled:opacity-60"
              style={{ minHeight: '220px' }}
            />
          </div>

          {/* Card footer */}
          <div className="flex items-center justify-between border-t border-border px-6 py-3">
            <span className="text-xs text-red-400">
              {errors.text ?? ''}
            </span>
            <span
              className={`text-xs tabular-nums transition-colors ${
                charOver
                  ? 'text-red-400'
                  : charWarning
                    ? 'text-amber-500'
                    : 'text-text-400'
              }`}
            >
              {charCount} / {TEXT_MAX}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <Link
            href="/notes"
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-text-300 transition-colors hover:bg-bg-800 hover:text-text-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <div
                className="size-4 animate-spin rounded-full border-b-2 border-white"
                role="status"
                aria-label="Creating note"
              />
            ) : (
              <PlusIcon className="size-4" />
            )}
            {isSubmitting ? 'Creating...' : 'Create note'}
          </button>
        </div>
      </form>
    </section>
  );
}
