// lib/session.ts
// Check if code is running in browser environment
const isBrowser = typeof window !== "undefined";

// Session token keys in localStorage
const SESSION_TOKEN_KEY = "smart_advice_session_id"; // For permanent server-side sessions
const TEMP_SESSION_TOKEN_KEY = "smart_advice_temp_session_id"; // For temporary client-side sessions
const LAST_USED_SESSION_KEY = "last_used_session_id"; // Para la última sesión utilizada

// Session data interface with expiration
interface SessionData {
  id: string;
  timestamp: number;
  isTemporary: boolean;
}

/**
 * Generates a new UUID for temporary client-side sessions
 */
export function generateTempSessionId(): string {
  return crypto.randomUUID();
}

/**
 * Get permanent session ID from localStorage
 */
export function getSessionId(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

/**
 * Get temporary session ID from localStorage
 */
export function getTempSessionId(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(TEMP_SESSION_TOKEN_KEY);
}

/**
 * Set permanent session ID in localStorage
 */
export function setSessionId(sessionId: string): void {
  if (!isBrowser) return;
  localStorage.setItem(SESSION_TOKEN_KEY, sessionId);
}

/**
 * Set temporary session ID in localStorage
 */
export function setTempSessionId(sessionId: string): void {
  if (!isBrowser) return;
  localStorage.setItem(TEMP_SESSION_TOKEN_KEY, sessionId);
}

/**
 * Check if permanent session exists
 */
export function hasSession(): boolean {
  return !!getSessionId();
}

/**
 * Check if temporary session exists
 */
export function hasTempSession(): boolean {
  return !!getTempSessionId();
}

/**
 * Create a new permanent session via API
 */
export async function createSession(): Promise<string> {
  try {
    // Log session creation attempt for debugging
    console.log("Attempting to create permanent session...");

    const response = await fetch("/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error creating session: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Server response for session creation:", data);

    if (!data.success || !data.sessionId) {
      throw new Error("Failed to create session");
    }

    setSessionId(data.sessionId);
    console.log("Permanent session created successfully:", data.sessionId);
    return data.sessionId;
  } catch (error) {
    console.error("Error creating session:", error);

    // As a last resort, generate a client-side UUID and use it as a session ID
    // This is not ideal but prevents the form from completely failing
    const fallbackId = generateTempSessionId();
    console.warn("Using fallback client-generated session ID:", fallbackId);
    setSessionId(fallbackId);
    return fallbackId;
  }
}

/**
 * Get or create a temporary session ID for use during form completion
 * This does NOT create a session in the database, only in localStorage
 */
export function getOrCreateTempSession(): string {
  // Check for existing temp session
  const tempSessionId = getTempSessionId();

  if (tempSessionId) {
    console.log("Using existing temporary session ID:", tempSessionId);
    return tempSessionId;
  }

  // Create new temporary session
  const newTempSessionId = generateTempSessionId();
  console.log("Creating new temporary session ID:", newTempSessionId);
  setTempSessionId(newTempSessionId);
  return newTempSessionId;
}

/**
 * Convert a temporary session to a permanent one by creating it in the database
 * This is called when submitting the complete form
 */
export async function convertTempToPermanentSession(): Promise<string> {
  const tempSessionId = getTempSessionId();
  console.log(
    "Converting temporary session to permanent. Temp ID:",
    tempSessionId
  );

  // If no temp session exists, create a new permanent session directly
  if (!tempSessionId) {
    console.log("No temporary session found, creating new permanent session");
    return await createSession();
  }

  try {
    // Create a server-side session
    const response = await fetch("/api/session/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tempSessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error converting session: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Session conversion response:", data);

    if (!data.success || !data.sessionId) {
      throw new Error("Failed to convert temporary session");
    }

    // Store the new permanent session ID
    setSessionId(data.sessionId);
    console.log(
      "Session converted successfully. New permanent ID:",
      data.sessionId
    );

    // Clear the temporary session ID as it's no longer needed
    if (isBrowser) {
      localStorage.removeItem(TEMP_SESSION_TOKEN_KEY);
      console.log("Temporary session ID removed from localStorage");
    }

    return data.sessionId;
  } catch (error) {
    console.error("Error converting session:", error);

    // Fallback to creating a regular session if conversion fails
    console.log("Falling back to creating a new permanent session");
    return await createSession();
  }
}

/**
 * Get any available session ID, prioritizing permanent over temporary
 * This is useful for API calls during form completion that need a session reference
 */
export function getAnySessionId(): string | null {
  const permanentId = getSessionId();
  if (permanentId) {
    console.log("Using permanent session ID:", permanentId);
    return permanentId;
  }

  const tempId = getTempSessionId();
  if (tempId) {
    console.log("Using temporary session ID:", tempId);
    return tempId;
  }

  console.log("No session ID found");
  return null;
}

/**
 * Get the effective session ID to use for API calls,
 * creating a temporary one if none exists
 */
export function getEffectiveSessionId(): string {
  if (!isBrowser) return generateTempSessionId(); // Fallback para SSR

  console.log("Getting effective session ID...");

  // 1. Primero intentamos obtener la última sesión usada (para consistencia entre formulario y recomendaciones)
  const lastUsedId = localStorage.getItem(LAST_USED_SESSION_KEY);
  if (lastUsedId) {
    console.log("Using last used session ID:", lastUsedId);
    return lastUsedId;
  }

  // 2. Luego intentamos obtener una sesión permanente
  const permanentId = getSessionId();
  if (permanentId) {
    console.log("Using permanent session ID for API call:", permanentId);
    // Guardar como última sesión usada para mantener consistencia
    localStorage.setItem(LAST_USED_SESSION_KEY, permanentId);
    return permanentId;
  }

  // 3. Finalmente, usamos una sesión temporal
  const tempId = getTempSessionId();
  if (tempId) {
    console.log("Using temporary session ID for API call:", tempId);
    // Guardar como última sesión usada para mantener consistencia
    localStorage.setItem(LAST_USED_SESSION_KEY, tempId);
    return tempId;
  }

  // 4. Si no hay ninguna sesión, creamos una nueva
  console.log("No session ID found - creating a new temporary session");
  const newTempId = getOrCreateTempSession();
  // Guardar como última sesión usada para mantener consistencia
  localStorage.setItem(LAST_USED_SESSION_KEY, newTempId);
  return newTempId;
}

// Modificar la función clearAllSessions para incluir la limpieza de LAST_USED_SESSION_KEY
/**
 * Clear all session data from localStorage
 */
export function clearAllSessions(): void {
  if (!isBrowser) return;
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(TEMP_SESSION_TOKEN_KEY);
  localStorage.removeItem(LAST_USED_SESSION_KEY); // También limpiar la última sesión usada
  console.log("All session data cleared from localStorage");
}

/**
 * Start a completely new session, clearing any existing sessions
 */
export function startNewSession(): void {
  clearAllSessions();
  const newTempSessionId = generateTempSessionId();
  setTempSessionId(newTempSessionId);
  console.log("Started new temporary session:", newTempSessionId);
}
