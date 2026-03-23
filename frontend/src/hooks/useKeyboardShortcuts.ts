import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/useGlobalContext';

export const useKeyboardShortcuts = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        window.dispatchEvent(
          new CustomEvent('toggle-search', { bubbles: true })
        );
      }

      // Cmd/Ctrl + Alt + N: New note
      if ((e.metaKey || e.ctrlKey) && e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (user) {
          router.push('/notes/create');
        }
      }

      // Cmd/Ctrl + S: Save (handled by component)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        // Dispatch custom event that components can listen to
        window.dispatchEvent(new CustomEvent('save-note', { bubbles: true }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, user]);
};
