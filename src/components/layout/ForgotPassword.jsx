import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generate_otp } from "../../../services/apiService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setError("")
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    e.preventDefault();
    const result = await generate_otp(email, false)
    if (result.success) {
      navigate("/code-verification", { state: { email } })
    } else {
      setError(result.message)
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: "url('/adminloginbg.png')", // background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Brand top-left */}
      <div className="absolute z-30 top-8 left-8 flex items-center gap-3">
        <img src="/wisenergylogo.png" alt="WisEnergy" className="h-12 w-12" />
        <span className="text-3xl font-bold text-[#24924B] leading-tight">
          WisEnergy
        </span>
      </div>

      {/* Center card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-30 w-[95%] max-w-[420px] rounded-2xl bg-white shadow-xl border border-gray-200 px-8 py-8"
      >
        <h2 className="text-2xl font-bold text-center mb-2">
          Forgot Password
        </h2>
        <p className="mb-6 text-center text-gray-600 text-[15px]">
          To begin your password reset, please enter your registered email
          address below.
        </p>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Email address:
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            className="w-full h-11 rounded-md border border-gray-300 bg-gray-100 px-4 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24924B]/30"
          />
          {error && (
            <span className="text-red-600">{error}</span>
          )}
        </div>

        {/* Reset button */}
        <button
          href="/reset-password" type="submit"
          className="w-full h-11 rounded-md bg-[#215C38] text-white font-semibold hover:bg-[#1a4a2d] transition-colors text-[16px]"
        >
          Reset Password
        </button>

        {/* Back link */}
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-[14px] text-gray-600 hover:underline"
          >
            ← Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
