import type { Categoria } from "../tipos/Categoria";
import { apiFetch } from "./api";

function obtenerHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function obtenerCategorias(): Promise<Categoria[]> {
  const respuesta = await apiFetch("/categorias", {
    headers: obtenerHeaders(),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener las categorías");
  }

  return respuesta.json();
}

export async function crearCategoria(datos: {
  nombre: string;
  descripcion: string;
}): Promise<Categoria> {
  const respuesta = await apiFetch("/categorias", {
    method: "POST",
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo crear la categoría");
  }

  return respuesta.json();
}

export async function actualizarCategoria(
  id: number,
  datos: {
    nombre: string;
    descripcion: string;
  },
): Promise<Categoria> {
  const respuesta = await apiFetch(`${"/categorias"}/${id}`, {
    method: "PUT",
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo actualizar la categoría");
  }

  return respuesta.json();
}

export async function eliminarCategoria(id: number): Promise<void> {
  const respuesta = await apiFetch(`/categorias/${id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo eliminar la categoría");
  }
}
