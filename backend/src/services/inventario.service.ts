import { prisma } from "../config/prisma.js";

export function obtenerMovimientos() {
  return prisma.movimientoInventario.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      producto: {
        select: {
          id: true,
          nombre: true,
          sku: true,
        },
      },
      usuario: {
        select: {
          id: true,
          nombre: true,
          correo: true,
        },
      },
    },
  });
}

export function obtenerMovimientosProducto(productoId: number) {
  return prisma.movimientoInventario.findMany({
    where: {
      productoId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      producto: {
        select: {
          id: true,
          nombre: true,
          sku: true,
        },
      },
      usuario: {
        select: {
          id: true,
          nombre: true,
        },
      },
    },
  });
}

export async function ajustarInventario(datos: {
  productoId: number;
  cantidad: number;
  motivo: string;
  usuarioId: number;
}) {
  return prisma.$transaction(async (tx) => {
    const producto = await tx.producto.findUnique({
      where: {
        id: datos.productoId,
      },
    });

    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    const stockAntes = producto.stock;

    const stockDespues = stockAntes + datos.cantidad;

    if (stockDespues < 0) {
      throw new Error("El ajuste dejaría el stock en negativo");
    }

    const productoActualizado = await tx.producto.update({
      where: {
        id: datos.productoId,
      },
      data: {
        stock: stockDespues,
      },
    });

    await tx.movimientoInventario.create({
      data: {
        tipo: "AJUSTE",
        cantidad: datos.cantidad,
        stockAntes,
        stockDespues,
        referencia: datos.motivo,
        productoId: datos.productoId,
        usuarioId: datos.usuarioId,
      },
    });

    return productoActualizado;
  });
}
