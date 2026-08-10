export interface MovimientoInventario {
  id: number;
  tipo: "COMPRA" | "VENTA" | "AJUSTE";
  cantidad: number;
  stockAntes: number;
  stockDespues: number;
  referencia: string | null;
  createdAt: string;

  producto: {
    id: number;
    nombre: string;
    sku: string;
  };

  usuario: {
    id: number;
    nombre: string;
    correo?: string;
  };
}
