import { useState } from "react";
import { useDatos } from "../contexto/DatosContexto";
import type { Cliente } from "../tipos/Cliente";

export function Clientes() {
  const { clientes, setClientes } = useDatos();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  const limpiarFormulario = () => {
    setNombre("");
    setCorreo("");
    setTelefono("");
    setCiudad("");
    setClienteEditando(null);
  };

  const guardarCliente = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !nombre.trim() ||
      !correo.trim() ||
      !telefono.trim() ||
      !ciudad.trim()
    ) {
      return;
    }

    if (clienteEditando) {
      setClientes(
        clientes.map((cliente) =>
          cliente.id === clienteEditando.id
            ? {
                ...cliente,
                nombre,
                correo,
                telefono,
                ciudad,
              }
            : cliente,
        ),
      );
    } else {
      const nuevoCliente: Cliente = {
        id: Date.now(),
        nombre,
        correo,
        telefono,
        ciudad,
      };

      setClientes([...clientes, nuevoCliente]);
    }

    limpiarFormulario();
  };

  const seleccionarCliente = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setNombre(cliente.nombre);
    setCorreo(cliente.correo);
    setTelefono(cliente.telefono);
    setCiudad(cliente.ciudad);
  };

  const eliminarCliente = (id: number) => {
    setClientes(clientes.filter((cliente) => cliente.id !== id));
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
            onChange={(event) => setNombre(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="correo">Correo</label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            type="text"
            value={telefono}
            onChange={(event) => setTelefono(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="ciudad">Ciudad</label>
          <input
            id="ciudad"
            type="text"
            value={ciudad}
            onChange={(event) => setCiudad(event.target.value)}
          />
        </div>

        <button type="submit">
          {clienteEditando ? "Guardar cambios" : "Agregar cliente"}
        </button>

        {clienteEditando && (
          <button type="button" onClick={limpiarFormulario}>
            Cancelar
          </button>
        )}
      </form>

      <hr />

      {clientes.length === 0 ? (
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
                  <button onClick={() => seleccionarCliente(cliente)}>
                    Editar
                  </button>

                  <button onClick={() => eliminarCliente(cliente.id)}>
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
