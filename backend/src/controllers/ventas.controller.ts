import type { NextFunction, Request, Response } from "express";

import { ventaSchema } from "../schemas/ventas.schema.js";

import {
  crearVenta,
  obtenerVentas,
  obtenerVentaPorId,
} from "../services/ventas.service.js";

export async function registrarVenta(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const resultado = ventaSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        mensaje: "Datos inválidos",
        errores: resultado.error.flatten().fieldErrors,
      });
    }

    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado",
      });
    }

    const venta = await crearVenta({
      clienteId: resultado.data.clienteId,
      usuarioId: req.usuario.id,
      productos: resultado.data.productos,
    });

    return res.status(201).json(venta);
  } catch (error) {
    next(error);
  }
}

export async function listarVentas(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const ventas = await obtenerVentas();

    return res.json(ventas);
  } catch (error) {
    next(error);
  }
}

export async function obtenerVenta(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    const venta = await obtenerVentaPorId(id);

    if (!venta) {
      return res.status(404).json({
        mensaje: "Venta no encontrada",
      });
    }

    return res.json(venta);
  } catch (error) {
    next(error);
  }
}
