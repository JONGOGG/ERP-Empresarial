import { Router } from "express";

import {
  listarProveedores,
  registrarProveedor,
  editarProveedor,
  borrarProveedor,
} from "../controllers/proveedores.controller.js";

import { permitirRoles } from "../middlewares/roles.middleware.js";

const router = Router();

router.get("/", permitirRoles("ADMIN", "EMPLEADO"), listarProveedores);

router.post("/", permitirRoles("ADMIN"), registrarProveedor);

router.put("/:id", permitirRoles("ADMIN"), editarProveedor);

router.delete("/:id", permitirRoles("ADMIN"), borrarProveedor);

export default router;
