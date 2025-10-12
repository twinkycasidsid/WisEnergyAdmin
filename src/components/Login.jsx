import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/apiService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email) {
    setError("Email field cannot be empty.");
    return;
  }

  if (!password) {
    setError("Password field cannot be empty.");
    return;
  }

  if (!emailRegex.test(email)) {
    setError("Invalid email format");
    return;
  }

  const result = await login(email, password);

  if (result.success) {
    // If login is successful, store token and user data, and navigate to dashboard
    localStorage.setItem("token", result.data.idToken);
    localStorage.setItem("user", JSON.stringify(result.data.user));
    navigate("/dashboard");
  } else {
    // If login fails (incorrect credentials), set an "Invalid credentials" error message
    setError("Invalid credentials.");
  }
};

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: "url('/adminloginbg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Brand top-left */}
      <div className="absolute z-30 top-8 left-8 flex items-center gap-3">
        <img src="/wisenergylogo.png" alt="WisEnergy" className="h-12 w-12" />
        <div>
          <span className="text-3xl font-bold text-[#24924B] leading-tight">
            {" "}
            WisEnergy{" "}
          </span>
        </div>
      </div>
      {/* Centered card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-30 w-[95%] max-w-[420px] rounded-2xl bg-white shadow-xl border border-gray-200 px-8 py-8"
      >
        <h2 className="text-2xl font-bold text-center mb-1">
          {" "}
          Login to Account{" "}
        </h2>
        <p className="mb-6 text-center text-gray-600 text-[15px]">
          {" "}
          Please enter your email and password to continue{" "}
        </p>
        {error && (
          <div className="mb-4 text-center text-red-600 text-sm">{error}</div>
        )}
        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm mb-1 font-medium text-gray-700">
            {" "}
            Email address:{" "}
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            className="w-full h-11 rounded-md border border-gray-300 bg-gray-100 px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24924B]/30"
          />
        </div>
        {/* Password + forget link in the same row */}
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {" "}
              Password{" "}
            </label>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-1 w-full h-11 rounded-md border border-gray-300 bg-gray-100 px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24924B]/30"
            placeholder="Enter your password"
          />
        </div>
        {/* Remember and Forget Password in one row */}
        <div className="mt-4 mb-6 flex items-center justify-between">
          <div className="flex items-center">
            {/* <input id="remember" type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="mr-2 h-4 w-4 accent-[#24924B]" /> <label htmlFor="remember" className="text-sm text-gray-700"> Remember Password </label> */}
          </div>
          <a
            href="/forgot-password"
            className="text-[14px] text-gray-500 hover:underline"
          >
            {" "}
            Forgot Password?{" "}
          </a>
        </div>
        {/* Submit */}
        <button
          type="submit"
          className="w-full h-11 rounded-md bg-[#215C38] text-white font-semibold hover:bg-[#1a4a2d] transition-colors text-[17px]"
        >
          {" "}
          Sign In{" "}
        </button>
      </form>
    </div>
  );
}

export default Login;
