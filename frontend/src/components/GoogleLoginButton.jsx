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
    const data = await googleLogin(response.credential);
    console.log("Google Auth Response:", data);
    localStorage.setItem("token", data.token); // store JWT
  };

  return <div id="google-signin"></div>;
}

export default GoogleLoginButton;
