import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./ErrorBoundary";
import { UserStatusProvider } from "./context/UserStatusContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <UserStatusProvider>
        <App />
      </UserStatusProvider>
    </ErrorBoundary>
  </StrictMode>
);
