export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: "ADMIN" | "EMPLEADO";
  activo: boolean;
  createdAt: string;
  updatedAt?: string;
}
