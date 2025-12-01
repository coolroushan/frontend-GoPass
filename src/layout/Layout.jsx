import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  UserPlus,
  Ticket,
  ClipboardList,
  FileText,
  LogOut,
  QrCode,
} from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
const [isLoggingOut, setIsLoggingOut] = useState(false);
const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Events", path: "/events", icon: <Ticket size={18} /> },
    { name: "New Visitor", path: "/visitor", icon: <UserPlus size={18} /> },
    { name: "Event Passes", path: "/event-passes", icon: <Ticket size={18} /> },
    { name: "Attendance", path: "/attendance", icon: <ClipboardList size={18} /> },
    { name: "Scan Pass", path: "/qr-attendance", icon: <QrCode size={18} /> },
    { name: "Reports", path: "/reports", icon: <FileText size={18} /> },
  ];
const BASE_URL = import.meta.env.VITE_API_BASE;
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Include token if backend requires it
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // We proceed to remove token anyway so user isn't stuck
    } finally {
      localStorage.removeItem("token");
      setIsLoggingOut(false);
      navigate("/signin");
    }
  };

  const sidebar = (
    <aside className="flex flex-col w-64 bg-[#0b1f3b] text-white shadow-2xl h-full">
      {/* Logo section */}
      <div className="px-6 py-5 border-b border-white/10 sticky top-0 bg-[#0b1f3b]/95 backdrop-blur">
        <h1 className="text-2xl font-bold tracking-wide text-[#facc15]">
          GoPass
        </h1>
        <p className="text-xs text-gray-300 mt-1">Campus Access Control</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 mt-6 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === item.path
                ? "bg-[#facc15] text-[#0b1f3b] font-semibold shadow-md"
                : "text-gray-300 hover:bg-white/10 hover:text-[#facc15]"
              }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
        onClick={handleLogout}
          disabled={isLoggingOut}
         className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 transition w-full">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block">{sidebar}</div>

      {/* Sidebar - Mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity md:hidden ${mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setMobileOpen(false)}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full z-50 transition-transform md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {sidebar}
      </div>

      {/* Main */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Top bar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg bg-[#0b1f3b] text-[#facc15] shadow hover:bg-[#142a50] transition"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <h2 className="text-xl font-semibold text-[#0b1f3b] capitalize">
              {location.pathname === "/" ? "Dashboard" : location.pathname.slice(1)}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              Admin User
            </span>
            <div className="w-9 h-9 rounded-full bg-[#0b1f3b] text-[#facc15] flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-5 sm:p-7 lg:p-8">
          {/* THIS IS WHERE THE CHILD ROUTE RENDERS */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;