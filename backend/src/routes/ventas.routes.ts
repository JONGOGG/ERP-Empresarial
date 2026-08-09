import { Router } from "express";

import { listarVentas, obtenerVenta, registrarVenta } from "../controllers/ventas.controller.js";
import { permitirRoles } from "../middlewares/roles.middleware.js";

const router = Router();

router.get(
  "/",
  permitirRoles("ADMIN", "EMPLEADO"),
  listarVentas
);

router.get(
  "/:id",
  permitirRoles("ADMIN", "EMPLEADO"),
  obtenerVenta
);

router.post(
  "/",
  permitirRoles("ADMIN", "EMPLEADO"),
  registrarVenta
);

export default router;