import { Router } from "express";

import {
  listarProductos,
  registrarProducto,
  editarProducto,
  borrarProducto,
} from "../controllers/productos.controller.js";

const router = Router();

router.get("/", listarProductos);
router.post("/", registrarProducto);
router.put("/:id", editarProducto);
router.delete("/:id", borrarProducto);

export default router;