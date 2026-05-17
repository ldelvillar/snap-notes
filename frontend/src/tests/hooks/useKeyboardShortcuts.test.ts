import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const pushMock = vi.fn();
const authState: { user: { id: string } | null } = { user: null };

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/context/useGlobalContext', () => ({
  useAuth: () => ({ user: authState.user }),
}));

function pressKey(init: KeyboardEventInit) {
  window.dispatchEvent(new KeyboardEvent('keydown', init));
}

describe('useKeyboardShortcuts', () => {
  beforeEach(() => {
    pushMock.mockClear();
    authState.user = null;
  });

  it('dispatches toggle-search event on Ctrl+K', () => {
    const listener = vi.fn();
    window.addEventListener('toggle-search', listener);
    renderHook(() => useKeyboardShortcuts());

    pressKey({ key: 'k', ctrlKey: true });

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener('toggle-search', listener);
  });

  it('navigates to /notes/create on Ctrl+Alt+N when user is logged in', () => {
    authState.user = { id: 'u1' };
    renderHook(() => useKeyboardShortcuts());

    pressKey({ key: 'n', ctrlKey: true, altKey: true });

    expect(pushMock).toHaveBeenCalledWith('/notes/create');
  });

  it('does not navigate on Ctrl+Alt+N when user is not logged in', () => {
    authState.user = null;
    renderHook(() => useKeyboardShortcuts());

    pressKey({ key: 'n', ctrlKey: true, altKey: true });

    expect(pushMock).not.toHaveBeenCalled();
  });

  it('dispatches save-note event on Ctrl+S', () => {
    const listener = vi.fn();
    window.addEventListener('save-note', listener);
    renderHook(() => useKeyboardShortcuts());

    pressKey({ key: 's', ctrlKey: true });

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener('save-note', listener);
  });
});
