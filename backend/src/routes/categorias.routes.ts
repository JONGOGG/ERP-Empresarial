import { Router } from "express";

import {
  listarCategorias,
  registrarCategoria,
  editarCategoria,
  borrarCategoria,
} from "../controllers/categorias.controller.js";
import { permitirRoles } from "../middlewares/roles.middleware.js";

const router = Router();

router.get("/", listarCategorias);
router.post("/", permitirRoles("ADMIN", ) , registrarCategoria);
router.put("/:id", permitirRoles("ADMIN", ), editarCategoria);
router.delete("/:id", permitirRoles("ADMIN"), borrarCategoria);

export default router;
