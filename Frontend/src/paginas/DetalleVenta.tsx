import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import type { Venta } from "../tipos/Venta";
import { obtenerVentaPorId } from "../servicios/ventasServicio";

export function DetalleVenta() {
  const { id } = useParams();

  const [venta, setVenta] = useState<Venta | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarVenta = async () => {
      try {
        setError("");

        const ventaId = Number(id);

        if (Number.isNaN(ventaId)) {
          setError("ID de venta inválido");
          return;
        }

        const datos = await obtenerVentaPorId(ventaId);

        setVenta(datos);
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("No se pudo cargar la venta");
        }
      } finally {
        setCargando(false);
      }
    };

    cargarVenta();
  }, [id]);

  if (cargando) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-muted-foreground">Cargando venta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
        <p className="text-sm font-medium text-danger">{error}</p>
      </div>
    );
  }

  if (!venta) {
    return <p className="text-muted-foreground">Venta no encontrada.</p>;
  }

  const totalUnidades = venta.detalles.reduce(
    (total, detalle) => total + detalle.cantidad,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Volver */}

      <Link
        to="/ventas/historial"
        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
      >
        ← Volver al historial
      </Link>

      {/* Encabezado */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Venta registrada</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Venta #{venta.id}
          </h1>

          <p className="mt-1 text-muted-foreground">
            Detalle completo de la operación.
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-sm text-muted-foreground">Total</p>

          <p className="text-3xl font-bold">
            $
            {Number(venta.total).toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* Información */}

      <section className="rounded-xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">Información de la venta</h2>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground">Cliente</p>

            <p className="mt-1 font-semibold">{venta.cliente.nombre}</p>

            <p className="mt-1 text-sm text-muted-foreground">
              {venta.cliente.correo}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Vendedor</p>

            <p className="mt-1 font-semibold">{venta.usuario.nombre}</p>

            <p className="mt-1 text-sm text-muted-foreground">
              {venta.usuario.correo}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Fecha</p>

            <p className="mt-1 font-semibold">
              {new Date(venta.createdAt).toLocaleDateString("es-MX")}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(venta.createdAt).toLocaleTimeString("es-MX")}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Unidades</p>

            <p className="mt-1 text-2xl font-bold">{totalUnidades}</p>
          </div>
        </div>
      </section>

      {/* Productos */}

      <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">Productos vendidos</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {venta.detalles.length} productos distintos
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 font-medium">Producto</th>

                <th className="px-6 py-3 font-medium">SKU</th>

                <th className="px-6 py-3 text-right font-medium">
                  Precio unitario
                </th>

                <th className="px-6 py-3 text-center font-medium">Cantidad</th>

                <th className="px-6 py-3 text-right font-medium">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {venta.detalles.map((detalle) => {
                const precio = Number(detalle.precioUnitario);

                const subtotal = precio * detalle.cantidad;

                return (
                  <tr key={detalle.id} className="border-t border-border">
                    <td className="px-6 py-4 font-medium">
                      {detalle.producto.nombre}
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {detalle.producto.sku}
                    </td>

                    <td className="px-6 py-4 text-right">
                      $
                      {precio.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {detalle.cantidad}
                    </td>

                    <td className="px-6 py-4 text-right font-semibold">
                      $
                      {subtotal.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="border-t border-border bg-muted/50">
                <td colSpan={4} className="px-6 py-4 text-right font-semibold">
                  Total
                </td>

                <td className="px-6 py-4 text-right text-lg font-bold">
                  $
                  {Number(venta.total).toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
