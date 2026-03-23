'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }[type];

  return (
    <div className="animate-slide-up fixed right-6 bottom-6 z-50">
      <div
        className={`${bgColor} flex max-w-md min-w-[300px] items-center gap-3 rounded-lg px-6 py-4 text-white shadow-lg`}
      >
        <span className="text-xl font-bold">{icon}</span>
        <p className="flex-1">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-white/80 transition-colors hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
