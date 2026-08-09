import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../services/productos.service.js";

import { productoSchema } from "../schemas/productos.schema.js";

export async function listarProductos(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const productos = await obtenerProductos();

    return res.json(productos);
  } catch (error) {
    next(error);
  }
}

export async function registrarProducto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const resultado = productoSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        mensaje: "Datos inválidos",
        errores: resultado.error.flatten().fieldErrors,
      });
    }

    const producto = await crearProducto(resultado.data);

    return res.status(201).json(producto);
  } catch (error) {
    next(error);
  }
}

export async function editarProducto(
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

    const resultado = productoSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        mensaje: "Datos inválidos",
        errores: resultado.error.flatten().fieldErrors,
      });
    }

    const producto = await actualizarProducto(id, resultado.data);

    return res.json(producto);
  } catch (error) {
    next(error);
  }
}

export async function borrarProducto(
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

    await eliminarProducto(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
