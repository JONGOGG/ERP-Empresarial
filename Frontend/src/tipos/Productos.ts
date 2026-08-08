export interface Producto {
  id: number;
  nombre: string;
  sku: string;
  precio: number | string;
  stock: number;
  categoriaId: number;

  categoria?: {
    id: number;
    nombre: string;
    descripcion: string | null;
  };

  createdAt?: string;
  updatedAt?: string;
}