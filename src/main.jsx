import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TradeProvider } from "./context/TradeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TradeProvider>
      <App />
    </TradeProvider>
  </React.StrictMode>
);
