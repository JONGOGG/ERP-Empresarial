import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { InicioSesion } from "./paginas/InicioSesion";
import { Dashboard } from "./paginas/Dashboard";
import { Productos } from "./paginas/Productos";
import { Categorias } from "./paginas/Categorias";
import { Clientes } from "./paginas/Clientes";
import { Ventas } from "./paginas/Ventas";
import { HistorialVentas } from "./paginas/HistorialVentas";
import { DetalleVenta } from "./paginas/DetalleVenta";
import { Proveedores } from "./paginas/Proveedores";
import { Compras } from "./paginas/Compras";
import { HistorialCompras } from "./paginas/HistorialCompras";
import { DetalleCompra } from "./paginas/DetalleCompra";
import { Inventario } from "./paginas/Inventario";
import { AjustesInventario } from "./paginas/AjustesInventario";
import { Usuarios } from "./paginas/Usuarios";

import { LayoutPrincipal } from "./layouts/LayoutPrincipal";

import { RutaProtegida } from "./rutas/RutaProtegida";
import { RutaAdmin } from "./rutas/RutaAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========================= */}
        {/* RUTAS PÚBLICAS */}
        {/* ========================= */}

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<InicioSesion />} />

        {/* ========================= */}
        {/* RUTAS CON AUTENTICACIÓN */}
        {/* ========================= */}

        <Route element={<RutaProtegida />}>
          <Route element={<LayoutPrincipal />}>
            {/* ========================= */}
            {/* ADMIN Y EMPLEADO */}
            {/* ========================= */}

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/productos" element={<Productos />} />

            <Route path="/categorias" element={<Categorias />} />

            <Route path="/clientes" element={<Clientes />} />

            <Route path="/ventas" element={<Ventas />} />

            <Route path="/ventas/historial" element={<HistorialVentas />} />

            <Route path="/ventas/:id" element={<DetalleVenta />} />

            <Route path="/inventario" element={<Inventario />} />

            {/* ========================= */}
            {/* SOLO ADMIN */}
            {/* ========================= */}

            <Route element={<RutaAdmin />}>
              <Route path="/proveedores" element={<Proveedores />} />

              <Route path="/compras" element={<Compras />} />

              <Route path="/compras/historial" element={<HistorialCompras />} />

              <Route path="/compras/:id" element={<DetalleCompra />} />

              <Route
                path="/inventario/ajustes"
                element={<AjustesInventario />}
              />

              <Route path="/usuarios" element={<Usuarios />} />
            </Route>
          </Route>
        </Route>

        {/* ========================= */}
        {/* RUTA NO ENCONTRADA */}
        {/* ========================= */}

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
