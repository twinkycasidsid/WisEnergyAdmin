import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import { SearchProvider } from "./components/SearchContext";

// For testing password reset flow
import ForgotPassword from "./components/layout/ForgotPassword";
import CodeVerification from "./components/layout/CodeVerification";
import ResetPassword from "./components/layout/ResetPassword";
import ResetSuccess from "./components/layout/ResetSuccess";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <SearchProvider>
      <Router>
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

export default App;
