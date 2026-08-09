import { prisma } from "../config/prisma.js";

export function obtenerClientes() {
  return prisma.cliente.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export function crearCliente(datos: {
  nombre: string;
  correo: string;
  telefono: string;
  ciudad: string;
}) {
  return prisma.cliente.create({
    data: {
      nombre: datos.nombre,
      correo: datos.correo,
      telefono: datos.telefono,
      ciudad: datos.ciudad,
    },
  });
}

export function actualizarCliente(
  id: number,
  datos: {
    nombre: string;
    correo: string;
    telefono: string;
    ciudad: string;
  },
) {
  return prisma.cliente.update({
    where: {
      id,
    },
    data: {
      nombre: datos.nombre,
      correo: datos.correo,
      telefono: datos.telefono,
      ciudad: datos.ciudad,
    },
  });
}

export function eliminarCliente(id: number) {
  return prisma.cliente.delete({
    where: {
      id,
    },
  });
}
