import { prisma } from "../config/prisma.js";

interface ProductoVenta {
  productoId: number;
  cantidad: number;
}

interface DatosVenta {
  clienteId: number;
  usuarioId: number;
  productos: ProductoVenta[];
}

export async function crearVenta(datos: DatosVenta) {
  return prisma.$transaction(async (tx) => {
    // Buscar los productos en la BD
    const idsProductos = datos.productos.map((producto) => producto.productoId);

    const productosBD = await tx.producto.findMany({
      where: {
        id: {
          in: idsProductos,
        },
      },
    });

    // Comprobar que existan todos
    if (productosBD.length !== idsProductos.length) {
      throw new Error("Uno o más productos no existen");
    }

    let total = 0;

    const detalles = datos.productos.map((item) => {
      const producto = productosBD.find(
        (producto) => producto.id === item.productoId,
      );

      if (!producto) {
        throw new Error("Producto no encontrado");
      }

      if (producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${producto.nombre}`);
      }

      const subtotal = Number(producto.precio) * item.cantidad;

      total += subtotal;

      return {
        productoId: producto.id,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
      };
    });

    // Crear venta
    const venta = await tx.venta.create({
      data: {
        clienteId: datos.clienteId,
        usuarioId: datos.usuarioId,
        total,

        detalles: {
          create: detalles,
        },
      },

      include: {
        cliente: true,
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

    // Descontar existencias
    for (const item of datos.productos) {
      await tx.producto.update({
        where: {
          id: item.productoId,
        },
        data: {
          stock: {
            decrement: item.cantidad,
          },
        },
      });
    }

    return venta;
  });
}
export function obtenerVentas() {
  return prisma.venta.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      cliente: true,
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

export function obtenerVentaPorId(id: number) {
  return prisma.venta.findUnique({
    where: {
      id,
    },
    include: {
      cliente: true,
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
