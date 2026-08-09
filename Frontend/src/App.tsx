import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { InicioSesion } from "./paginas/InicioSesion";
import { Dashboard } from "./paginas/Dashboard";
import { Productos } from "./paginas/Productos";
import { Categorias } from "./paginas/Categorias";
import { Clientes } from "./paginas/Clientes";
import { Ventas } from "./paginas/Ventas";
import { HistorialVentas } from "./paginas/HistorialVentas";
import { DetalleVenta } from "./paginas/DetalleVenta";

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
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/productos" element={<Productos />} />

            <Route path="/categorias" element={<Categorias />} />

            <Route path="/clientes" element={<Clientes />} />

            <Route path="/ventas" element={<Ventas />} />

            <Route path="/ventas/historial" element={<HistorialVentas />} />

            <Route path="/ventas/:id" element={<DetalleVenta />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
