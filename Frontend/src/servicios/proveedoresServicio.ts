import type { Proveedor } from "../tipos/Proveedor";
import { apiFetch } from "./api";

interface DatosProveedor {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
}

export async function obtenerProveedores(): Promise<
  Proveedor[]
> {
  const respuesta =
    await apiFetch("/proveedores");

  if (!respuesta.ok) {
    throw new Error(
      "No se pudieron obtener los proveedores"
    );
  }

  return respuesta.json();
}

export async function crearProveedor(
  datos: DatosProveedor
): Promise<Proveedor> {
  const respuesta = await apiFetch(
    "/proveedores",
    {
      method: "POST",
      body: JSON.stringify(datos),
    }
  );

  if (!respuesta.ok) {
    const texto = await respuesta.text();

    let mensaje =
      "No se pudo crear el proveedor";

    try {
      const error = JSON.parse(texto);

      if (error.mensaje) {
        mensaje = error.mensaje;
      }
    } catch {
      // Usamos el mensaje genérico
    }

    throw new Error(mensaje);
  }

  return respuesta.json();
}

export async function actualizarProveedor(
  id: number,
  datos: DatosProveedor
): Promise<Proveedor> {
  const respuesta = await apiFetch(
    `/proveedores/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(datos),
    }
  );

  if (!respuesta.ok) {
    const texto = await respuesta.text();

    let mensaje =
      "No se pudo actualizar el proveedor";

    try {
      const error = JSON.parse(texto);

      if (error.mensaje) {
        mensaje = error.mensaje;
      }
    } catch {
      // Usamos el mensaje genérico
    }

    throw new Error(mensaje);
  }

  return respuesta.json();
}

export async function eliminarProveedor(
  id: number
): Promise<void> {
  const respuesta = await apiFetch(
    `/proveedores/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!respuesta.ok) {
    throw new Error(
      "No se pudo eliminar el proveedor"
    );
  }
}