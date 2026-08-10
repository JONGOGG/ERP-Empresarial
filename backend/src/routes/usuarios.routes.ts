import { Router } from "express";

import {
  listarUsuarios,
  registrarUsuario,
  editarUsuario,
} from "../controllers/usuarios.controller.js";

import { permitirRoles } from "../middlewares/roles.middleware.js";

const router = Router();

router.get("/", permitirRoles("ADMIN"), listarUsuarios);

router.post("/", permitirRoles("ADMIN"), registrarUsuario);

router.put("/:id", permitirRoles("ADMIN"), editarUsuario);

export default router;
