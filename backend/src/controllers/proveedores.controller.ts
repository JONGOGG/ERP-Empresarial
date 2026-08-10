import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { proveedorSchema } from "../schemas/proveedores.schema.js";

import {
  obtenerProveedores,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
} from "../services/proveedores.service.js";

export async function listarProveedores(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const proveedores = await obtenerProveedores();

    return res.json(proveedores);
  } catch (error) {
    next(error);
  }
}

export async function registrarProveedor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const resultado =
      proveedorSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        mensaje: "Datos inválidos",
        errores:
          resultado.error.flatten().fieldErrors,
      });
    }

    const proveedor = await crearProveedor({
      nombre: resultado.data.nombre,
      correo:
        resultado.data.correo || null,
      telefono:
        resultado.data.telefono || null,
      direccion:
        resultado.data.direccion || null,
    });

    return res.status(201).json(proveedor);
  } catch (error) {
    next(error);
  }
}

export async function editarProveedor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    const resultado =
      proveedorSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        mensaje: "Datos inválidos",
        errores:
          resultado.error.flatten().fieldErrors,
      });
    }

    const proveedor =
      await actualizarProveedor(id, {
        nombre: resultado.data.nombre,
        correo:
          resultado.data.correo || null,
        telefono:
          resultado.data.telefono || null,
        direccion:
          resultado.data.direccion || null,
      });

    return res.json(proveedor);
  } catch (error) {
    next(error);
  }
}

export async function borrarProveedor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    await eliminarProveedor(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}