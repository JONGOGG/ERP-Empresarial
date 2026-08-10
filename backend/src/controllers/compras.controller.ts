import type { NextFunction, Request, Response } from "express";

import { compraSchema } from "../schemas/compras.schema.js";

import {
  crearCompra,
  obtenerCompras,
  obtenerCompraPorId,
} from "../services/compras.service.js";

export async function registrarCompra(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const resultado = compraSchema.safeParse(req.body);

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

    const compra = await crearCompra({
      proveedorId: resultado.data.proveedorId,
      usuarioId: req.usuario.id,
      productos: resultado.data.productos,
    });

    return res.status(201).json(compra);
  } catch (error) {
    next(error);
  }
}

export async function listarCompras(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const compras = await obtenerCompras();

    return res.json(compras);
  } catch (error) {
    next(error);
  }
}

export async function obtenerCompra(
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

    const compra = await obtenerCompraPorId(id);

    if (!compra) {
      return res.status(404).json({
        mensaje: "Compra no encontrada",
      });
    }

    return res.json(compra);
  } catch (error) {
    next(error);
  }
}
