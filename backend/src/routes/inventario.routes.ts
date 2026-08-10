import { Router } from "express";

import {
  listarMovimientos,
  listarMovimientosProducto,
  registrarAjusteInventario,
} from "../controllers/inventario.controller.js";

import { permitirRoles } from "../middlewares/roles.middleware.js";

const router = Router();

router.get(
  "/movimientos",
  permitirRoles("ADMIN", "EMPLEADO"),
  listarMovimientos,
);

router.get(
  "/productos/:productoId/movimientos",
  permitirRoles("ADMIN", "EMPLEADO"),
  listarMovimientosProducto,
);

router.post("/ajustes", permitirRoles("ADMIN"), registrarAjusteInventario);

export default router;
