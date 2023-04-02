import React, { memo } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import MouseCursor from "./components/mouse/Mouse";

const root = ReactDOM.createRoot(document.getElementById("root"));
const Cursor = memo(() => <MouseCursor />);

root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App Cursor={Cursor} />
    </AuthContextProvider>
  </React.StrictMode>
);
