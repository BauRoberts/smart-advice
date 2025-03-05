// Check if code is running in browser environment
const isBrowser = typeof window !== 'undefined';

// Session token key in localStorage
const SESSION_TOKEN_KEY = 'smart_advice_session_id';

// Get session ID from localStorage
export function getSessionId(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

// Set session ID in localStorage
export function setSessionId(sessionId: string): void {
  if (!isBrowser) return;
  localStorage.setItem(SESSION_TOKEN_KEY, sessionId);
}

// Check if session exists
export function hasSession(): boolean {
  return !!getSessionId();
}

// Create a new session via API
export async function createSession(): Promise<string> {
  const response = await fetch('/api/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!data.success || !data.sessionId) {
    throw new Error('Failed to create session');
  }
  
  setSessionId(data.sessionId);
  return data.sessionId;
}

// Get or create session
export async function getOrCreateSession(): Promise<string> {
  const existingSessionId = getSessionId();
  
  if (existingSessionId) {
    return existingSessionId;
  }
  
  return await createSession();
}