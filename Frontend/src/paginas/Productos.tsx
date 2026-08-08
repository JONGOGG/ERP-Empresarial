import { useState } from "react";
import type { Producto } from "../tipos/Productos";


export function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);

  return (
    <section>
      <h1>Productos</h1>
      <p>Administra el inventario de productos.</p>
    </section>
  );
}