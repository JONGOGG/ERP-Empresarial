import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Venta } from "../tipos/Venta";
import { obtenerVentas } from "../servicios/ventasServicio";

export function HistorialVentas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        setCargando(true);
        setError("");

        const datos = await obtenerVentas();

        setVentas(datos);
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("No se pudieron cargar las ventas");
        }
      } finally {
        setCargando(false);
      }
    };

    cargarVentas();
  }, []);

  if (cargando) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-muted-foreground">Cargando ventas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Historial de ventas
        </h1>

        <p className="mt-1 text-muted-foreground">
          Consulta las ventas registradas en el sistema.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
          <p className="text-sm font-medium text-danger">{error}</p>
        </div>
      )}

      {/* Tabla */}

      <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Ventas registradas</h2>

            <p className="text-sm text-muted-foreground">
              {ventas.length} ventas
            </p>
          </div>

          <Link
            to="/ventas"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Nueva venta
          </Link>
        </div>

        {ventas.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium">No hay ventas registradas.</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Registra tu primera venta para verla aquí.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 font-medium">Folio</th>

                  <th className="px-6 py-3 font-medium">Fecha</th>

                  <th className="px-6 py-3 font-medium">Cliente</th>

                  <th className="px-6 py-3 font-medium">Vendedor</th>

                  <th className="px-6 py-3 text-center font-medium">
                    Productos
                  </th>

                  <th className="px-6 py-3 text-right font-medium">Total</th>

                  <th className="px-6 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {ventas.map((venta) => {
                  const cantidadProductos = venta.detalles.reduce(
                    (total, detalle) => total + detalle.cantidad,
                    0,
                  );

                  return (
                    <tr
                      key={venta.id}
                      className="border-t border-border transition hover:bg-muted/50"
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-primary">
                          #{venta.id}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(venta.createdAt).toLocaleString("es-MX")}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {venta.cliente.nombre}
                      </td>

                      <td className="px-6 py-4">{venta.usuario.nombre}</td>

                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                          {cantidadProductos}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right font-semibold">
                        $
                        {Number(venta.total).toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <Link
                            to={`/ventas/${venta.id}`}
                            className="rounded-lg border border-border px-3 py-2 text-xs font-medium transition hover:bg-muted"
                          >
                            Ver detalle
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
