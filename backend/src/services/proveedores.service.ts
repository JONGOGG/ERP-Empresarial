import { prisma } from "../config/prisma.js";

interface DatosProveedor {
  nombre: string;
  correo?: string | null;
  telefono?: string | null;
  direccion?: string | null;
}

export function obtenerProveedores() {
  return prisma.proveedor.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export function crearProveedor(datos: DatosProveedor) {
  return prisma.proveedor.create({
    data: {
      nombre: datos.nombre,
      correo: datos.correo || null,
      telefono: datos.telefono || null,
      direccion: datos.direccion || null,
    },
  });
}

export function actualizarProveedor(id: number, datos: DatosProveedor) {
  return prisma.proveedor.update({
    where: {
      id,
    },
    data: {
      nombre: datos.nombre,
      correo: datos.correo || null,
      telefono: datos.telefono || null,
      direccion: datos.direccion || null,
    },
  });
}

export function eliminarProveedor(id: number) {
  return prisma.proveedor.delete({
    where: {
      id,
    },
  });
}
