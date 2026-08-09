import type { Request, Response } from "express";

import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../services/categorias.service.js";

import { categoriasSchema } from "../schemas/categorias.schema.js";

export async function listarCategorias(_req: Request, res: Response) {
  try {
    const categorias = await obtenerCategorias();

    return res.json(categorias);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al obtener las categorías",
    });
  }
}

export async function registrarCategoria(req: Request, res: Response) {
  try {
    const resultado = categoriasSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        mensaje: "El nombre es obligatorio",
      });
    }

    const categoria = await crearCategoria(resultado.data);

    return res.status(201).json(categoria);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al crear la categoría",
    });
  }
}

export async function editarCategoria(req: Request, res: Response) {
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
        mensaje: "El nombre es obligatorio",
        errores: resultado.error.flatten().fieldErrors,
      });
    }

    const categoria = await actualizarCategoria(id, resultado.data);

    return res.json(categoria);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al actualizar la categoría",
    });
  }
}

export async function borrarCategoria(req: Request, res: Response) {
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
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al eliminar la categoría",
    });
  }
}
