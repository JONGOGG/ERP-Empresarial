import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Compra } from "../tipos/Compra";
import { obtenerCompras } from "../servicios/comprasServicio";

export function HistorialCompras() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await obtenerCompras();
        setCompras(datos);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar las compras");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  if (cargando) {
    return <p>Cargando compras...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Historial de compras</h1>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3">Folio</th>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Proveedor</th>
              <th className="px-6 py-3">Usuario</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {compras.map((compra) => (
              <tr key={compra.id} className="border-t border-border">
                <td className="px-6 py-4">#{compra.id}</td>

                <td className="px-6 py-4">
                  {new Date(compra.createdAt).toLocaleString("es-MX")}
                </td>

                <td className="px-6 py-4">{compra.proveedor.nombre}</td>

                <td className="px-6 py-4">{compra.usuario.nombre}</td>

                <td className="px-6 py-4 font-semibold">
                  $
                  {Number(compra.total).toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>

                <td className="px-6 py-4">
                  <Link
                    to={`/compras/${compra.id}`}
                    className="text-primary hover:underline"
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
