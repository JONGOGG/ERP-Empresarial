import { Navigate, Outlet } from "react-router-dom";

export function RutaAdmin() {
  const usuarioGuardado = localStorage.getItem("usuario");

  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
