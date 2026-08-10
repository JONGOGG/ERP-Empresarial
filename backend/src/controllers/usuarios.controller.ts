import type { NextFunction, Request, Response } from "express";

import {
  crearUsuarioSchema,
  actualizarUsuarioSchema,
} from "../schemas/usuarios.schema.js";

import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
} from "../services/usuarios.service.js";

export async function listarUsuarios(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const usuarios = await obtenerUsuarios();

    return res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

export async function registrarUsuario(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const resultado = crearUsuarioSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        mensaje: "Datos inválidos",
        errores: resultado.error.flatten().fieldErrors,
      });
    }

    const usuario = await crearUsuario(resultado.data);

    return res.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
}

export async function editarUsuario(
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

    const resultado = actualizarUsuarioSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        mensaje: "Datos inválidos",
        errores: resultado.error.flatten().fieldErrors,
      });
    }

    const usuario = await actualizarUsuario(id, resultado.data);

    return res.json(usuario);
  } catch (error) {
    next(error);
  }
}
