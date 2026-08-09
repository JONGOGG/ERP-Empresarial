import { prisma } from "../config/prisma.js";

export function obtenerProductos() {
  return prisma.producto.findMany({
    orderBy: {
      id: "asc",
    },
    include: {
      categoria: true,
    },
  });
}

export function crearProducto(datos: {
  nombre: string;
  sku: string;
  precio: number;
  stock: number;
  categoriaId: number;
}) {
  return prisma.producto.create({
    data: {
      nombre: datos.nombre,
      sku: datos.sku,
      precio: datos.precio,
      stock: datos.stock,
      categoriaId: datos.categoriaId,
    },
    include: {
      categoria: true,
    },
  });
}

export function actualizarProducto(
  id: number,
  datos: {
    nombre: string;
    sku: string;
    precio: number;
    stock: number;
    categoriaId: number;
  }
) {
  return prisma.producto.update({
    where: {
      id,
    },
    data: {
      nombre: datos.nombre,
      sku: datos.sku,
      precio: datos.precio,
      stock: datos.stock,
      categoriaId: datos.categoriaId,
    },
    include: {
      categoria: true,
    },
  });
}

export function eliminarProducto(id: number) {
  return prisma.producto.delete({
    where: {
      id,
    },
  });
}