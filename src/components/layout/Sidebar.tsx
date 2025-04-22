import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, onToggle }) => {
  const location = useLocation();
  const { logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false); // State for collapsing

  const navItems = [
    { icon: <LayoutDashboard size={20} />, name: "Översikt", path: "/" },
    { icon: <Users size={20} />, name: "Patienter", path: "/patients" },
    {
      icon: <Calendar size={20} />,
      name: "Möten",
      path: "/appointments",
    },
    {
      icon: <FileText size={20} />,
      name: "Transkription",
      path: "/transcriptions",
    },
    { icon: <Search size={20} />, name: "Sök", path: "/search" },
    { icon: <Settings size={20} />, name: "Inställningar", path: "/settings" },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: isMobile ? "-100%" : 0, opacity: isMobile ? 0 : 1 },
  };

  if (!isOpen && !isMobile) return null;

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      <motion.aside
        initial={isMobile ? "closed" : "open"}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 z-50 h-full ${
          collapsed ? "w-16" : "w-64"
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary-600 h-6 w-6"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
              <path d="m18 15-2-2" />
              <path d="m15 18-2-2" />
            </svg>
            {!collapsed && (
              <h1 className="text-xl font-bold text-primary-800">Ulteria AI</h1>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-gray-700"
          >
            {collapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto pt-5 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm rounded-md group transition-colors ${
                      isActive
                        ? "bg-primary-50 text-primary-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={isMobile ? onToggle : undefined}
                  >
                    <span
                      className={`mr-3 ${
                        isActive ? "text-primary-600" : "text-gray-500"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 w-full transition-colors"
          >
            <LogOut size={20} className="mr-3 text-gray-500" />
            {!collapsed && "Logga ut"}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
