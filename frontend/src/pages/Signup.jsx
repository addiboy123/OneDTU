import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";


function Signup() {
  const navigate = useNavigate();

  const { signup } = useAuth();
  const handleSignup = async (data) => {
    const res = await signup(data);
    // console.log("Signup Response:", res);
    if (res.token) {
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
