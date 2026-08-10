import { useEffect, useMemo, useState } from "react";

import type { MovimientoInventario } from "../tipos/MovimientoInventario";
import type { Producto } from "../tipos/Productos";

import { obtenerMovimientos } from "../servicios/inventarioServicio";

import { obtenerProductos } from "../servicios/productosServicio";

export function Inventario() {
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);

  const [productos, setProductos] = useState<Producto[]>([]);

  const [productoId, setProductoId] = useState("");

  const [tipo, setTipo] = useState("");

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setError("");

        const [movimientosDB, productosDB] = await Promise.all([
          obtenerMovimientos(),
          obtenerProductos(),
        ]);

        setMovimientos(movimientosDB);
        setProductos(productosDB);
      } catch (error) {
        console.error(error);

        setError("No se pudo cargar el inventario");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter((movimiento) => {
      const coincideProducto =
        !productoId || movimiento.producto.id === Number(productoId);

      const coincideTipo = !tipo || movimiento.tipo === tipo;

      return coincideProducto && coincideTipo;
    });
  }, [movimientos, productoId, tipo]);

  if (cargando) {
    return <p className="text-muted-foreground">Cargando movimientos...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Movimientos de inventario
        </h1>

        <p className="mt-1 text-muted-foreground">
          Consulta las entradas y salidas de productos.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
          <p className="text-sm font-medium text-danger">{error}</p>
        </div>
      )}

      <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Producto</label>

            <select
              value={productoId}
              onChange={(event) => setProductoId(event.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Todos los productos</option>

              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Tipo</label>

            <select
              value={tipo}
              onChange={(event) => setTipo(event.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Todos</option>

              <option value="COMPRA">Compras</option>

              <option value="VENTA">Ventas</option>

              <option value="AJUSTE">Ajustes</option>
            </select>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">Kardex</h2>

          <p className="text-sm text-muted-foreground">
            {movimientosFiltrados.length} movimientos
          </p>
        </div>

        {movimientosFiltrados.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No hay movimientos registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3">Fecha</th>

                  <th className="px-6 py-3">Producto</th>

                  <th className="px-6 py-3">Tipo</th>

                  <th className="px-6 py-3 text-center">Cantidad</th>

                  <th className="px-6 py-3 text-center">Antes</th>

                  <th className="px-6 py-3 text-center">Después</th>

                  <th className="px-6 py-3">Referencia</th>

                  <th className="px-6 py-3">Usuario</th>
                </tr>
              </thead>

              <tbody>
                {movimientosFiltrados.map((movimiento) => (
                  <tr
                    key={movimiento.id}
                    className="border-t border-border hover:bg-muted/50"
                  >
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(movimiento.createdAt).toLocaleString("es-MX")}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium">
                        {movimiento.producto.nombre}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {movimiento.producto.sku}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          movimiento.tipo === "COMPRA"
                            ? "bg-success/10 text-success"
                            : movimiento.tipo === "VENTA"
                              ? "bg-danger/10 text-danger"
                              : "bg-accent/20 text-accent-foreground"
                        }`}
                      >
                        {movimiento.tipo}
                      </span>
                    </td>

                    <td
                      className={`px-6 py-4 text-center font-bold ${
                        movimiento.cantidad > 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {movimiento.cantidad > 0 ? "+" : ""}
                      {movimiento.cantidad}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {movimiento.stockAntes}
                    </td>

                    <td className="px-6 py-4 text-center font-semibold">
                      {movimiento.stockDespues}
                    </td>

                    <td className="px-6 py-4">
                      {movimiento.referencia ?? "Sin referencia"}
                    </td>

                    <td className="px-6 py-4">{movimiento.usuario.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
