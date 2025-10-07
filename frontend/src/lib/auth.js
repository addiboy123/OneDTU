// Minimal token helper — reads token from localStorage and decodes payload
// No extra dependencies required.
export const TOKEN_KEYS = ["token", "user", "jwTokenInLocalStorage", "jwt"];

export function getRawToken() {
  for (const k of TOKEN_KEYS) {
    const t = localStorage.getItem(k);
    if (t) return t;
  }
  return null;
}

// decode base64 url payload
function safeDecodePayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(payload)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
}

export function getDecodedToken() {
  const token = getRawToken();
  if (!token) return null;
  const decoded = safeDecodePayload(token);
  if (!decoded) return null;
  // check expiry (exp is in seconds)
  if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
  return decoded;
}

export default getDecodedToken;
