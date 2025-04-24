import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import PatientSummary from "../components/dashboard/PatientSummary";
import TranscriptionSummary from "../components/dashboard/TranscriptionSummary";
import AppointmentsSummary from "../components/dashboard/AppointmentsSummary";
import RecentTranscriptions from "../components/dashboard/RecentTranscriptions";
import { useAuthStore } from "../store/authStore";

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate(); // Initialize useNavigate

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morgon";
    if (hour < 18) return "God eftermiddag";
    return "God kväll";
  };

  const handleStartMeeting = () => {
    navigate("/transcriptions/new"); // Redirect to /transcriptions/new
  };

  return (
    <div className="space-y-6 pl-[10%]">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold tracking-tight"
        >
          {getGreeting()}, {user?.name.split(" ")[0]}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-muted-foreground"
        >
          Här är vad som händer med dina patientjournaler idag.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <PatientSummary />
        <TranscriptionSummary />
        <div className="flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary-600 text-white rounded-lg p-6 text-center shadow-md transition-all"
            onClick={handleStartMeeting} // Add onClick handler
          >
            <h3 className="text-lg font-medium">Starta Möte</h3>
            <p className="text-primary-100 text-sm mt-1">
              Spela in ett nytt möte med en patient
            </p>
          </motion.button>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <AppointmentsSummary />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <RecentTranscriptions />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
