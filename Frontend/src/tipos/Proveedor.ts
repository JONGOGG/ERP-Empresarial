export interface Proveedor {
  id: number;
  nombre: string;
  correo: string | null;
  telefono: string | null;
  direccion: string | null;
  createdAt?: string;
  updatedAt?: string;
}