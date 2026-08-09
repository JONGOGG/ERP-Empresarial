import { NavLink, Outlet, useNavigate } from "react-router-dom";

export function LayoutPrincipal() {
  const navigate = useNavigate();

  const usuarioGuardado = localStorage.getItem("usuario");

  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    navigate("/login");
  };

  return (
    <div>
      <aside>
        <h2>ERP Empresarial</h2>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>

          <NavLink to="/productos">Productos</NavLink>

          <NavLink to="/categorias">Categorías</NavLink>

          <NavLink to="/clientes">Clientes</NavLink>

          <NavLink to="/ventas">Nueva venta</NavLink>

          <NavLink to="/ventas/historial">Historial de ventas</NavLink>
        </nav>
      </aside>

      <div>
        <header>
          <span>{usuario?.nombre ?? "Usuario"}</span>

          <button type="button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
