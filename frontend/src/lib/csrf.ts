const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

let tokenPromise: Promise<string> | null = null;

export function getCsrfToken(): Promise<string> {
  if (!tokenPromise) {
    tokenPromise = fetch(`${API_URL}/auth/csrf-token`, {
      credentials: 'include',
    })
      .then(r => r.json())
      .then((data: { csrfToken: string }) => data.csrfToken)
      .catch(err => {
        tokenPromise = null;
        throw err;
      });
  }
  return tokenPromise;
}

export function resetCsrfToken(): void {
  tokenPromise = null;
}
