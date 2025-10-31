import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Login from "./components/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import { SearchProvider } from "./components/SearchContext";
import ForgotPassword from "./components/layout/ForgotPassword";
import CodeVerification from "./components/layout/CodeVerification";
import ResetPassword from "./components/layout/ResetPassword";
import ResetSuccess from "./components/layout/ResetSuccess";
import ProtectedRoute from "./components/ProtectedRoutes";
import LandingPage from "./components/layout/LandingPage"; // 👈 optional public page (marketing site)
import AdminGate from "./components/layout/AdminGate";

// ---- Inner component to handle dynamic title ----
function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/": "Login",
      "/forgot-password": "Forgot Password",
      "/code-verification": "Code Verification",
      "/reset-password": "Reset Password",
      "/reset-success": "Password Reset Success",
    };

    const current = titles[location.pathname] || "Dashboard";
    document.title = `${current} | WisEnergy`;
  }, [location.pathname]);

  return null; // doesn’t render anything
}

export default function App() {
  return (
    <SearchProvider>
      <Router>
        {/* ⬇ Add here so it listens to route changes */}
        <TitleManager />

        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* 🔒 Admin Gate (must unlock first) */}
          <Route path="/w1s3n3r9y-p0rt4l" element={<AdminGate />} />

          {/* 🔑 Password Reset Flow (only if gate unlocked) */}
          {localStorage.getItem("adminKey") === "granted" && (
            <>
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/code-verification" element={<CodeVerification />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/reset-success" element={<ResetSuccess />} />
            </>
          )}

          {/* Protected Dashboard */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </SearchProvider>
  );
}
