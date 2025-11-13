import CrossIcon from '@/assets/Cross';
import { useEffect, useRef } from 'react';

interface KeyboardShortcutsProps {
  setShortcutsOpen: (open: boolean) => void;
}

interface Shortcut {
  action: string;
  keys: string[];
}

const SHORTCUTS: Shortcut[] = [
  { action: 'Open Search', keys: ['Ctrl', 'K'] },
  { action: 'Create New Note', keys: ['Ctrl', 'Alt', 'N'] },
  { action: 'Save Note', keys: ['Ctrl', 'S'] },
];

export default function KeyboardShortcuts({
  setShortcutsOpen,
}: KeyboardShortcutsProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close if clicking on the overlay (outside modal)
      if (overlayRef.current && overlayRef.current === event.target) {
        setShortcutsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShortcutsOpen]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-bg-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-xl font-semibold text-text-100">
            Keyboard Shortcuts
          </h2>
          <button
            className="rounded-lg p-2 transition-colors hover:bg-bg-700"
            onClick={() => setShortcutsOpen(false)}
            aria-label="Close shortcuts"
          >
            <CrossIcon className="size-5 text-text-400 transition-colors hover:text-text-100" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 p-6">
          {SHORTCUTS.map(shortcut => (
            <div
              key={shortcut.action}
              className="flex items-center justify-between rounded-lg bg-bg-900 px-4 py-3 transition-colors hover:bg-bg-700"
            >
              <p className="text-text-200">{shortcut.action}</p>
              <div className="flex gap-2">
                {shortcut.keys.map((key, keyIdx) => (
                  <div key={key} className="flex items-center gap-2">
                    <kbd className="rounded border border-border bg-bg-800 px-2 py-1 text-sm font-medium text-text-100 shadow-sm">
                      {key}
                    </kbd>
                    {keyIdx < shortcut.keys.length - 1 && (
                      <span className="text-xs text-text-400">+</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
