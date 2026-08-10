import { Router } from "express";

import {
  registrarCompra,
  listarCompras,
  obtenerCompra,
} from "../controllers/compras.controller.js";

import { permitirRoles } from "../middlewares/roles.middleware.js";

const router = Router();

router.get("/", permitirRoles("ADMIN"), listarCompras);

router.get("/:id", permitirRoles("ADMIN"), obtenerCompra);

router.post("/", permitirRoles("ADMIN"), registrarCompra);

export default router;
