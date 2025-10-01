import AuthForm from "../components/AuthForm";
import { loginUser } from "../api/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";

function Login() {
  const handleLogin = async (data) => {
    const res = await loginUser(data);
    console.log("Login Response:", res);
    if (res.token) localStorage.setItem("token", res.token);
  };

  return (
    <div>
      <h2>Login</h2>
      <AuthForm onSubmit={handleLogin} type="login" />
      <GoogleLoginButton />
    </div>
  );
}

export default Login;
