import AuthForm from "../components/AuthForm";
import { signupUser } from "../api/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";


function Signup() {
  const navigate = useNavigate();

  const handleSignup = async (data) => {
    const res = await signupUser(data);
    console.log("Signup Response:", res);
    if (res.token) {
      localStorage.setItem("token", res.token);
      navigate("/");
    }
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
