import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { ReporteGeneral } from "../tipos/Reporte";

export function exportarReportePdf(
  reporte: ReporteGeneral,
  fechaInicio: string,
  fechaFin: string,
) {
  const pdf = new jsPDF();

  const moneda = (cantidad: number) =>
    cantidad.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    });

  pdf.setFontSize(18);
  pdf.text("Reporte general del ERP", 14, 18);

  pdf.setFontSize(10);
  pdf.text(`Periodo: ${fechaInicio} - ${fechaFin}`, 14, 26);

  autoTable(pdf, {
    startY: 34,
    head: [["Indicador", "Valor"]],
    body: [
      ["Número de ventas", String(reporte.resumen.numeroVentas)],
      ["Ingresos", moneda(reporte.resumen.ingresos)],
      ["Número de compras", String(reporte.resumen.numeroCompras)],
      ["Egresos", moneda(reporte.resumen.egresos)],
      ["Resultado aproximado", moneda(reporte.resumen.utilidadAproximada)],
      ["Clientes registrados", String(reporte.resumen.totalClientes)],
      ["Productos registrados", String(reporte.resumen.totalProductos)],
    ],
  });

  autoTable(pdf, {
    startY: (pdf as any).lastAutoTable.finalY + 12,

    head: [["#", "Producto", "SKU", "Unidades"]],

    body: reporte.productosMasVendidos.map((producto, index) => [
      index + 1,
      producto.nombre,
      producto.sku,
      producto.cantidadVendida,
    ]),
  });

  autoTable(pdf, {
    startY: (pdf as any).lastAutoTable.finalY + 12,

    head: [["Folio", "Fecha", "Cliente", "Vendedor", "Total"]],

    body: reporte.ventas.map((venta: any) => [
      `#${venta.id}`,
      new Date(venta.createdAt).toLocaleString("es-MX"),
      venta.cliente?.nombre ?? "",
      venta.usuario?.nombre ?? "",
      moneda(Number(venta.total)),
    ]),
  });

  autoTable(pdf, {
    startY: (pdf as any).lastAutoTable.finalY + 12,

    head: [["Folio", "Fecha", "Proveedor", "Total"]],

    body: reporte.compras.map((compra: any) => [
      `#${compra.id}`,
      new Date(compra.createdAt).toLocaleString("es-MX"),
      compra.proveedor?.nombre ?? "",
      moneda(Number(compra.total)),
    ]),
  });

  pdf.save(`reporte-${fechaInicio}-${fechaFin}.pdf`);
}
