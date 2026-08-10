import { z } from "zod";

export const compraSchema = z.object({
  proveedorId: z.coerce
    .number()
    .int()
    .positive("El proveedor no es válido"),

  productos: z
    .array(
      z.object({
        productoId: z.coerce
          .number()
          .int()
          .positive(),

        cantidad: z.coerce
          .number()
          .int()
          .positive(),

        costoUnitario: z.coerce
          .number()
          .positive(),
      })
    )
    .min(1, "La compra debe tener al menos un producto"),
});