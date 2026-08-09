import type { Cliente } from "../tipos/Cliente";
import { apiFetch } from "./api";

interface DatosCliente {
  nombre: string;
  correo: string;
  telefono: string;
  ciudad: string;
}

export async function obtenerClientes(): Promise<Cliente[]> {
  const respuesta = await apiFetch("/clientes");

  if (!respuesta.ok) {
    const texto = await respuesta.text();
    console.error("Error obtenerClientes:", texto);

    throw new Error("No se pudieron obtener los clientes");
  }

  return respuesta.json();
}

export async function crearCliente(datos: DatosCliente): Promise<Cliente> {
  const respuesta = await apiFetch("/clientes", {
    method: "POST",
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    const texto = await respuesta.text();
    console.error("Error crearCliente:", texto);

    throw new Error("No se pudo crear el cliente");
  }

  return respuesta.json();
}

export async function actualizarCliente(
  id: number,
  datos: DatosCliente,
): Promise<Cliente> {
  const respuesta = await apiFetch(`/clientes/${id}`, {
    method: "PUT",
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    const texto = await respuesta.text();

    console.error("STATUS:", respuesta.status);
    console.error("BACKEND:", texto);

    let mensaje = "No se pudo actualizar el cliente";

    try {
      const datosError = JSON.parse(texto);

      if (datosError.mensaje) {
        mensaje = datosError.mensaje;
      }
    } catch {
      // Si no era JSON, conservamos el mensaje genérico.
    }

    throw new Error(mensaje);
  }

  return respuesta.json();
}
export async function eliminarCliente(id: number): Promise<void> {
  const respuesta = await apiFetch(`/clientes/${id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    const texto = await respuesta.text();
    console.error("Error eliminarCliente:", texto);

    throw new Error("No se pudo eliminar el cliente");
  }
}
