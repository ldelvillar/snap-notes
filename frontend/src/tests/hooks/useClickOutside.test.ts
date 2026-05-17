import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';

function dispatchMouseDown(target: Element) {
  target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
}

describe('useClickOutside', () => {
  const cleanup: Element[] = [];

  afterEach(() => {
    cleanup.forEach(el => el.remove());
    cleanup.length = 0;
  });

  it('fires handler when clicking outside the ref', () => {
    const handler = vi.fn();
    const inside = document.createElement('div');
    const outside = document.createElement('div');
    document.body.append(inside, outside);
    cleanup.push(inside, outside);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(inside);
      useClickOutside(ref, handler);
    });

    dispatchMouseDown(outside);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not fire when clicking inside the ref', () => {
    const handler = vi.fn();
    const inside = document.createElement('div');
    const child = document.createElement('span');
    inside.appendChild(child);
    document.body.appendChild(inside);
    cleanup.push(inside);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(inside);
      useClickOutside(ref, handler);
    });

    dispatchMouseDown(child);
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not attach the listener when enabled is false', () => {
    const handler = vi.fn();
    const inside = document.createElement('div');
    const outside = document.createElement('div');
    document.body.append(inside, outside);
    cleanup.push(inside, outside);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(inside);
      useClickOutside(ref, handler, false);
    });

    dispatchMouseDown(outside);
    expect(handler).not.toHaveBeenCalled();
  });
});
