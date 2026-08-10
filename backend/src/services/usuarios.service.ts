import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";

interface DatosCrearUsuario {
  nombre: string;
  correo: string;
  password: string;
  rol: "ADMIN" | "EMPLEADO";
}

interface DatosActualizarUsuario {
  nombre: string;
  correo: string;
  rol: "ADMIN" | "EMPLEADO";
  activo: boolean;
}

export function obtenerUsuarios() {
  return prisma.usuario.findMany({
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function crearUsuario(datos: DatosCrearUsuario) {
  const passwordCifrado = await bcrypt.hash(datos.password, 10);

  return prisma.usuario.create({
    data: {
      nombre: datos.nombre,
      correo: datos.correo,
      password: passwordCifrado,
      rol: datos.rol,
    },
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
      createdAt: true,
    },
  });
}

export function actualizarUsuario(id: number, datos: DatosActualizarUsuario) {
  return prisma.usuario.update({
    where: {
      id,
    },
    data: {
      nombre: datos.nombre,
      correo: datos.correo,
      rol: datos.rol,
      activo: datos.activo,
    },
    select: {
      id: true,
      nombre: true,
      correo: true,
      rol: true,
      activo: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
