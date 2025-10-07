import api from "./interceptor";
export async function updatePhoneNumber(phoneNumber) {
  if (!phoneNumber) throw new Error("phoneNumber is required");

  const res = await api.patch("/user/update-phone", { phoneNumber });
  const data = res.data;

  // If backend returned a fresh token, store it and notify app
  if (data?.token) {
    localStorage.setItem("token", data.token);
    // notify other components (Navbar, pages) to re-read token
    window.dispatchEvent(new Event("auth-changed"));
  }

  return data;
}

export default { updatePhoneNumber };