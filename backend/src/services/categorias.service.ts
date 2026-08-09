import { prisma } from "../config/prisma.js";

export function obtenerCategorias() {
  return prisma.categoria.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export function crearCategoria(datos: {
  nombre: string;
  descripcion: string | null;
}) {
  return prisma.categoria.create({
    data: {
      nombre: datos.nombre,
      descripcion: datos.descripcion,
    },
  });
}

export function actualizarCategoria(
  id: number,
  datos: {
    nombre: string;
    descripcion: string | null;
  }
) {
  return prisma.categoria.update({
    where: { id },
    data: {
      nombre: datos.nombre,
      descripcion: datos.descripcion,
    },
  });
}

export function eliminarCategoria(id: number) {
  return prisma.categoria.delete({
    where: { id },
  });
}