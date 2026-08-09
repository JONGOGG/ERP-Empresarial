export interface DetalleVenta {
  id: number;
  cantidad: number;
  precioUnitario: string;

  producto: {
    id: number;
    nombre: string;
    sku: string;
  };
}

export interface Venta {
  id: number;
  total: string;
  createdAt: string;

  cliente: {
    id: number;
    nombre: string;
    correo: string;
  };

  usuario: {
    id: number;
    nombre: string;
    correo: string;
    rol: string;
  };

  detalles: DetalleVenta[];
}