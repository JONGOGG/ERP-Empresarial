import { prisma } from "../config/prisma.js";

export async function obtenerResumenDashboard() {
  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);

  const [
    ventasHoy,
    ingresosHoy,
    totalClientes,
    totalProductos,
    totalCategorias,
    productosStockBajo,
    productosInventario,
  ] = await Promise.all([
    prisma.venta.count({
      where: {
        createdAt: {
          gte: inicioHoy,
        },
      },
    }),

    prisma.venta.aggregate({
      where: {
        createdAt: {
          gte: inicioHoy,
        },
      },
      _sum: {
        total: true,
      },
    }),

    prisma.cliente.count(),

    prisma.producto.count(),

    prisma.categoria.count(),

    prisma.producto.findMany({
      where: {
        stock: {
          lte: 5,
        },
      },
      orderBy: {
        stock: "asc",
      },
      select: {
        id: true,
        nombre: true,
        sku: true,
        stock: true,
      },
    }),

    prisma.producto.findMany({
      select: {
        precio: true,
        stock: true,
      },
    }),
  ]);

  const valorInventario = productosInventario.reduce(
    (total, producto) =>
      total + Number(producto.precio) * producto.stock,
    0
  );

  return {
    ventasHoy,
    ingresosHoy: Number(ingresosHoy._sum.total ?? 0),
    totalClientes,
    totalProductos,
    totalCategorias,
    valorInventario,
    productosStockBajo,
  };
}

export async function obtenerVentasUltimos7Dias() {
  const fechaInicio = new Date();

  fechaInicio.setDate(fechaInicio.getDate() - 6);
  fechaInicio.setHours(0, 0, 0, 0);

  const ventas = await prisma.venta.findMany({
    where: {
      createdAt: {
        gte: fechaInicio,
      },
    },
    select: {
      total: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const dias = [];

  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    fecha.setHours(0, 0, 0, 0);

    const siguienteDia = new Date(fecha);
    siguienteDia.setDate(siguienteDia.getDate() + 1);

    const ventasDia = ventas.filter(
      (venta) =>
        venta.createdAt >= fecha &&
        venta.createdAt < siguienteDia
    );

    dias.push({
      fecha: fecha.toISOString().split("T")[0],

      ventas: ventasDia.length,

      ingresos: ventasDia.reduce(
        (total, venta) =>
          total + Number(venta.total),
        0
      ),
    });
  }

  return dias;
}