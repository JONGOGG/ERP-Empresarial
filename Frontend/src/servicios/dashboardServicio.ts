import { apiFetch } from "./api";

export interface ProductoStockBajo {
  id: number;
  nombre: string;
  sku: string;
  stock: number;
}

export interface ResumenDashboard {
  ventasHoy: number;
  ingresosHoy: number;
  totalClientes: number;
  totalProductos: number;
  totalCategorias: number;
  valorInventario: number;
  productosStockBajo: ProductoStockBajo[];
}

export interface VentaDia {
  fecha: string;
  ventas: number;
  ingresos: number;
}

export async function obtenerResumenDashboard(): Promise<ResumenDashboard> {
  const respuesta = await apiFetch("/dashboard/resumen");

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el resumen del dashboard");
  }

  return respuesta.json();
}

export async function obtenerVentasUltimos7Dias(): Promise<VentaDia[]> {
  const respuesta = await apiFetch("/dashboard/ventas-7-dias");

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener las ventas de los últimos 7 días");
  }

  return respuesta.json();
}

export interface ProductoMasVendido {
  productoId: number;
  nombre: string;
  sku: string;
  cantidadVendida: number;
}

export async function obtenerProductosMasVendidos(): Promise<
  ProductoMasVendido[]
> {
  const respuesta = await apiFetch("/dashboard/productos-mas-vendidos");

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los productos más vendidos");
  }

  return respuesta.json();
}
