// Check if code is running in browser environment
const isBrowser = typeof window !== 'undefined';

// Session token key in localStorage
const SESSION_TOKEN_KEY = 'smart_advice_session_id';

// Add expiration time to session storage
interface SessionData {
  id: string;
  timestamp: number;
}

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
export function getOrCreateSession(): string {
  // Check for existing session
  const storedSession = localStorage.getItem('session_data');
  
  if (storedSession) {
    const sessionData: SessionData = JSON.parse(storedSession);
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    // Check if session is less than 30 minutes old
    if (now - sessionData.timestamp < thirtyMinutes) {
      return sessionData.id;
    }
  }
  
  // Create new session if none exists or is expired
  const newSession: SessionData = {
    id: crypto.randomUUID(),
    timestamp: Date.now()
  };
  
  localStorage.setItem('session_data', JSON.stringify(newSession));
  return newSession.id;
}

// Add this function to explicitly start a new session
export function startNewSession(): string {
  const newSession: SessionData = {
    id: crypto.randomUUID(),
    timestamp: Date.now()
  };
  
  localStorage.setItem('session_data', JSON.stringify(newSession));
  return newSession.id;
}