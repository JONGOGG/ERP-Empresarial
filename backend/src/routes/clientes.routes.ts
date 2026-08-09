import { Router } from "express";
import { permitirRoles } from "../middlewares/roles.middleware.js";
import {
  listarClientes,
  borrarCliente,
  editarCliente,
  registrarCliente,
} from "../controllers/clientes.controller.js";

const router = Router();

router.get("/", listarClientes);
router.post("/", permitirRoles("ADMIN", "EMPLEADO"), registrarCliente);
router.put("/:id", permitirRoles("ADMIN", "EMPLEADO"), editarCliente);
router.delete("/:id", permitirRoles("ADMIN"),  borrarCliente);

export default router;
