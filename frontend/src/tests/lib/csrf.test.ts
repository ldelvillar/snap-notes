import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getCsrfToken, resetCsrfToken } from '@/lib/csrf';

function mockFetch(...responses: Array<{ csrfToken: string } | Error>) {
  const fn = vi.fn();
  for (const r of responses) {
    if (r instanceof Error) {
      fn.mockRejectedValueOnce(r);
    } else {
      fn.mockResolvedValueOnce({ json: () => Promise.resolve(r) });
    }
  }
  vi.stubGlobal('fetch', fn);
  return fn;
}

describe('getCsrfToken', () => {
  beforeEach(() => {
    resetCsrfToken();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches the token on first call', async () => {
    const fetchMock = mockFetch({ csrfToken: 'token-1' });

    const token = await getCsrfToken();

    expect(token).toBe('token-1');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('returns the cached token on subsequent calls without re-fetching', async () => {
    const fetchMock = mockFetch({ csrfToken: 'token-1' });

    await getCsrfToken();
    const token = await getCsrfToken();

    expect(token).toBe('token-1');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('re-fetches after resetCsrfToken()', async () => {
    const fetchMock = mockFetch({ csrfToken: 'token-1' }, { csrfToken: 'token-2' });

    const first = await getCsrfToken();
    resetCsrfToken();
    const second = await getCsrfToken();

    expect(first).toBe('token-1');
    expect(second).toBe('token-2');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('clears the cache when fetch rejects so a subsequent call retries', async () => {
    const fetchMock = mockFetch(new Error('network'), { csrfToken: 'token-1' });

    await expect(getCsrfToken()).rejects.toThrow('network');
    const token = await getCsrfToken();

    expect(token).toBe('token-1');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
