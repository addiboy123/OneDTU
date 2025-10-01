import AuthForm from "../components/AuthForm";
import { signupUser } from "../api/auth";

function Signup() {
  const handleSignup = async (data) => {
    const res = await signupUser(data);
    console.log("Signup Response:", res);
    if (res.token) localStorage.setItem("token", res.token);
  };

  return (
    <div>
      <h2>Signup</h2>
      <AuthForm onSubmit={handleSignup} type="signup" />
    </div>
  );
}

export default Signup;
