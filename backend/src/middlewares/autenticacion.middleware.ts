import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  correo: string;
  rol: string;
}

export function verificarToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const encabezado = req.headers.authorization;

  if (!encabezado) {
    return res.status(401).json({
      mensaje: "Token no proporcionado",
    });
  }

  const [tipo, token] = encabezado.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({
      mensaje: "Formato de token inválido",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      mensaje: "JWT_SECRET no está configurado",
    });
  }

  try {
    const payload = jwt.verify(token, secret) as TokenPayload;

    req.usuario = payload;

    next();
  } catch {
    return res.status(401).json({
      mensaje: "Token inválido o expirado",
    });
  }
}