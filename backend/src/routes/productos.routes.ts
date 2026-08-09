import { Router } from "express";
import { permitirRoles } from "../middlewares/roles.middleware.js";

import {
  listarProductos,
  registrarProducto,
  editarProducto,
  borrarProducto,
} from "../controllers/productos.controller.js";

const router = Router();

router.get("/", listarProductos);
router.post("/", permitirRoles("ADMIN"), registrarProducto);
router.put("/:id", permitirRoles("ADMIN"), editarProducto);
router.delete("/:id", permitirRoles("ADMIN"), borrarProducto);

export default router;
