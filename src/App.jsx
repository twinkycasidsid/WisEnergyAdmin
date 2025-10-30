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
          {/* Auth Flow */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/code-verification" element={<CodeVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-success" element={<ResetSuccess />} />

          {/* Dashboard (protected) */}
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
