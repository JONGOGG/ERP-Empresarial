import { Router } from "express";

import {
  listarUsuarios,
  registrarUsuario,
  editarUsuario,
  cambiarPassword,
} from "../controllers/usuarios.controller.js";

import { permitirRoles } from "../middlewares/roles.middleware.js";

const router = Router();

router.get("/", permitirRoles("ADMIN"), listarUsuarios);

router.post("/", permitirRoles("ADMIN"), registrarUsuario);

router.put("/:id", permitirRoles("ADMIN"), editarUsuario);

router.put("/:id/password", permitirRoles("ADMIN"), cambiarPassword);

export default router;
