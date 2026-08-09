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
    return <p>Cargando venta...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!venta) {
    return <p>Venta no encontrada</p>;
  }

  return (
    <section>
      <Link to="/ventas/historial">
        ← Volver al historial
      </Link>

      <h1>Detalle de venta #{venta.id}</h1>

      <div>
        <p>
          <strong>Cliente:</strong> {venta.cliente.nombre}
        </p>

        <p>
          <strong>Correo:</strong> {venta.cliente.correo}
        </p>

        <p>
          <strong>Vendedor:</strong> {venta.usuario.nombre}
        </p>

        <p>
          <strong>Fecha:</strong>{" "}
          {new Date(venta.createdAt).toLocaleString("es-MX")}
        </p>
      </div>

      <hr />

      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>SKU</th>
            <th>Precio unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {venta.detalles.map((detalle) => {
            const precio = Number(detalle.precioUnitario);

            const subtotal =
              precio * detalle.cantidad;

            return (
              <tr key={detalle.id}>
                <td>{detalle.producto.nombre}</td>

                <td>{detalle.producto.sku}</td>

                <td>
                  $
                  {precio.toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>

                <td>{detalle.cantidad}</td>

                <td>
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
      </table>

      <h2>
        Total: $
        {Number(venta.total).toLocaleString("es-MX", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </h2>
    </section>
  );
}