import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/Modal/AuthContext";
import { LoginPage } from "./components/Modal";
import { DashboardPage } from "./DeptHeadPage/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./style.css";



createRoot(document.getElementById("app")).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  </StrictMode>
);
