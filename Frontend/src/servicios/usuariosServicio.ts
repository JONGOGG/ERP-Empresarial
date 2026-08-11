import type { Usuario } from "../tipos/Usuario";
import { apiFetch } from "./api";

export interface CrearUsuarioInput {
  nombre: string;
  correo: string;
  password: string;
  rol: "ADMIN" | "EMPLEADO";
}

export interface ActualizarUsuarioInput {
  nombre: string;
  correo: string;
  rol: "ADMIN" | "EMPLEADO";
  activo: boolean;
}

export async function obtenerUsuarios(): Promise<Usuario[]> {
  const respuesta = await apiFetch("/usuarios");

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los usuarios");
  }

  return respuesta.json();
}

export async function crearUsuario(datos: CrearUsuarioInput): Promise<Usuario> {
  const respuesta = await apiFetch("/usuarios", {
    method: "POST",
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    const error = await respuesta.json();

    throw new Error(error.mensaje || "No se pudo crear el usuario");
  }

  return respuesta.json();
}

export async function actualizarUsuario(
  id: number,
  datos: ActualizarUsuarioInput,
): Promise<Usuario> {
  const respuesta = await apiFetch(`/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    const error = await respuesta.json();

    throw new Error(error.mensaje || "No se pudo actualizar el usuario");
  }

  return respuesta.json();
}

export async function cambiarPasswordUsuario(id: number, password: string) {
  const respuesta = await apiFetch(`/usuarios/${id}/password`, {
    method: "PUT",
    body: JSON.stringify({
      password,
    }),
  });

  if (!respuesta.ok) {
    const error = await respuesta.json();

    throw new Error(error.mensaje || "No se pudo cambiar la contraseña");
  }

  return respuesta.json();
}
