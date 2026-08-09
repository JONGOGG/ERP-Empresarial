import { apiFetch } from "./api";

export interface ProductoVentaInput {
  productoId: number;
  cantidad: number;
}

export interface CrearVentaInput {
  clienteId: number;
  productos: ProductoVentaInput[];
}

export async function crearVenta(datos: CrearVentaInput) {
  const respuesta = await apiFetch("/ventas", {
    method: "POST",
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    const error = await respuesta.json();

    throw new Error(
      error.mensaje || "No se pudo registrar la venta"
    );
  }

  return respuesta.json();
}

export async function obtenerVentas() {
  const respuesta = await apiFetch("/ventas");

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener las ventas");
  }

  return respuesta.json();
}