import { Router } from "express";

import{
  listarClientes,
  borrarCliente,
  editarCliente,
  registrarCliente
  

} from "../controllers/clientes.controller.js"


const router = Router();

router.get("/", listarClientes);
router.post("/", registrarCliente);
router.put("/:id", editarCliente);
router.delete("/:id", borrarCliente);


export default router;