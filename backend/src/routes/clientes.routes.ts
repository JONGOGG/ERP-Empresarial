import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.json(clientes);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener los clientes",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      correo,
      telefono,
      ciudad,
    } = req.body;

    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        correo,
        telefono,
        ciudad,
      },
    });

    res.status(201).json(cliente);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear el cliente",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      nombre,
      correo,
      telefono,
      ciudad,
    } = req.body;

    const cliente = await prisma.cliente.update({
      where: {
        id,
      },
      data: {
        nombre,
        correo,
        telefono,
        ciudad,
      },
    });

    res.json(cliente);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar el cliente",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.cliente.delete({
      where: {
        id,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar el cliente",
    });
  }
});

export default router;