import { Router } from "express";

import{
  ListarClientes,
  borrarCliente,
  editarCliente,
  registratCliente
  

} from "../controllers/Clientes.controller.js"


const router = Router();

router.get("/", ListarClientes);
router.post("/", registratCliente);
router.put("/:id", editarCliente);
router.delete("/:id", borrarCliente);


export default router;