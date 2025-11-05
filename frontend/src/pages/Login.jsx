import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useState } from "react";
import SocietyAdminLoginForm from "../components/societyconnect/SocietyAdminLoginForm";
import Modal from "../components/societyconnect/Modal";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);

  const handleLogin = async (data) => {
    const res = await login(data);
    if (res.token) {
      navigate("/");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <AuthForm onSubmit={handleLogin} type="login">
            <GoogleLoginButton />
          </AuthForm>

          <div className="text-center mt-4">
            <button
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
              onClick={() => setShowAdmin(true)}
            >
              Are you a society maintainer?
            </button>
          </div>
        </div>

        {showAdmin && (
          <Modal onClose={() => setShowAdmin(false)}>
            <div className="bg-[#111827] p-6 rounded-xl shadow-xl w-full max-w-md">
              <h2 className="text-xl font-semibold text-white text-center mb-4">
                Society Admin Login
              </h2>
              <SocietyAdminLoginForm onClose={() => setShowAdmin(false)} />
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}

export default Login;
