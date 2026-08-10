import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import categoriasRoutes from "./routes/categorias.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import authRoutes from "./routes/auth.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import proveedoresRoutes from "./routes/proveedores.routes.js";
import comprasRoutes from "./routes/compras.routes.js";
import inventarioRoutes from "./routes/inventario.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";

import { verificarToken } from "./middlewares/autenticacion.middleware.js";
import { manejarErrores } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/dashboard", verificarToken, dashboardRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/productos", verificarToken, productosRoutes);
app.use("/api/categorias", verificarToken, categoriasRoutes);
app.use("/api/clientes", verificarToken, clientesRoutes);
app.use("/api/ventas", verificarToken, ventasRoutes);
app.use("/api/proveedores", verificarToken, proveedoresRoutes);
app.use("/api/compras", verificarToken, comprasRoutes);
app.use("/api/dashboard", verificarToken, dashboardRoutes);
app.use("/api/inventario", verificarToken, inventarioRoutes);
app.use("/api/usuarios", verificarToken, usuariosRoutes);

app.use(manejarErrores);

app.get("/api", (_req, res) => {
  res.json({
    mensaje: "API del ERP funcionando",
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
