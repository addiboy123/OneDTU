import { useState } from "react";

function AuthForm({ onSubmit, type = "login", children }) {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#111827] p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-white text-center">OneDTU</h1>
          <h2 className="mt-2 text-center text-xl font-semibold text-gray-300">
            {type === "signup" ? "Create an account" : "Sign in to your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Welcome back — enter your details to continue
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {type === "signup" && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-[#1f2937] text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-[#1f2937] text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  type === "signup" ? "new-password" : "current-password"
                }
                required
                value={form.password}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-[#1f2937] text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4.03 3.97a.75.75 0 10-1.06 1.06l1.3 1.3A9.455 9.455 0 001.5 10c2.5 4 6 6 8.5 6 1.02 0 2.02-.2 2.94-.6l1.53 1.53a.75.75 0 101.06-1.06l-14-14z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 3c-4 0-7.07 2.5-8.5 6 1.43 3.5 4.5 6 8.5 6s7.07-2.5 8.5-6C17.07 5.5 14 3 10 3zM10 8.5A2.5 2.5 0 1010 13a2.5 2.5 0 000-4.5z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-[#1f2937]"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-300"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 rounded-md shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {type === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        {children && (
          <>
            <div className="mt-6 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
              <span className="px-2 text-gray-400 text-sm">or</span>
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="mt-6">{children}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
