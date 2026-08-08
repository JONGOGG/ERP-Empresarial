import type { Cliente } from "../tipos/Cliente";
import { apiFetch } from "./api";

interface DatosCliente {
  nombre: string;
  correo: string;
  telefono: string;
  ciudad: string;
}

function obtenerHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
export async function obtenerClientes(): Promise<Cliente[]> {
  const respuesta = await apiFetch("/clientes", {
    headers: obtenerHeaders(),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los clientes");
  }

  return respuesta.json();
}

export async function crearCliente(datos: DatosCliente): Promise<Cliente> {
  const respuesta = await apiFetch("/clientes", {
    method: "POST",
    headers: obtenerHeaders(),
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
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
    headers: obtenerHeaders(),
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo actualizar el cliente");
  }

  return respuesta.json();
}

export async function eliminarCliente(id: number): Promise<void> {
  const respuesta = await apiFetch(`/clientes/${id}`, {
    method: "DELETE",
    headers: obtenerHeaders(),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo eliminar el cliente");
  }
}
