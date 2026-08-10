import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { Compra } from "../tipos/Compra";
import { obtenerCompraPorId } from "../servicios/comprasServicio";

export function DetalleCompra() {
  const { id } = useParams();

  const [compra, setCompra] = useState<Compra | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const compraId = Number(id);

        if (Number.isNaN(compraId)) {
          setError("ID inválido");
          return;
        }

        const datos = await obtenerCompraPorId(compraId);

        setCompra(datos);
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar la compra");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [id]);

  if (cargando) {
    return <p>Cargando compra...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!compra) {
    return <p>Compra no encontrada.</p>;
  }

  return (
    <div className="space-y-6">
      <Link to="/compras/historial" className="text-primary hover:underline">
        ← Volver al historial
      </Link>

      <h1 className="text-3xl font-bold">Compra #{compra.id}</h1>

      <section className="rounded-xl border border-border bg-surface p-6">
        <p>
          <strong>Proveedor:</strong> {compra.proveedor.nombre}
        </p>

        <p>
          <strong>Registró:</strong> {compra.usuario.nombre}
        </p>

        <p>
          <strong>Fecha:</strong>{" "}
          {new Date(compra.createdAt).toLocaleString("es-MX")}
        </p>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3">Producto</th>
              <th className="px-6 py-3">SKU</th>
              <th className="px-6 py-3">Cantidad</th>
              <th className="px-6 py-3">Costo</th>
              <th className="px-6 py-3">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {compra.detalles.map((detalle) => {
              const costo = Number(detalle.costoUnitario);

              const subtotal = costo * detalle.cantidad;

              return (
                <tr key={detalle.id} className="border-t border-border">
                  <td className="px-6 py-4">{detalle.producto.nombre}</td>

                  <td className="px-6 py-4">{detalle.producto.sku}</td>

                  <td className="px-6 py-4">{detalle.cantidad}</td>

                  <td className="px-6 py-4">${costo.toFixed(2)}</td>

                  <td className="px-6 py-4 font-semibold">
                    ${subtotal.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <div className="text-right">
        <p className="text-sm text-muted-foreground">Total</p>

        <p className="text-3xl font-bold">
          $
          {Number(compra.total).toLocaleString("es-MX", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
}
