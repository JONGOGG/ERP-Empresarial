import { z } from "zod";

export const crearUsuarioSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),

  correo: z
    .string()
    .trim()
    .email("El correo no es válido")
    .transform((correo) => correo.toLowerCase()),

  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),

  rol: z.enum(["ADMIN", "EMPLEADO"]).default("EMPLEADO"),
});

export const actualizarUsuarioSchema = z.object({
  nombre: z.string().trim().min(1),

  correo: z
    .string()
    .trim()
    .email()
    .transform((correo) => correo.toLowerCase()),

  rol: z.enum(["ADMIN", "EMPLEADO"]),

  activo: z.boolean(),
});
