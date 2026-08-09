import { z } from "zod";

export const ventaSchema = z.object({
  clienteId: z.coerce
    .number()
    .int()
    .positive("El cliente no es válido"),

  productos: z
    .array(
      z.object({
        productoId: z.coerce
          .number()
          .int()
          .positive("El producto no es válido"),

        cantidad: z.coerce
          .number()
          .int()
          .positive("La cantidad debe ser mayor a 0"),
      })
    )
    .min(1, "La venta debe tener al menos un producto"),
});

export type VentaInput = z.infer<typeof ventaSchema>;