import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        categoria: true,
      },
    });

    res.json(productos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener los productos",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      sku,
      precio,
      stock,
      categoriaId,
    } = req.body;

    const producto = await prisma.producto.create({
      data: {
        nombre,
        sku,
        precio,
        stock,
        categoriaId,
      },
      include: {
        categoria: true,
      },
    });

    res.status(201).json(producto);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear el producto",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      nombre,
      sku,
      precio,
      stock,
      categoriaId,
    } = req.body;

    const producto = await prisma.producto.update({
      where: {
        id,
      },
      data: {
        nombre,
        sku,
        precio,
        stock,
        categoriaId,
      },
      include: {
        categoria: true,
      },
    });

    res.json(producto);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar el producto",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.producto.delete({
      where: {
        id,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar el producto",
    });
  }
});

export default router;