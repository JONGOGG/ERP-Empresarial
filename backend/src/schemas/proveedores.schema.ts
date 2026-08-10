import { z } from "zod";

export const proveedorSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio"),

  correo: z
    .string()
    .trim()
    .email("El correo no es válido")
    .optional()
    .or(z.literal("")),

  telefono: z
    .string()
    .trim()
    .optional(),

  direccion: z
    .string()
    .trim()
    .optional(),
});