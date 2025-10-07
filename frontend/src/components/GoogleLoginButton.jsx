import { useEffect } from "react";
import { googleLogin } from "../api/auth";
import { useNavigate } from "react-router-dom";
  
function GoogleLoginButton() {
  const navigate = useNavigate();

  // define handler before SDK initialize so reference exists
  const handleCredentialResponse = async (response) => {
    try {
      const cred = response?.credential;
      if (!cred) {
        console.error("No credential in Google response", response);
        return;
      }
      const data = await googleLogin(cred);
      console.log("Google Auth Response:", data);
      if (data?.token){
        localStorage.setItem("token", data.token);
        // notify other components that auth state changed
        try { window.dispatchEvent(new Event('auth-changed')); } catch(e){}
        navigate("/");
      }
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  useEffect(() => {
    /* global google */
    if (!window.google || !window.google.accounts) return;

    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("google-signin"),
      { theme: "outline", size: "large" }
    );
  }, []);

  return <div id="google-signin"></div>;
}

export default GoogleLoginButton;
