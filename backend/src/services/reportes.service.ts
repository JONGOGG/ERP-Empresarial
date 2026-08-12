import { prisma } from "../config/prisma.js";

interface FiltrosReporte {
  fechaInicio: Date;
  fechaFin: Date;
}

export async function obtenerReporteGeneral(filtros: FiltrosReporte) {
  const { fechaInicio, fechaFin } = filtros;

  const [ventas, compras, totalClientes, totalProductos, productosMasVendidos] =
    await Promise.all([
      prisma.venta.findMany({
        where: {
          createdAt: {
            gte: fechaInicio,
            lte: fechaFin,
          },
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
            },
          },
          detalles: {
            include: {
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  sku: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.compra.findMany({
        where: {
          createdAt: {
            gte: fechaInicio,
            lte: fechaFin,
          },
        },
        include: {
          proveedor: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.cliente.count(),

      prisma.producto.count(),

      prisma.detalleVenta.groupBy({
        by: ["productoId"],

        where: {
          venta: {
            createdAt: {
              gte: fechaInicio,
              lte: fechaFin,
            },
          },
        },

        _sum: {
          cantidad: true,
        },

        orderBy: {
          _sum: {
            cantidad: "desc",
          },
        },

        take: 5,
      }),
    ]);

  const ingresos = ventas.reduce(
    (total, venta) => total + Number(venta.total),
    0,
  );

  const egresos = compras.reduce(
    (total, compra) => total + Number(compra.total),
    0,
  );

  const utilidadAproximada = ingresos - egresos;

  const idsProductos = productosMasVendidos.map((item) => item.productoId);

  const productos = await prisma.producto.findMany({
    where: {
      id: {
        in: idsProductos,
      },
    },
    select: {
      id: true,
      nombre: true,
      sku: true,
    },
  });

  const topProductos = productosMasVendidos.map((item) => {
    const producto = productos.find(
      (producto) => producto.id === item.productoId,
    );

    return {
      productoId: item.productoId,
      nombre: producto?.nombre ?? "Producto eliminado",
      sku: producto?.sku ?? "",
      cantidadVendida: item._sum.cantidad ?? 0,
    };
  });

  return {
    periodo: {
      inicio: fechaInicio,
      fin: fechaFin,
    },

    resumen: {
      numeroVentas: ventas.length,
      ingresos,
      numeroCompras: compras.length,
      egresos,
      utilidadAproximada,
      totalClientes,
      totalProductos,
    },

    productosMasVendidos: topProductos,

    ventas,
    compras,
  };
}
