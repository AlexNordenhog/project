import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TranscriptionsPage from "./pages/TranscriptionsPage";
import TranscriptionDetailPage from "./pages/TranscriptionDetailPage";
import NewTranscriptionPage from "./pages/NewTranscriptionPage";
import { useAuthStore } from "./store/authStore";

// Private route component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="transcriptions" element={<TranscriptionsPage />} />
          <Route path="transcriptions/new" element={<NewTranscriptionPage />} />
          <Route
            path="transcriptions/:id"
            element={<TranscriptionDetailPage />}
          />
          <Route path="patients" element={<div>Patient Sida</div>} />
          <Route path="appointments" element={<div>Planerade Möten</div>} />
          <Route path="search" element={<div>Sök Sida</div>} />
          <Route path="settings" element={<div>Inställningar</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
