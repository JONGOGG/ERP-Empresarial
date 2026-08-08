import { Router } from "express";

import {
  listarCategorias,
  registrarCategoria,
  editarCategoria,
  borrarCategoria,
} from "../controllers/categorias.controller.js";

const router = Router();

router.get("/", listarCategorias);
router.post("/", registrarCategoria);
router.put("/:id", editarCategoria);
router.delete("/:id", borrarCategoria);

export default router;