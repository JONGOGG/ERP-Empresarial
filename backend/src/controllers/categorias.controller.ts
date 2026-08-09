import type { NextFunction, Request, Response } from "express";

import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../services/categorias.service.js";

import { categoriasSchema } from "../schemas/categorias.schema.js";

export async function listarCategorias(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const categorias = await obtenerCategorias();

    return res.json(categorias);
  } catch (error) {
    next(error);
  }
}

export async function registrarCategoria(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const resultado = categoriasSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        mensaje: "Datos inválidos",
        errores: resultado.error.flatten().fieldErrors,
      });
    }

    const categoria = await crearCategoria({
      nombre: resultado.data.nombre,
      descripcion: resultado.data.descripcion ?? null,
    });

    return res.status(201).json(categoria);
  } catch (error) {
    next(error);
  }
}

export async function editarCategoria(req: Request, res: Response, next: NextFunction,) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    const resultado = categoriasSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        mensaje: "Datos inválidos",
        errores: resultado.error.flatten().fieldErrors,
      });
    }

    const categoria = await actualizarCategoria(id, {
      nombre: resultado.data.nombre,
      descripcion: resultado.data.descripcion ?? null,
    });

    return res.json(categoria);
  } catch (error) {
    next(error);
  }
}

export async function borrarCategoria(req: Request, res: Response, next: NextFunction,) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    await eliminarCategoria(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
