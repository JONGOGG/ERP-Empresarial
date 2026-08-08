import type { Categoria } from "../tipos/Categoria";

const API_URL = "http://localhost:3001/api/categorias";

function obtenerHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function obtenerCategorias(): Promise<Categoria[]> {
  const respuesta = await fetch(API_URL, {
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
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
  }
): Promise<Categoria> {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo actualizar la categoría");
  }

  return respuesta.json();
}

export async function eliminarCategoria(id: number): Promise<void> {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo eliminar la categoría");
  }
}

