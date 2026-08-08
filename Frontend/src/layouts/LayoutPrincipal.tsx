import { NavLink, Outlet } from "react-router-dom";

export function LayoutPrincipal() {
  return (
    <div>
      <aside>
        <h2>ERP Empresarial</h2>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/productos">Productos</NavLink>
          <NavLink to="/categorias">Categorías</NavLink>
          <NavLink to="/clientes">Clientes</NavLink>
        </nav>
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  );
}