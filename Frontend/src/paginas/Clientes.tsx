import { useEffect, useState } from "react";
import type { Cliente } from "../tipos/Cliente";

import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "../servicios/clientesServicios";

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");

  const [clienteEditando, setClienteEditando] =
    useState<Cliente | null>(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarClientes = async () => {
      try {
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

  const guardarCliente = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
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
        const actualizado = await actualizarCliente(
          clienteEditando.id,
          datos
        );

        setClientes((clientesActuales) =>
          clientesActuales.map((cliente) =>
            cliente.id === actualizado.id
              ? actualizado
              : cliente
          )
        );
      } else {
        const nuevo = await crearCliente(datos);

        setClientes((clientesActuales) => [
          ...clientesActuales,
          nuevo,
        ]);
      }

      limpiarFormulario();
    } catch (error) {
      console.error(error);
      setError("No se pudo guardar el cliente");
    }
  };

  const seleccionarCliente = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setNombre(cliente.nombre);
    setCorreo(cliente.correo);
    setTelefono(cliente.telefono);
    setCiudad(cliente.ciudad);
  };

  const manejarEliminarCliente = async (id: number) => {
    try {
      await eliminarCliente(id);

      setClientes((clientesActuales) =>
        clientesActuales.filter(
          (cliente) => cliente.id !== id
        )
      );

      if (clienteEditando?.id === id) {
        limpiarFormulario();
      }
    } catch (error) {
      console.error(error);
      setError("No se pudo eliminar el cliente");
    }
  };

  return (
    <section>
      <h1>Clientes</h1>
      <p>Administra los clientes del ERP.</p>

      <form onSubmit={guardarCliente}>
        <div>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(event) =>
              setNombre(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="correo">Correo</label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(event) =>
              setCorreo(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            type="text"
            value={telefono}
            onChange={(event) =>
              setTelefono(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="ciudad">Ciudad</label>
          <input
            id="ciudad"
            type="text"
            value={ciudad}
            onChange={(event) =>
              setCiudad(event.target.value)
            }
          />
        </div>

        <button type="submit">
          {clienteEditando
            ? "Guardar cambios"
            : "Agregar cliente"}
        </button>

        {clienteEditando && (
          <button
            type="button"
            onClick={limpiarFormulario}
          >
            Cancelar
          </button>
        )}
      </form>

      {error && <p>{error}</p>}

      <hr />

      {cargando ? (
        <p>Cargando clientes...</p>
      ) : clientes.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Ciudad</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.correo}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.ciudad}</td>

                <td>
                  <button
                    type="button"
                    onClick={() =>
                      seleccionarCliente(cliente)
                    }
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      manejarEliminarCliente(cliente.id)
                    }
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}