import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Maps from "./Maps";
import "./main.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Maps />
  </StrictMode>
);
