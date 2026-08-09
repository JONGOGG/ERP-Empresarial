import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

export function manejarErrores(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(error);

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return res.status(409).json({
      mensaje: "Ya existe un registro con ese valor único",
    });
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2003"
  ) {
    return res.status(400).json({
      mensaje: "Existe una relación inválida con otro registro",
    });
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return res.status(404).json({
      mensaje: "El registro solicitado no existe",
    });
  }

  return res.status(500).json({
    mensaje: "Error interno del servidor",
  });
}