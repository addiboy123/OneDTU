import AuthForm from "../components/AuthForm";
import { loginUser } from "../api/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Navbar from "../components/Navbar";

function Login() {
  const handleLogin = async (data) => {
    const res = await loginUser(data);
    console.log("Login Response:", res);
    if (res.token) localStorage.setItem("token", res.token);
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
