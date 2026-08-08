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
  password: string
): Promise<RespuestaLogin> {
  const respuesta = await fetch(
    "http://localhost:3001/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo,
        password,
      }),
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje || "No se pudo iniciar sesión"
    );
  }

  return datos;
}