import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import categoriasRoutes from "./routes/categorias.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { verificarToken } from "./middlewares/autenticacion.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/categorias", verificarToken, categoriasRoutes);
app.use("/api/productos", verificarToken, productosRoutes);
app.use("/api/clientes", verificarToken, clientesRoutes);

app.get("/api", (_req, res) => {
  res.json({
    mensaje: "API del ERP funcionando",
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});