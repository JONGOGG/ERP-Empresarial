import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";

import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "../services/clientes.service.js";

import { clienteSchema } from "../schemas/clientes.schema.js";

export async function listarClientes(
  _req: Request,
  res: Response
) {
  try {
    const clientes = await obtenerClientes();

    return res.json(clientes);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al obtener los clientes",
    });
  }
}

export async function registrarCliente(
  req: Request,
  res: Response
) {
  try {
    const resultado = clienteSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        mensaje: "Datos inválidos",
        errores: resultado.error.flatten().fieldErrors,
      });
    }

    const cliente = await crearCliente(resultado.data);

    return res.status(201).json(cliente);
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        mensaje: "Ya existe un cliente con ese correo",
      });
    }

    return res.status(500).json({
      mensaje: "Error al crear el cliente",
    });
  }
}

export async function editarCliente(
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

    const resultado = clienteSchema.safeParse(req.body);

    if (!resultado.success) {
      return res.status(400).json({
        mensaje: "Datos inválidos",
        errores: resultado.error.flatten().fieldErrors,
      });
    }

    const cliente = await actualizarCliente(
      id,
      resultado.data
    );

    return res.json(cliente);
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        mensaje: "Ya existe otro cliente con ese correo",
      });
    }

    return res.status(500).json({
      mensaje: "Error al actualizar el cliente",
    });
  }
}

export async function borrarCliente(
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

    await eliminarCliente(id);

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al eliminar cliente",
    });
  }
}