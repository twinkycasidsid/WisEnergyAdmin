import {
  Home,
  Users,
  Plug,
  Star,
  MessageSquare,
  LogOut,
  FileText,
  Zap,
  CreditCard, // ✅ Add this
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

const navItems = [
  {
    label: "Dashboard",
    icon: <Home className="w-5 h-5" />,
    path: "/dashboard",
  },
  { label: "Users", icon: <Users className="w-5 h-5" />, path: "/users" },
  {
    label: "Subscriptions",
    icon: <CreditCard className="w-5 h-5" />,
    path: "/subscriptions",
  }, // ✅ New Page
  { label: "Devices", icon: <Plug className="w-5 h-5" />, path: "/devices" },
  { label: "Reviews", icon: <Star className="w-5 h-5" />, path: "/reviews" },
  {
    label: "Feedback",
    icon: <MessageSquare className="w-5 h-5" />,
    path: "/feedback",
    highlight: true,
  },
  {
    label: "Electricity Rates",
    icon: <Zap className="w-5 h-5" />,
    path: "/rates",
  }, // ✅ New
  {
    label: "Export Reports",
    icon: <FileText className="w-5 h-5" />,
    path: "/exports",
    highlight: true,
  },
];

function Sidebar({ collapsed, onCollapse, activePath }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("ASDSA");

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className={`flex flex-col h-full min-h-screen bg-white rounded-xl shadow-lg
         transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Top section */}
      <div className="p-6 border-b-2 border-b-gray-200 flex items-center justify-between">
        {!collapsed ? (
          <>
            <div className="flex items-center space-x-3">
              <img
                src="/wisenergylogo.png"
                alt="WisEnergy Logo"
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-lg font-bold text-[#24924B]">WisEnergy</h1>
            </div>
          </>
        ) : (
          <button onClick={onCollapse} className="mx-auto block">
            <img
              src="/wisenergylogo.png"
              alt="WisEnergy Logo"
              className="w-10 h-10 object-contain"
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex items-center w-full px-4 py-2 rounded-lg font-medium gap-3 transition-colors
        ${
          activePath === item.path
            ? "bg-[#43A866] text-white"
            : "text-gray-700 hover:bg-gray-100"
        }
        ${item.highlight && activePath !== item.path ? "mt-2" : ""}
        ${collapsed ? "justify-center" : ""}`}
          >
            {/* Make icon bigger when collapsed */}
            {React.cloneElement(item.icon, {
              className: collapsed ? "w-7 h-7" : "w-5 h-5",
            })}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Log Out */}
      <div className="p-4 border-t-2 border-t-gray-300 mt-auto">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 text-[#F44336] font-medium text-sm hover:underline ${
            collapsed ? "justify-center w-full" : ""
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && "Log Out"}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
