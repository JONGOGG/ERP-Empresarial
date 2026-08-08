import type { Request, Response } from "express";

import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../services/categorias.service.js";

export async function listarCategorias(
  _req: Request,
  res: Response
) {
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

export async function registrarCategoria(
  req: Request,
  res: Response
) {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre?.trim()) {
      return res.status(400).json({
        mensaje: "El nombre es obligatorio",
      });
    }

    const categoria = await crearCategoria({
      nombre: nombre.trim(),
      descripcion: descripcion?.trim(),
    });

    return res.status(201).json(categoria);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al crear la categoría",
    });
  }
}

export async function editarCategoria(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    if (!nombre?.trim()) {
      return res.status(400).json({
        mensaje: "El nombre es obligatorio",
      });
    }

    const categoria = await actualizarCategoria(id, {
      nombre: nombre.trim(),
      descripcion: descripcion?.trim(),
    });

    return res.json(categoria);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al actualizar la categoría",
    });
  }
}

export async function borrarCategoria(
  req: Request,
  res: Response
) {
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