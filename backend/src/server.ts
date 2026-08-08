import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import categoriasRoutes from "./routes/categorias.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/categorias", categoriasRoutes);

app.get("/api", (_req, res) => {
  res.json({
    mensaje: "API del ERP funcionando",
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});