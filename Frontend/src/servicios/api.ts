const API_BASE = "http://localhost:3001/api";

export async function apiFetch(
  ruta: string,
  opciones: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const headers = new Headers(opciones.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const respuesta = await fetch(`${API_BASE}${ruta}`, {
    ...opciones,
    headers,
  });

  if (respuesta.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.href = "/login";

    throw new Error("Sesión expirada");
  }

  return respuesta;
}