import { z } from "zod";

export const ajusteInventarioSchema = z.object({
  productoId: z.coerce.number().int().positive("Producto inválido"),

  cantidad: z.coerce
    .number()
    .int()
    .refine((valor) => valor !== 0, "La cantidad no puede ser 0"),

  motivo: z.string().trim().min(3, "El motivo es obligatorio"),
});
