import * as XLSX from "xlsx";
import type { ReporteGeneral } from "../tipos/Reporte";

export function exportarReporteExcel(
  reporte: ReporteGeneral,
  fechaInicio: string,
  fechaFin: string
) {
  const libro = XLSX.utils.book_new();

  // ==============================
  // RESUMEN
  // ==============================

  const datosResumen = [
    ["REPORTE GENERAL DEL ERP"],
    [],
    ["Periodo", `${fechaInicio} - ${fechaFin}`],
    [],
    ["Indicador", "Valor"],
    ["Número de ventas", reporte.resumen.numeroVentas],
    ["Ingresos", reporte.resumen.ingresos],
    ["Número de compras", reporte.resumen.numeroCompras],
    ["Egresos", reporte.resumen.egresos],
    [
      "Resultado aproximado",
      reporte.resumen.utilidadAproximada,
    ],
    [
      "Clientes registrados",
      reporte.resumen.totalClientes,
    ],
    [
      "Productos registrados",
      reporte.resumen.totalProductos,
    ],
  ];

  const hojaResumen =
    XLSX.utils.aoa_to_sheet(datosResumen);

  hojaResumen["!cols"] = [
    { wch: 25 },
    { wch: 25 },
  ];

  XLSX.utils.book_append_sheet(
    libro,
    hojaResumen,
    "Resumen"
  );

  // ==============================
  // PRODUCTOS MÁS VENDIDOS
  // ==============================

  const productos =
    reporte.productosMasVendidos.map(
      (producto, index) => ({
        Posición: index + 1,
        Producto: producto.nombre,
        SKU: producto.sku,
        "Unidades vendidas":
          producto.cantidadVendida,
      })
    );

  const hojaProductos =
    XLSX.utils.json_to_sheet(productos);

  hojaProductos["!cols"] = [
    { wch: 12 },
    { wch: 30 },
    { wch: 20 },
    { wch: 20 },
  ];

  XLSX.utils.book_append_sheet(
    libro,
    hojaProductos,
    "Productos vendidos"
  );

  // ==============================
  // VENTAS
  // ==============================

  const ventas = reporte.ventas.map(
    (venta: any) => ({
      Folio: venta.id,

      Fecha: new Date(
        venta.createdAt
      ).toLocaleString("es-MX"),

      Cliente:
        venta.cliente?.nombre ?? "",

      Vendedor:
        venta.usuario?.nombre ?? "",

      Productos: venta.detalles?.reduce(
        (total: number, detalle: any) =>
          total + detalle.cantidad,
        0
      ) ?? 0,

      Total: Number(venta.total),
    })
  );

  const hojaVentas =
    XLSX.utils.json_to_sheet(ventas);

  hojaVentas["!cols"] = [
    { wch: 10 },
    { wch: 23 },
    { wch: 30 },
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(
    libro,
    hojaVentas,
    "Ventas"
  );

  // ==============================
  // COMPRAS
  // ==============================

  const compras = reporte.compras.map(
    (compra: any) => ({
      Folio: compra.id,

      Fecha: new Date(
        compra.createdAt
      ).toLocaleString("es-MX"),

      Proveedor:
        compra.proveedor?.nombre ?? "",

      Total: Number(compra.total),
    })
  );

  const hojaCompras =
    XLSX.utils.json_to_sheet(compras);

  hojaCompras["!cols"] = [
    { wch: 10 },
    { wch: 23 },
    { wch: 30 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(
    libro,
    hojaCompras,
    "Compras"
  );

  // ==============================
  // GUARDAR
  // ==============================

  XLSX.writeFile(
    libro,
    `reporte-${fechaInicio}-${fechaFin}.xlsx`
  );
}