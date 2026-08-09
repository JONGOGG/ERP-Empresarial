import type {
  NextFunction,
  Request,
  Response,
} from "express";

export function permitirRoles(...rolesPermitidos: string[]) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado",
      });
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({
        mensaje: "No tienes permisos para realizar esta acción",
      });
    }

    next();
  };
}