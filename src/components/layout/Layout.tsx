import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get the title based on the current route
  const getTitle = () => {
    const path = location.pathname;

    if (path === "/") return "Översikt";
    if (path.startsWith("/patients")) return "Patient Records";
    if (path.startsWith("/appointments")) return "Appointments";
    if (path.startsWith("/transcriptions")) return "Transkriptioner";
    if (path.startsWith("/search")) return "Sök";
    if (path.startsWith("/settings")) return "Inställningar";

    return "UlteriaAI";
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} title={getTitle()} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
