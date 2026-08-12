import { NavLink, Outlet, useNavigate } from "react-router-dom";

export function LayoutPrincipal() {
  const navigate = useNavigate();

  const usuarioGuardado = localStorage.getItem("usuario");

  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  // Saber si el usuario tiene rol ADMIN
  const esAdmin = usuario?.rol === "ADMIN";

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    navigate("/login");
  };

  const claseLink = ({ isActive }: { isActive: boolean }) =>
    `
      block rounded-lg px-3 py-2 text-sm font-medium transition
      ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }
    `;

  return (
    <div className="min-h-screen bg-background">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-slate-950 p-5 text-white">
        {/* LOGO */}
        <div className="mb-8">
          <h1 className="text-xl font-bold">ERP Empresarial</h1>

          <p className="mt-1 text-sm text-slate-400">Gestión empresarial</p>
        </div>

        {/* MENÚ */}
        <nav className="flex flex-1 flex-col gap-2">
          {/* ========================= */}
          {/* ADMIN Y EMPLEADO */}
          {/* ========================= */}

          <NavLink to="/dashboard" className={claseLink}>
            Dashboard
          </NavLink>

          <NavLink to="/productos" className={claseLink}>
            Productos
          </NavLink>

          <NavLink to="/categorias" className={claseLink}>
            Categorías
          </NavLink>

          <NavLink to="/clientes" className={claseLink}>
            Clientes
          </NavLink>

          <NavLink to="/ventas" className={claseLink}>
            Nueva venta
          </NavLink>

          <NavLink to="/ventas/historial" className={claseLink}>
            Historial de ventas
          </NavLink>

          <NavLink to="/inventario" className={claseLink}>
            Inventario
          </NavLink>

          {/* ========================= */}
          {/* SOLO ADMIN */}
          {/* ========================= */}

          {esAdmin && (
            <>
              <div className="my-2 border-t border-slate-800" />

              <p className="px-3 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Administración
              </p>

              <NavLink to="/proveedores" className={claseLink}>
                Proveedores
              </NavLink>

              <NavLink to="/compras" className={claseLink}>
                Nueva compra
              </NavLink>

              <NavLink to="/compras/historial" className={claseLink}>
                Historial de compras
              </NavLink>

              <NavLink to="/inventario/ajustes" className={claseLink}>
                Ajustar inventario
              </NavLink>

              <NavLink to="/usuarios" className={claseLink}>
                Usuarios
              </NavLink>

              <NavLink to="/reportes" className={claseLink}>
                Reportes
              </NavLink>
            </>
          )}
        </nav>

        {/* USUARIO */}
        <div className="border-t border-slate-800 pt-4">
          <p className="text-sm text-slate-400">Sesión iniciada como</p>

          <p className="mt-1 font-medium">{usuario?.nombre ?? "Usuario"}</p>

          <p className="text-xs text-slate-500">{usuario?.rol ?? ""}</p>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="ml-64 min-h-screen">
        {/* HEADER */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-surface px-8">
          <div>
            <p className="text-sm text-muted-foreground">
              Sistema de gestión empresarial
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">
                {usuario?.nombre ?? "Usuario"}
              </p>

              <p className="text-xs text-muted-foreground">
                {usuario?.correo ?? ""}
              </p>
            </div>

            <button
              type="button"
              onClick={cerrarSesion}
              className="
                rounded-lg border border-border
                bg-surface px-4 py-2 text-sm font-medium
                transition
                hover:bg-muted
              "
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* PÁGINAS */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
