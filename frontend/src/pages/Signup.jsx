import AuthForm from "../components/AuthForm";
import { signupUser } from "../api/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Navbar from "../components/Navbar";


function Signup() {
  const handleSignup = async (data) => {
    const res = await signupUser(data);
    console.log("Signup Response:", res);
    if (res.token) localStorage.setItem("token", res.token);
  };

  return (
    <>
      <Navbar />
      <AuthForm onSubmit={handleSignup} type="signup">
        <GoogleLoginButton />
      </AuthForm>
    </>
  );
}

export default Signup;
