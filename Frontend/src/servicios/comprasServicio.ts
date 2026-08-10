import type { Compra } from "../tipos/Compra";
import { apiFetch } from "./api";

export interface ProductoCompraInput {
  productoId: number;
  cantidad: number;
  costoUnitario: number;
}

export interface CrearCompraInput {
  proveedorId: number;
  productos: ProductoCompraInput[];
}

export async function crearCompra(datos: CrearCompraInput): Promise<Compra> {
  const respuesta = await apiFetch("/compras", {
    method: "POST",
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    const error = await respuesta.json();

    throw new Error(error.mensaje || "No se pudo registrar la compra");
  }

  return respuesta.json();
}

export async function obtenerCompras(): Promise<Compra[]> {
  const respuesta = await apiFetch("/compras");

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener las compras");
  }

  return respuesta.json();
}

export async function obtenerCompraPorId(id: number): Promise<Compra> {
  const respuesta = await apiFetch(`/compras/${id}`);

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener la compra");
  }

  return respuesta.json();
}
