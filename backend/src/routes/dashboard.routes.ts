import { Router } from "express";

import {
  resumenDashboard,
  ventasUltimos7Dias,
  productosMasVendidos,
} from "../controllers/dashboard.controller.js";

import { permitirRoles } from "../middlewares/roles.middleware.js";

const router = Router();

router.get(
  "/resumen", 
  permitirRoles("ADMIN", "EMPLEADO"), 
  resumenDashboard);

router.get(
  "/ventas-7-dias",
  permitirRoles("ADMIN", "EMPLEADO"),
  ventasUltimos7Dias,
);

router.get(
  "/productos-mas-vendidos",
  permitirRoles("ADMIN", "EMPLEADO"),
  productosMasVendidos,
);

export default router;
