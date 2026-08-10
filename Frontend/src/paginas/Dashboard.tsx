import { useEffect, useState } from "react";

import {
  obtenerResumenDashboard,
  obtenerVentasUltimos7Dias,
  obtenerProductosMasVendidos,
  type ResumenDashboard,
  type VentaDia,
  type ProductoMasVendido,
} from "../servicios/dashboardServicio";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export function Dashboard() {
  const [resumen, setResumen] = useState<ResumenDashboard | null>(null);

  const [ventas7Dias, setVentas7Dias] = useState<VentaDia[]>([]);

  const [productosMasVendidos, setProductosMasVendidos] = useState<
    ProductoMasVendido[]
  >([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        setError("");

        const [resumenDB, ventasDB, productosDB] = await Promise.all([
          obtenerResumenDashboard(),
          obtenerVentasUltimos7Dias(),
          obtenerProductosMasVendidos(),
        ]);

        setResumen(resumenDB);
        setVentas7Dias(ventasDB);
        setProductosMasVendidos(productosDB);
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("No se pudo cargar el dashboard");
        }
      } finally {
        setCargando(false);
      }
    };

    cargarDashboard();
  }, []);

  if (cargando) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-muted-foreground">Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
        <p className="font-medium text-danger">{error}</p>
      </div>
    );
  }

  if (!resumen) {
    return (
      <p className="text-muted-foreground">No hay información disponible.</p>
    );
  }

  return (
    <div className="space-y-8">
      {/* Encabezado */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <p className="mt-1 text-muted-foreground">
          Resumen general del sistema
        </p>
      </div>

      {/* Tarjetas */}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Ventas hoy
          </p>

          <strong className="mt-2 block text-3xl font-bold">
            {resumen.ventasHoy}
          </strong>
        </article>

        <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Ingresos hoy
          </p>

          <strong className="mt-2 block text-3xl font-bold">
            $
            {resumen.ingresosHoy.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
        </article>

        <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Productos</p>

          <strong className="mt-2 block text-3xl font-bold">
            {resumen.totalProductos}
          </strong>
        </article>

        <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Categorías
          </p>

          <strong className="mt-2 block text-3xl font-bold">
            {resumen.totalCategorias}
          </strong>
        </article>

        <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Clientes</p>

          <strong className="mt-2 block text-3xl font-bold">
            {resumen.totalClientes}
          </strong>
        </article>

        <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Stock bajo
          </p>

          <strong className="mt-2 block text-3xl font-bold text-danger">
            {resumen.productosStockBajo.length}
          </strong>
        </article>

        <article className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:col-span-2">
          <p className="text-sm font-medium text-muted-foreground">
            Valor del inventario
          </p>

          <strong className="mt-2 block text-3xl font-bold">
            $
            {resumen.valorInventario.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
        </article>
      </section>

      {/* Gráfica */}

      <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Ingresos de los últimos 7 días
          </h2>

          <p className="text-sm text-muted-foreground">
            Evolución diaria de ingresos
          </p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ventas7Dias}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="fecha"
                tickFormatter={(fecha) =>
                  new Date(fecha).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "2-digit",
                  })
                }
              />

              <YAxis />

              <Tooltip
                formatter={(valor) => [
                  `$${Number(valor).toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  "Ingresos",
                ]}
              />

              <Line
                type="monotone"
                dataKey="ingresos"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{
                  fill: "var(--color-primary)",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Tablas */}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <div className="border-b border-border p-5">
            <h2 className="font-semibold">Top 5 productos más vendidos</h2>
          </div>

          {productosMasVendidos.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">
              No hay ventas suficientes todavía.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-5 py-3 font-medium">Producto</th>
                    <th className="px-5 py-3 font-medium">SKU</th>
                    <th className="px-5 py-3 text-right font-medium">
                      Vendidos
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {productosMasVendidos.map((producto) => (
                    <tr
                      key={producto.productoId}
                      className="border-t border-border"
                    >
                      <td className="px-5 py-4 font-medium">
                        {producto.nombre}
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {producto.sku}
                      </td>

                      <td className="px-5 py-4 text-right font-semibold">
                        {producto.cantidadVendida}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <div className="border-b border-border p-5">
            <h2 className="font-semibold">Productos con stock bajo</h2>
          </div>

          {resumen.productosStockBajo.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">
              No hay productos con stock bajo.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-5 py-3 font-medium">Producto</th>
                    <th className="px-5 py-3 font-medium">SKU</th>
                    <th className="px-5 py-3 text-right font-medium">Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {resumen.productosStockBajo.map((producto) => (
                    <tr key={producto.id} className="border-t border-border">
                      <td className="px-5 py-4 font-medium">
                        {producto.nombre}
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {producto.sku}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-danger">
                        {producto.stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
