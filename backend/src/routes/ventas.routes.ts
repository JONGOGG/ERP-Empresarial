import { Router } from "express";

import { registrarVenta } from "../controllers/ventas.controller.js";
import { permitirRoles } from "../middlewares/roles.middleware.js";

const router = Router();

router.post(
  "/",
  permitirRoles("ADMIN", "EMPLEADO"),
  registrarVenta
);

export default router;