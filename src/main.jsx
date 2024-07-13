import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { StateProvider } from "./context/StateContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <AuthProvider>
      <StateProvider>
        <App />
      </StateProvider>
    </AuthProvider>
  </React.StrictMode>
);
