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
    return <p>Cargando ventas...</p>;
  }

  return (
    <section>
      <h1>Historial de ventas</h1>

      <p>Consulta las ventas registradas en el sistema.</p>

      {error && <p>{error}</p>}

      {ventas.length === 0 ? (
        <p>No hay ventas registradas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Folio</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id}>
                <td>#{venta.id}</td>

                <td>{new Date(venta.createdAt).toLocaleString("es-MX")}</td>

                <td>{venta.cliente.nombre}</td>

                <td>{venta.usuario.nombre}</td>

                <td>
                  {venta.detalles.reduce(
                    (total, detalle) => total + detalle.cantidad,
                    0,
                  )}
                </td>

                <td>
                  $
                  {Number(venta.total).toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td>
                  <Link to={`/ventas/${venta.id}`}>Ver detalle</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
