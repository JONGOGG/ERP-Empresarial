import { z } from "zod";

export const clienteSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio"),

  correo: z
    .string()
    .trim()
    .email("El correo no es válido")
    .transform((correo) => correo.toLowerCase()),

  telefono: z
    .string()
    .trim()
    .min(7, "El teléfono no es válido"),

  ciudad: z
    .string()
    .trim()
    .min(1, "La ciudad es obligatoria"),
});