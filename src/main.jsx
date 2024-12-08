import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MapWithFixedCircle from "./MapWithFixedCircle";
import "./main.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MapWithFixedCircle />
  </StrictMode>
);
