import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { DatosProvider } from "./contexto/DatosContexto";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DatosProvider>
      <App />
    </DatosProvider>
  </StrictMode>
);