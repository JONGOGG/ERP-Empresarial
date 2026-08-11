import { useEffect, useState } from "react";

import type { Usuario } from "../tipos/Usuario";

import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  cambiarPasswordUsuario,
} from "../servicios/usuariosServicio";

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<"ADMIN" | "EMPLEADO">("EMPLEADO");

  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [usuarioPassword, setUsuarioPassword] = useState<Usuario | null>(null);

  const [nuevoPassword, setNuevoPassword] = useState("");

  const [cambiandoPassword, setCambiandoPassword] = useState(false);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setError("");

        const datos = await obtenerUsuarios();

        setUsuarios(datos);
      } catch (error) {
        console.error(error);

        setError("No se pudieron cargar los usuarios");
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setCorreo("");
    setPassword("");
    setRol("EMPLEADO");
    setUsuarioEditando(null);
    setError("");
  };

  const seleccionarUsuario = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setRol(usuario.rol);
    setPassword("");
    setError("");
  };

  const guardarUsuario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nombre.trim() || !correo.trim()) {
      setError("Nombre y correo son obligatorios");
      return;
    }

    try {
      setError("");

      if (usuarioEditando) {
        const actualizado = await actualizarUsuario(usuarioEditando.id, {
          nombre: nombre.trim(),
          correo: correo.trim(),
          rol,
          activo: usuarioEditando.activo,
        });

        setUsuarios((actuales) =>
          actuales.map((usuario) =>
            usuario.id === actualizado.id ? actualizado : usuario,
          ),
        );
      } else {
        if (password.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres");
          return;
        }

        const nuevo = await crearUsuario({
          nombre: nombre.trim(),
          correo: correo.trim(),
          password,
          rol,
        });

        setUsuarios((actuales) => [...actuales, nuevo]);
      }

      limpiarFormulario();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudo guardar el usuario");
      }
    }
  };

  const cambiarEstadoUsuario = async (usuario: Usuario) => {
    try {
      setError("");

      const actualizado = await actualizarUsuario(usuario.id, {
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        activo: !usuario.activo,
      });

      setUsuarios((actuales) =>
        actuales.map((item) =>
          item.id === actualizado.id ? actualizado : item,
        ),
      );
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };
  const guardarNuevoPassword = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!usuarioPassword) {
      return;
    }

    if (nuevoPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setCambiandoPassword(true);
      setError("");

      await cambiarPasswordUsuario(usuarioPassword.id, nuevoPassword);

      setUsuarioPassword(null);
      setNuevoPassword("");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudo cambiar la contraseña");
      }
    } finally {
      setCambiandoPassword(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>

        <p className="mt-1 text-muted-foreground">
          Administra empleados, roles y acceso al sistema.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
          <p className="text-sm font-medium text-danger">{error}</p>
        </div>
      )}

      <section className="rounded-xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">
            {usuarioEditando ? "Editar usuario" : "Nuevo usuario"}
          </h2>
        </div>

        <form onSubmit={guardarUsuario} className="p-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              className={inputClass}
            />

            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@empresa.com"
              className={inputClass}
            />

            {!usuarioEditando && (
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className={inputClass}
              />
            )}

            <select
              value={rol}
              onChange={(e) => setRol(e.target.value as "ADMIN" | "EMPLEADO")}
              className={inputClass}
            >
              <option value="EMPLEADO">EMPLEADO</option>

              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              {usuarioEditando ? "Guardar cambios" : "Crear usuario"}
            </button>

            {usuarioEditando && (
              <button
                type="button"
                onClick={limpiarFormulario}
                className="rounded-lg border border-border px-5 py-2.5 text-sm"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        {cargando ? (
          <div className="p-8 text-center text-muted-foreground">
            Cargando usuarios...
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Correo</th>
                <th className="px-6 py-3">Rol</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-t border-border">
                  <td className="px-6 py-4 font-medium">{usuario.nombre}</td>

                  <td className="px-6 py-4">{usuario.correo}</td>

                  <td className="px-6 py-4">{usuario.rol}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        usuario.activo
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      }`}
                    >
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => seleccionarUsuario(usuario)}
                        className="rounded-lg border border-border px-3 py-2 text-xs"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => cambiarEstadoUsuario(usuario)}
                        className="rounded-lg px-3 py-2 text-xs text-danger"
                      >
                        {usuario.activo ? "Desactivar" : "Activar"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUsuarioPassword(usuario);
                          setNuevoPassword("");
                          setError("");
                        }}
                        className="rounded-lg border border-border px-3 py-2 text-xs font-medium transition hover:bg-muted"
                      >
                        Cambiar contraseña
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {usuarioPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl">
              <h2 className="text-xl font-semibold">Cambiar contraseña</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Usuario: {usuarioPassword.nombre}
              </p>

              <form onSubmit={guardarNuevoPassword} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="nuevoPassword"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Nueva contraseña
                  </label>

                  <input
                    id="nuevoPassword"
                    type="password"
                    value={nuevoPassword}
                    onChange={(event) => setNuevoPassword(event.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setUsuarioPassword(null);
                      setNuevoPassword("");
                    }}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={cambiandoPassword}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    {cambiandoPassword ? "Guardando..." : "Cambiar contraseña"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
