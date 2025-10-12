import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verify_otp } from "../../../services/apiService";

function CodeVerification() {
  const { state } = useLocation()
  const email = state.email;
  const [otp, setOtp] = useState(new Array(5).fill(""));
  const [error, setError] = useState("")
  const navigate = useNavigate();
  // handle input change

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // auto focus to next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.some(digit => digit === "")) {
      setError("Please enter the complete OTP");
      return;
    }
    console.log("Entered OTP:", otp.join(""));
    const result = await verify_otp(email, otp.join(""));
    if (result.success) {
      navigate("/reset-password", { state: { email } })
    } else {
      setError(result.message)
    }

    // call API to verify OTP here
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
          Code Verification
        </h2>
        <p className="mb-6 text-center text-gray-600 text-[15px]">
          A One-Time Password (OTP) verification code has been sent to your
          email. (Remember to check your spam folder if you don’t see it!)
        </p>

        {/* OTP Inputs */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-12 border border-gray-300 rounded-md text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#24924B]/30"
              />
            ))}

          </div>
          {error && (
            <span className="text-red-500">{error}</span>
          )}
        </div>
        {/* Proceed button */}
        <button
          type="submit"
          className="w-full h-11 rounded-md bg-[#215C38] text-white font-semibold hover:bg-[#1a4a2d] transition-colors text-[16px]"
        >
          Proceed
        </button>

        {/* Back to Login */}
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex items-center gap-1 text-[14px] text-gray-600 hover:underline"
          >
            ← Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default CodeVerification;
