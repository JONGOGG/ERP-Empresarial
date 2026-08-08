import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const categorias = await prisma.categoria.findMany();

  res.json(categorias);
});

router.post("/", async (req, res) => {
  const { nombre, descripcion } = req.body;

  const categoria = await prisma.categoria.create({
    data: {
      nombre,
      descripcion,
    },
  });

  res.status(201).json(categoria);
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nombre, descripcion } = req.body;

  const categoria = await prisma.categoria.update({
    where: { id },
    data: {
      nombre,
      descripcion,
    },
  });

  res.json(categoria);
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  await prisma.categoria.delete({
    where: { id },
  });

  res.status(204).send();
});

export default router;