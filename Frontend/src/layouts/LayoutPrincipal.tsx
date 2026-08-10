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
      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-slate-950 px-4 py-6 text-white">
        <div className="mb-8">
          <h1 className="text-xl font-bold">ERP Empresarial</h1>

          <p className="mt-1 text-sm text-slate-400">Gestión empresarial</p>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
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

          <NavLink to="/proveedores" className={claseLink}>
            Proveedores
          </NavLink>
        </nav>

        <div className="border-t border-slate-800 pt-4">
          <p className="text-sm text-slate-400">Sesión iniciada como</p>

          <p className="mt-1 font-medium">{usuario?.nombre ?? "Usuario"}</p>

          <p className="text-xs text-slate-500">{usuario?.rol ?? ""}</p>
        </div>
      </aside>

      <div className="ml-64 min-h-screen">
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

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
