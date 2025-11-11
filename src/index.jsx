import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LoginPage } from "./screens/LoginPage";
import "./tailwind.css";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <LoginPage />
  </StrictMode>
);
