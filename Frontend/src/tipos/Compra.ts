export interface DetalleCompra {
  id: number;
  cantidad: number;
  costoUnitario: string;

  producto: {
    id: number;
    nombre: string;
    sku: string;
  };
}

export interface Compra {
  id: number;
  total: string;
  createdAt: string;

  proveedor: {
    id: number;
    nombre: string;
    correo: string | null;
  };

  usuario: {
    id: number;
    nombre: string;
    correo: string;
    rol: string;
  };

  detalles: DetalleCompra[];
}