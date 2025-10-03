import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

// 
// token retrieval from localStorage
const getStoredToken = () =>
  localStorage.getItem("token") ||
  null;

// Clear all auth storage + cookies and redirect to login
const logoutAndRedirect = () => {
  localStorage.removeItem("token");
  // small timeout so any pending UI work can finish
  setTimeout(() => {
    window.location.href = "/login";
  }, 50);
};

// Basic JWT expiry check without external deps
const isTokenExpired = (token, leewaySeconds = 30) => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload.exp) return true;
    const expMs = payload.exp * 1000;
    const nowMs = Date.now();
    return expMs <= nowMs + leewaySeconds * 1000 * -1 ? true : expMs <= nowMs - leewaySeconds * 1000;
  } catch (e) {
    // If any error decoding token, treat as expired
    return true;
  }
};

// Request Interceptor: Attach JWT from LocalStorage to Requests and auto-logout if expired
api.interceptors.request.use(
    (config) => {
        const token = getStoredToken();
        if (token) {
            if (isTokenExpired(token)) {
                // token expired -> perform logout
                logoutAndRedirect();
                return Promise.reject(new axios.Cancel("Token expired"));
            }
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiry and Unauthorized responses
api.interceptors.response.use(
    (response) => response, // Pass through valid responses
    (error) => {
        // if request was cancelled due to expired token, propagate
        if (axios.isCancel(error)) return Promise.reject(error);

        const status = error?.response?.status;
        if (status === 401 || status === 403) {
            console.warn("Token expired or invalid. Logging out...");
            logoutAndRedirect();
        }
        return Promise.reject(error);
    }
);

export default api;