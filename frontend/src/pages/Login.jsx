import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const handleLogin = async (data) => {
    const res = await login(data);
    console.log("Login Response:", res);
    if (res.token) {
      navigate("/");
    }
  };

  return (
    <>
      <Navbar />
      <AuthForm onSubmit={handleLogin} type="login">
        <GoogleLoginButton />
      </AuthForm>
    </>
  );
}

export default Login;
