import { apiFetch } from "./api";
interface RespuestaLogin {
  mensaje: string;
  token: string;
  usuario: {
    id: number;
    nombre: string;
    correo: string;
    rol: string;
  };
}

export async function iniciarSesion(
  correo: string,
  password: string,
): Promise<RespuestaLogin> {
  const respuesta = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      correo,
      password,
    }),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "No se pudo iniciar sesión");
  }

  return datos;
}
