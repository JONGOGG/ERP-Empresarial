import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { InicioSesion } from "./paginas/InicioSesion";
import { Panel } from "./paginas/Panel";
import { Productos } from "./paginas/Productos";
import { Categorias } from "./paginas/Categorias";
import { Clientes } from "./paginas/Clientes";
import { Ventas } from "./paginas/Ventas";

import { LayoutPrincipal } from "./layouts/LayoutPrincipal";
import { RutaProtegida } from "./rutas/RutaProtegida";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<InicioSesion />} />

        <Route element={<RutaProtegida />}>
          <Route element={<LayoutPrincipal />}>
            <Route path="/dashboard" element={<Panel />} />

            <Route path="/productos" element={<Productos />} />

            <Route path="/categorias" element={<Categorias />} />

            <Route path="/clientes" element={<Clientes />} />

            <Route path="/ventas" element={<Ventas />} />
            
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
