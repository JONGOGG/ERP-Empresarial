import type { NextFunction, Request, Response } from "express";

import {
  obtenerMovimientos,
  obtenerMovimientosProducto,
  ajustarInventario,
} from "../services/inventario.service.js";

import { ajusteInventarioSchema } from "../schemas/inventario.schema.js";

export async function listarMovimientos(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const movimientos = await obtenerMovimientos();

    return res.json(movimientos);
  } catch (error) {
    next(error);
  }
}

export async function listarMovimientosProducto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const productoId = Number(req.params.productoId);

    if (Number.isNaN(productoId)) {
      return res.status(400).json({
        mensaje: "ID de producto inválido",
      });
    }

    const movimientos = await obtenerMovimientosProducto(productoId);

    return res.json(movimientos);
  } catch (error) {
    next(error);
  }
}

export async function registrarAjusteInventario(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado",
      });
    }

    const resultado = ajusteInventarioSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        mensaje: "Datos inválidos",
        errores: resultado.error.flatten().fieldErrors,
      });
    }

    const producto = await ajustarInventario({
      productoId: resultado.data.productoId,
      cantidad: resultado.data.cantidad,
      motivo: resultado.data.motivo,
      usuarioId: req.usuario.id,
    });

    return res.json({
      mensaje: "Inventario ajustado correctamente",
      producto,
    });
  } catch (error) {
    next(error);
  }
}
