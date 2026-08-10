import { useEffect, useState } from "react";

import type { Proveedor } from "../tipos/Proveedor";

import {
  obtenerProveedores,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
} from "../servicios/proveedoresServicio";

export function Proveedores() {
  const [proveedores, setProveedores] =
    useState<Proveedor[]>([]);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const [
    proveedorEditando,
    setProveedorEditando,
  ] = useState<Proveedor | null>(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        setError("");

        const datos =
          await obtenerProveedores();

        setProveedores(datos);
      } catch (error) {
        console.error(error);

        setError(
          "No se pudieron cargar los proveedores"
        );
      } finally {
        setCargando(false);
      }
    };

    cargarProveedores();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setCorreo("");
    setTelefono("");
    setDireccion("");
    setProveedorEditando(null);
  };

  const guardarProveedor = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!nombre.trim()) {
      setError(
        "El nombre del proveedor es obligatorio"
      );
      return;
    }

    const datos = {
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
    };

    try {
      setError("");

      if (proveedorEditando) {
        const actualizado =
          await actualizarProveedor(
            proveedorEditando.id,
            datos
          );

        setProveedores(
          (proveedoresActuales) =>
            proveedoresActuales.map(
              (proveedor) =>
                proveedor.id ===
                actualizado.id
                  ? actualizado
                  : proveedor
            )
        );
      } else {
        const nuevo =
          await crearProveedor(datos);

        setProveedores(
          (proveedoresActuales) => [
            ...proveedoresActuales,
            nuevo,
          ]
        );
      }

      limpiarFormulario();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "No se pudo guardar el proveedor"
        );
      }
    }
  };

  const seleccionarProveedor = (
    proveedor: Proveedor
  ) => {
    setProveedorEditando(proveedor);

    setNombre(proveedor.nombre);
    setCorreo(proveedor.correo ?? "");
    setTelefono(proveedor.telefono ?? "");
    setDireccion(proveedor.direccion ?? "");

    setError("");
  };

  const manejarEliminarProveedor =
    async (id: number) => {
      try {
        setError("");

        await eliminarProveedor(id);

        setProveedores(
          (proveedoresActuales) =>
            proveedoresActuales.filter(
              (proveedor) =>
                proveedor.id !== id
            )
        );

        if (
          proveedorEditando?.id === id
        ) {
          limpiarFormulario();
        }
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(
            "No se pudo eliminar el proveedor"
          );
        }
      }
    };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-foreground";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Proveedores
        </h1>

        <p className="mt-1 text-muted-foreground">
          Administra los proveedores de la empresa.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
          <p className="text-sm font-medium text-danger">
            {error}
          </p>
        </div>
      )}

      <section className="rounded-xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">
            {proveedorEditando
              ? "Editar proveedor"
              : "Nuevo proveedor"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {proveedorEditando
              ? "Modifica la información del proveedor."
              : "Registra un proveedor para tus compras."}
          </p>
        </div>

        <form
          onSubmit={guardarProveedor}
          className="p-6"
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="nombre"
                className={labelClass}
              >
                Nombre
              </label>

              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(event) =>
                  setNombre(
                    event.target.value
                  )
                }
                placeholder="Ej. Distribuidora Norte"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="correo"
                className={labelClass}
              >
                Correo
              </label>

              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) =>
                  setCorreo(
                    event.target.value
                  )
                }
                placeholder="ventas@proveedor.com"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="telefono"
                className={labelClass}
              >
                Teléfono
              </label>

              <input
                id="telefono"
                type="text"
                value={telefono}
                onChange={(event) =>
                  setTelefono(
                    event.target.value
                  )
                }
                placeholder="4921234567"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="direccion"
                className={labelClass}
              >
                Dirección
              </label>

              <input
                id="direccion"
                type="text"
                value={direccion}
                onChange={(event) =>
                  setDireccion(
                    event.target.value
                  )
                }
                placeholder="Zacatecas, Zac."
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {proveedorEditando
                ? "Guardar cambios"
                : "Agregar proveedor"}
            </button>

            {proveedorEditando && (
              <button
                type="button"
                onClick={limpiarFormulario}
                className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">
            Proveedores registrados
          </h2>

          <p className="text-sm text-muted-foreground">
            {proveedores.length} proveedores
          </p>
        </div>

        {cargando ? (
          <div className="p-8 text-center text-muted-foreground">
            Cargando proveedores...
          </div>
        ) : proveedores.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No hay proveedores registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 font-medium">
                    Nombre
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Correo
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Teléfono
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Dirección
                  </th>

                  <th className="px-6 py-3 text-right font-medium">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {proveedores.map(
                  (proveedor) => (
                    <tr
                      key={proveedor.id}
                      className="border-t border-border hover:bg-muted/50"
                    >
                      <td className="px-6 py-4 font-medium">
                        {proveedor.nombre}
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {proveedor.correo ||
                          "Sin correo"}
                      </td>

                      <td className="px-6 py-4">
                        {proveedor.telefono ||
                          "Sin teléfono"}
                      </td>

                      <td className="px-6 py-4">
                        {proveedor.direccion ||
                          "Sin dirección"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              seleccionarProveedor(
                                proveedor
                              )
                            }
                            className="rounded-lg border border-border px-3 py-2 text-xs font-medium transition hover:bg-muted"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              manejarEliminarProveedor(
                                proveedor.id
                              )
                            }
                            className="rounded-lg px-3 py-2 text-xs font-medium text-danger transition hover:bg-danger/10"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}