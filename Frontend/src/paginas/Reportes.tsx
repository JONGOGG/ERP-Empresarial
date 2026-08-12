import { useState } from "react";

import { obtenerReporteGeneral } from "../servicios/reportesServicio";

import type { ReporteGeneral } from "../tipos/Reporte";

import { exportarReporteExcel } from "../utils/exportarReporte";
import { exportarReportePdf } from "../utils/exportarReportePdf";

export function Reportes() {
  const hoy = new Date();

  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  const formatearFechaInput = (fecha: Date) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [fechaInicio, setFechaInicio] = useState(
    formatearFechaInput(primerDiaMes),
  );

  const [fechaFin, setFechaFin] = useState(formatearFechaInput(hoy));

  const [reporte, setReporte] = useState<ReporteGeneral | null>(null);

  const [cargando, setCargando] = useState(false);

  const [error, setError] = useState("");

  const generarReporte = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!fechaInicio || !fechaFin) {
      setError("Selecciona las fechas del reporte");
      return;
    }

    if (fechaInicio > fechaFin) {
      setError("La fecha inicial no puede ser mayor que la fecha final");
      return;
    }

    try {
      setCargando(true);
      setError("");

      const datos = await obtenerReporteGeneral(fechaInicio, fechaFin);

      setReporte(datos);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudo generar el reporte");
      }
    } finally {
      setCargando(false);
    }
  };

  const moneda = (cantidad: number) =>
    cantidad.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    });

  return (
    <section className="space-y-8">
      {/* ENCABEZADO */}

      <div>
        <h1 className="text-2xl font-bold">Reportes</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Consulta el rendimiento del negocio por periodo.
        </p>
      </div>

      {/* FILTROS */}

      <form
        onSubmit={generarReporte}
        className="rounded-xl border border-border bg-surface p-6 shadow-sm"
      >
        <h2 className="mb-5 text-lg font-semibold">Periodo del reporte</h2>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label
              htmlFor="fechaInicio"
              className="mb-1.5 block text-sm font-medium"
            >
              Desde
            </label>

            <input
              id="fechaInicio"
              type="date"
              value={fechaInicio}
              onChange={(event) => setFechaInicio(event.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="fechaFin"
              className="mb-1.5 block text-sm font-medium"
            >
              Hasta
            </label>

            <input
              id="fechaFin"
              type="date"
              value={fechaFin}
              onChange={(event) => setFechaFin(event.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cargando ? "Generando..." : "Generar reporte"}
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}
      </form>

      {/* RESULTADOS */}

      {reporte && (
        <>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                exportarReporteExcel(reporte, fechaInicio, fechaFin)
              }
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold transition hover:bg-muted"
            >
              Exportar a Excel
            </button>

            <button
              type="button"
              onClick={() => exportarReportePdf(reporte, fechaInicio, fechaFin)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Exportar a PDF
            </button>
          </div>

          {/* TARJETAS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Ventas</p>

              <p className="mt-2 text-2xl font-bold">
                {reporte.resumen.numeroVentas}
              </p>
            </article>

            <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Ingresos</p>

              <p className="mt-2 text-2xl font-bold">
                {moneda(reporte.resumen.ingresos)}
              </p>
            </article>

            <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Compras</p>

              <p className="mt-2 text-2xl font-bold">
                {reporte.resumen.numeroCompras}
              </p>
            </article>

            <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Egresos</p>

              <p className="mt-2 text-2xl font-bold">
                {moneda(reporte.resumen.egresos)}
              </p>
            </article>

            <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">
                Resultado aproximado
              </p>

              <p
                className={`mt-2 text-2xl font-bold ${
                  reporte.resumen.utilidadAproximada >= 0
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {moneda(reporte.resumen.utilidadAproximada)}
              </p>
            </article>
          </div>

          {/* INFORMACIÓN GENERAL */}

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">
                Clientes registrados
              </p>

              <p className="mt-2 text-2xl font-bold">
                {reporte.resumen.totalClientes}
              </p>
            </article>

            <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">
                Productos registrados
              </p>

              <p className="mt-2 text-2xl font-bold">
                {reporte.resumen.totalProductos}
              </p>
            </article>
          </div>

          {/* TOP PRODUCTOS */}

          <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-lg font-semibold">Productos más vendidos</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Productos con mayor cantidad vendida durante el periodo.
              </p>
            </div>

            {reporte.productosMasVendidos.length === 0 ? (
              <div className="p-6">
                <p className="text-sm text-muted-foreground">
                  No existen ventas en este periodo.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3 font-medium">Posición</th>

                      <th className="px-6 py-3 font-medium">Producto</th>

                      <th className="px-6 py-3 font-medium">SKU</th>

                      <th className="px-6 py-3 text-right font-medium">
                        Unidades vendidas
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {reporte.productosMasVendidos.map((producto, index) => (
                      <tr
                        key={producto.productoId}
                        className="hover:bg-muted/30"
                      >
                        <td className="px-6 py-4">#{index + 1}</td>

                        <td className="px-6 py-4 font-medium">
                          {producto.nombre}
                        </td>

                        <td className="px-6 py-4 text-muted-foreground">
                          {producto.sku}
                        </td>

                        <td className="px-6 py-4 text-right font-semibold">
                          {producto.cantidadVendida}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* VENTAS */}

          <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-lg font-semibold">Ventas del periodo</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {reporte.resumen.numeroVentas} ventas encontradas.
              </p>
            </div>

            {reporte.ventas.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                No hay ventas.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3 font-medium">Folio</th>

                      <th className="px-6 py-3 font-medium">Fecha</th>

                      <th className="px-6 py-3 font-medium">Cliente</th>

                      <th className="px-6 py-3 font-medium">Vendedor</th>

                      <th className="px-6 py-3 text-right font-medium">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {reporte.ventas.map((venta: any) => (
                      <tr key={venta.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4 font-medium">#{venta.id}</td>

                        <td className="px-6 py-4">
                          {new Date(venta.createdAt).toLocaleString("es-MX")}
                        </td>

                        <td className="px-6 py-4">{venta.cliente.nombre}</td>

                        <td className="px-6 py-4">{venta.usuario.nombre}</td>

                        <td className="px-6 py-4 text-right font-semibold">
                          {moneda(Number(venta.total))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* COMPRAS */}

          <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-lg font-semibold">Compras del periodo</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {reporte.resumen.numeroCompras} compras encontradas.
              </p>
            </div>

            {reporte.compras.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                No hay compras.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3 font-medium">Folio</th>

                      <th className="px-6 py-3 font-medium">Fecha</th>

                      <th className="px-6 py-3 font-medium">Proveedor</th>

                      <th className="px-6 py-3 text-right font-medium">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {reporte.compras.map((compra: any) => (
                      <tr key={compra.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4 font-medium">#{compra.id}</td>

                        <td className="px-6 py-4">
                          {new Date(compra.createdAt).toLocaleString("es-MX")}
                        </td>

                        <td className="px-6 py-4">{compra.proveedor.nombre}</td>

                        <td className="px-6 py-4 text-right font-semibold">
                          {moneda(Number(compra.total))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}
