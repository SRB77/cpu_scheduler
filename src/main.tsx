import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={100}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          draggable
          pauseOnHover
          theme="light"
        />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
