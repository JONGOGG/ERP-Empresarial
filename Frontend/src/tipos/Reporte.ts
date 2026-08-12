export interface ProductoReporte {
  productoId: number;
  nombre: string;
  sku: string;
  cantidadVendida: number;
}

export interface ResumenReporte {
  numeroVentas: number;
  ingresos: number;
  numeroCompras: number;
  egresos: number;
  utilidadAproximada: number;
  totalClientes: number;
  totalProductos: number;
}

export interface ReporteGeneral {
  periodo: {
    inicio: string;
    fin: string;
  };

  resumen: ResumenReporte;

  productosMasVendidos: ProductoReporte[];

  ventas: unknown[];
  compras: unknown[];
}
