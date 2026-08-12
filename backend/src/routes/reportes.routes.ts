import { Router } from "express";

import { reporteGeneral } from "../controllers/reportes.controller.js";

import { permitirRoles } from "../middlewares/roles.middleware.js";

const router = Router();

router.get("/general", permitirRoles("ADMIN"), reporteGeneral);

export default router;
