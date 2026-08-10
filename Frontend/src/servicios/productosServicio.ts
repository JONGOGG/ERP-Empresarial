import type { Producto } from "../tipos/Productos";
import { apiFetch } from "./api";

interface DatosProducto {
  nombre: string;
  sku: string;
  precio: number;
  stock: number;
  categoriaId: number;
}
function obtenerHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function obtenerProductos(): Promise<Producto[]> {
  const respuesta = await apiFetch("/productos", {
    headers: obtenerHeaders(),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los productos");
  }

  return respuesta.json();
}

export async function crearProducto(datos: DatosProducto): Promise<Producto> {
  const respuesta = await apiFetch("/productos", {
    method: "POST",

    headers: obtenerHeaders(),

    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo crear el producto");
  }

  return respuesta.json();
}

export async function actualizarProducto(
  id: number,
  datos: DatosProducto,
): Promise<Producto> {
  const respuesta = await apiFetch(`/productos/${id}`, {
    method: "PUT",

    headers: obtenerHeaders(),

    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo actualizar el producto");
  }

  return respuesta.json();
}

export async function eliminarProducto(id: number): Promise<void> {
  const respuesta = await apiFetch(`/productos/${id}`, {
    method: "DELETE",
    headers: obtenerHeaders(),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo eliminar el producto");
  }
}
