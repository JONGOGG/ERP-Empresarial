import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { iniciarSesion } from "../servicios/authServicio";

export function InicioSesion() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setError("");
      setCargando(true);

      const respuesta = await iniciarSesion(correo, password);

      localStorage.setItem("token", respuesta.token);

      localStorage.setItem("usuario", JSON.stringify(respuesta.usuario));

      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocurrió un error al iniciar sesión");
      }
    } finally {
      setCargando(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <main className="flex min-h-screen bg-background">
      {/* Lado izquierdo */}

      <section className="hidden w-1/2 flex-col justify-between bg-slate-950 p-12 text-white lg:flex">
        <div>
          <h1 className="text-3xl font-bold">ERP Empresarial</h1>

          <p className="mt-2 text-slate-400">Sistema de gestión empresarial</p>
        </div>

        <div className="max-w-lg">
          <h2 className="text-4xl font-bold leading-tight">
            Administra tu empresa desde un solo lugar.
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-slate-400">
            Gestiona productos, clientes, inventario, ventas y métricas de
            negocio desde una plataforma centralizada.
          </p>
        </div>

        <p className="text-sm text-slate-500">ERP Empresarial</p>
      </section>

      {/* Login */}

      <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <h1 className="text-2xl font-bold">ERP Empresarial</h1>

            <p className="text-sm text-muted-foreground">
              Sistema de gestión empresarial
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Iniciar sesión
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Ingresa tus credenciales para acceder al sistema.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-lg border border-danger/20 bg-danger/5 p-4">
                <p className="text-sm font-medium text-danger">{error}</p>
              </div>
            )}

            <form onSubmit={manejarEnvio} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="correo"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Correo electrónico
                </label>

                <input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={(event) => setCorreo(event.target.value)}
                  placeholder="admin@erp.com"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Contraseña
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Acceso exclusivo para usuarios autorizados.
          </p>
        </div>
      </section>
    </main>
  );
}
