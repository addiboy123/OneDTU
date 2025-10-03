import { useEffect } from "react";
import { googleLogin } from "../api/auth";

function GoogleLoginButton() {
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("google-signin"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const cred = response?.credential;
      if (!cred) {
        console.error("No credential in Google response", response);
        return;
      }
      const data = await googleLogin(cred);
      console.log("Google Auth Response:", data);
      if (data?.token) localStorage.setItem("token", data.token);
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  return <div id="google-signin"></div>;
}

export default GoogleLoginButton;
