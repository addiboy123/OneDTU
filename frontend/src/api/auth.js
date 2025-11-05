import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000") + "/auth"; // backend base URL

export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return res.json();
}

export async function signupUser(data) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function googleLogin(credential) {
  if (!credential) throw new Error("No credential provided to googleLogin");

  // ensure we send the token key the backend expects
  const url = `${API_URL}/google`;
  const payload = { token: credential };
  const res = await axios.post(url, payload);
  return res.data;
}

export async function societyAdminLogin(credentials) {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const url = `${base}/societyconnect/society-admin/login`;
  const res = await axios.post(url, credentials);
  return res.data;
}
