import React, { useState } from "react";
import Login from "../Login";

export default function AdminGate() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [keyInput, setKeyInput] = useState("");

  const SECRET_KEY = "W1sEnergy-Access2025"; // change this regularly

  const handleAccess = () => {
    if (keyInput === SECRET_KEY) {
      localStorage.setItem("adminKey", "granted");
      setAccessGranted(true);
    } else {
      alert("Access denied");
    }
  };

  // ✅ If already verified before, skip directly to login
  if (localStorage.getItem("adminKey") === "granted" || accessGranted) {
    return <Login />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center w-80">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Admin Access Required
        </h2>
        <p className="text-gray-600 mb-6">Enter your access code to continue.</p>

        <input
          type="password"
          placeholder="Enter access code"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={handleAccess}
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition"
        >
          Unlock
        </button>
      </div>
    </div>
  );
}
