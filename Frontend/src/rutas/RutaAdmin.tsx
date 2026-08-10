import { Navigate, Outlet } from "react-router-dom";

interface UsuarioGuardado {
  id: number;
  nombre: string;
  correo: string;
  rol: "ADMIN" | "EMPLEADO";
  activo?: boolean;
}

export function RutaAdmin() {
  const usuarioGuardado = localStorage.getItem("usuario");

  // Si no existe usuario guardado, regresar al login
  if (!usuarioGuardado) {
    return <Navigate to="/login" replace />;
  }

  try {
    const usuario: UsuarioGuardado = JSON.parse(usuarioGuardado);

    // Si no es ADMIN, no puede entrar
    if (usuario.rol !== "ADMIN") {
      return <Navigate to="/dashboard" replace />;
    }

    // Es ADMIN, permitir acceso a las rutas internas
    return <Outlet />;
  } catch {
    // Si el usuario guardado está corrupto
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    return <Navigate to="/login" replace />;
  }
}
