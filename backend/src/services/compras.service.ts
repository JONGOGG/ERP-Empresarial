import { prisma } from "../config/prisma.js";

interface ProductoCompra {
  productoId: number;
  cantidad: number;
  costoUnitario: number;
}

interface DatosCompra {
  proveedorId: number;
  usuarioId: number;
  productos: ProductoCompra[];
}

export async function crearCompra(datos: DatosCompra) {
  return prisma.$transaction(async (tx) => {
    let total = 0;

    const detalles = datos.productos.map((item) => {
      const subtotal = item.costoUnitario * item.cantidad;

      total += subtotal;

      return {
        productoId: item.productoId,
        cantidad: item.cantidad,
        costoUnitario: item.costoUnitario,
      };
    });

    const compra = await tx.compra.create({
      data: {
        proveedorId: datos.proveedorId,
        usuarioId: datos.usuarioId,
        total,

        detalles: {
          create: detalles,
        },
      },

      include: {
        proveedor: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            correo: true,
            rol: true,
          },
        },
        detalles: {
          include: {
            producto: true,
          },
        },
      },
    });

    for (const item of datos.productos) {
      await tx.producto.update({
        where: {
          id: item.productoId,
        },
        data: {
          stock: {
            increment: item.cantidad,
          },
        },
      });
    }

    return compra;
  });
}

export function obtenerCompras() {
  return prisma.compra.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      proveedor: true,
      usuario: {
        select: {
          id: true,
          nombre: true,
          correo: true,
          rol: true,
        },
      },
      detalles: {
        include: {
          producto: true,
        },
      },
    },
  });
}

export function obtenerCompraPorId(id: number) {
  return prisma.compra.findUnique({
    where: {
      id,
    },
    include: {
      proveedor: true,
      usuario: {
        select: {
          id: true,
          nombre: true,
          correo: true,
          rol: true,
        },
      },
      detalles: {
        include: {
          producto: true,
        },
      },
    },
  });
}
