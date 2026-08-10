import type { MovimientoInventario } from "../tipos/MovimientoInventario";
import { apiFetch } from "./api";

export async function obtenerMovimientos(): Promise<MovimientoInventario[]> {
  const respuesta = await apiFetch("/inventario/movimientos");

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los movimientos de inventario");
  }

  return respuesta.json();
}

export async function obtenerMovimientosProducto(
  productoId: number,
): Promise<MovimientoInventario[]> {
  const respuesta = await apiFetch(
    `/inventario/productos/${productoId}/movimientos`,
  );

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los movimientos del producto");
  }

  return respuesta.json();
}

interface AjusteInventarioInput {
  productoId: number;
  cantidad: number;
  motivo: string;
}

export async function ajustarInventario(datos: AjusteInventarioInput) {
  const respuesta = await apiFetch("/inventario/ajustes", {
    method: "POST",
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    const texto = await respuesta.text();

    let mensaje = "No se pudo realizar el ajuste";

    try {
      const error = JSON.parse(texto);

      if (error.mensaje) {
        mensaje = error.mensaje;
      }
    } catch {
      // Dejamos el mensaje genérico
    }

    throw new Error(mensaje);
  }

  return respuesta.json();
}
