import { z } from "zod";

export const productoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio"),

  sku: z
    .string()
    .trim()
    .min(1, "El SKU es obligatorio"),

  precio: z
    .number()
    .min(0, "El precio no puede ser negativo"),

  stock: z
    .number()
    .int("El stock debe ser entero")
    .min(0, "El stock no puede ser negativo"),

  categoriaId: z
    .number()
    .int()
    .positive("La categoría no es válida"),
});

export type ProductoInput = z.infer<typeof productoSchema>;