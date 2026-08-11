import { useEffect, useState } from "react";
import type { Cliente } from "../tipos/Cliente";

import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "../servicios/clientesServicios";

export function Clientes() {
  const usuarioGuardado = localStorage.getItem("usuario");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const esAdmin = usuario?.rol === "ADMIN";

  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");

  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        setError("");

        const datos = await obtenerClientes();

        setClientes(datos);
      } catch (error) {
        console.error(error);

        setError("No se pudieron cargar los clientes");
      } finally {
        setCargando(false);
      }
    };

    cargarClientes();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setCorreo("");
    setTelefono("");
    setCiudad("");
    setClienteEditando(null);
  };

  const guardarCliente = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !nombre.trim() ||
      !correo.trim() ||
      !telefono.trim() ||
      !ciudad.trim()
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const datos = {
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      ciudad: ciudad.trim(),
    };

    try {
      setError("");

      if (clienteEditando) {
        const actualizado = await actualizarCliente(clienteEditando.id, datos);

        setClientes((clientesActuales) =>
          clientesActuales.map((cliente) =>
            cliente.id === actualizado.id ? actualizado : cliente,
          ),
        );
      } else {
        const nuevo = await crearCliente(datos);

        setClientes((clientesActuales) => [...clientesActuales, nuevo]);
      }

      limpiarFormulario();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudo guardar el cliente");
      }
    }
  };

  const seleccionarCliente = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setNombre(cliente.nombre);
    setCorreo(cliente.correo);
    setTelefono(cliente.telefono);
    setCiudad(cliente.ciudad);

    setError("");
  };

  const manejarEliminarCliente = async (id: number) => {
    try {
      setError("");

      await eliminarCliente(id);

      setClientes((clientesActuales) =>
        clientesActuales.filter((cliente) => cliente.id !== id),
      );

      if (clienteEditando?.id === id) {
        limpiarFormulario();
      }
    } catch (error) {
      console.error(error);

      setError("No se pudo eliminar el cliente");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

  return (
    <div className="space-y-6">
      {/* Encabezado */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>

        <p className="mt-1 text-muted-foreground">
          Administra los clientes del ERP.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
          <p className="text-sm font-medium text-danger">{error}</p>
        </div>
      )}

      {/* Formulario */}

      <section className="rounded-xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">
            {clienteEditando ? "Editar cliente" : "Nuevo cliente"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {clienteEditando
              ? "Modifica la información del cliente seleccionado."
              : "Registra un nuevo cliente en el sistema."}
          </p>
        </div>

        <form onSubmit={guardarCliente} className="p-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="nombre" className={labelClass}>
                Nombre
              </label>

              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                placeholder="Ej. Juan Pérez"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="correo" className={labelClass}>
                Correo
              </label>

              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="juan@correo.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="telefono" className={labelClass}>
                Teléfono
              </label>

              <input
                id="telefono"
                type="text"
                value={telefono}
                onChange={(event) => setTelefono(event.target.value)}
                placeholder="4921234567"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="ciudad" className={labelClass}>
                Ciudad
              </label>

              <input
                id="ciudad"
                type="text"
                value={ciudad}
                onChange={(event) => setCiudad(event.target.value)}
                placeholder="Zacatecas"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {clienteEditando ? "Guardar cambios" : "Agregar cliente"}
            </button>

            {clienteEditando && (
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

      {/* Tabla */}

      <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Clientes registrados</h2>

            <p className="text-sm text-muted-foreground">
              {clientes.length} clientes
            </p>
          </div>
        </div>

        {cargando ? (
          <div className="p-8 text-center text-muted-foreground">
            Cargando clientes...
          </div>
        ) : clientes.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No hay clientes registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 font-medium">Nombre</th>

                  <th className="px-6 py-3 font-medium">Correo</th>

                  <th className="px-6 py-3 font-medium">Teléfono</th>

                  <th className="px-6 py-3 font-medium">Ciudad</th>

                  <th className="px-6 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {clientes.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="border-t border-border transition hover:bg-muted/50"
                  >
                    <td className="px-6 py-4 font-medium">{cliente.nombre}</td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {cliente.correo}
                    </td>

                    <td className="px-6 py-4">{cliente.telefono}</td>

                    <td className="px-6 py-4">{cliente.ciudad}</td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => seleccionarCliente(cliente)}
                          className="rounded-lg border border-border px-3 py-2 text-xs font-medium transition hover:bg-muted"
                        >
                          Editar
                        </button>
                        {esAdmin && (
                          <button
                            type="button"
                            onClick={() => manejarEliminarCliente(cliente.id)}
                            className="rounded-lg px-3 py-2 text-xs font-medium text-danger transition hover:bg-danger/10"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
