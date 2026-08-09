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
    return <p>Cargando panel...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!resumen) {
    return <p>No hay información disponible.</p>;
  }

  return (
    <section>
      <h1>Dashboard</h1>

      <p>Resumen general del sistema</p>

      <div>
        <article>
          <h3>Ventas hoy</h3>
          <strong>{resumen.ventasHoy}</strong>
        </article>

        <article>
          <h3>Ingresos hoy</h3>

          <strong>
            $
            {resumen.ingresosHoy.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
        </article>

        <article>
          <h3>Productos</h3>
          <strong>{resumen.totalProductos}</strong>
        </article>

        <article>
          <h3>Categorías</h3>
          <strong>{resumen.totalCategorias}</strong>
        </article>

        <article>
          <h3>Clientes</h3>
          <strong>{resumen.totalClientes}</strong>
        </article>

        <article>
          <h3>Stock bajo</h3>
          <strong>{resumen.productosStockBajo.length}</strong>
        </article>

        <article>
          <h3>Valor del inventario</h3>

          <strong>
            $
            {resumen.valorInventario.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
        </article>
      </div>

      <section>
        <h2>Ingresos de los últimos 7 días</h2>

        <div
          style={{
            width: "100%",
            height: 300,
          }}
        >
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

              <Line type="monotone" dataKey="ingresos" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h2>Top 5 productos más vendidos</h2>

        {productosMasVendidos.length === 0 ? (
          <p>No hay ventas suficientes todavía.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Unidades vendidas</th>
              </tr>
            </thead>

            <tbody>
              {productosMasVendidos.map((producto) => (
                <tr key={producto.productoId}>
                  <td>{producto.nombre}</td>
                  <td>{producto.sku}</td>
                  <td>{producto.cantidadVendida}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Productos con stock bajo</h2>

        {resumen.productosStockBajo.length === 0 ? (
          <p>No hay productos con stock bajo.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Stock</th>
              </tr>
            </thead>

            <tbody>
              {resumen.productosStockBajo.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>{producto.sku}</td>
                  <td>{producto.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </section>
  );
}
