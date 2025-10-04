import AuthForm from "../components/AuthForm";
import { loginUser } from "../api/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    const res = await loginUser(data);
    console.log("Login Response:", res);
    if (res.token) {
      localStorage.setItem("token", res.token);
      // navigate to home after successful login
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
