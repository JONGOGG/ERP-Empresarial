import { useEffect, useMemo, useState } from "react";

import type { Producto } from "../tipos/Productos";
import type { Proveedor } from "../tipos/Proveedor";

import { obtenerProductos } from "../servicios/productosServicio";
import { obtenerProveedores } from "../servicios/proveedoresServicio";
import { crearCompra } from "../servicios/comprasServicio";

interface DetalleTemporal {
  productoId: number;
  cantidad: number;
  costoUnitario: number;
}

export function Compras() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  const [proveedorId, setProveedorId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [costoUnitario, setCostoUnitario] = useState("");

  const [detalles, setDetalles] = useState<DetalleTemporal[]>([]);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [productosDB, proveedoresDB] = await Promise.all([
          obtenerProductos(),
          obtenerProveedores(),
        ]);

        setProductos(productosDB);
        setProveedores(proveedoresDB);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los datos");
      }
    };

    cargarDatos();
  }, []);

  const agregarProducto = () => {
    const productoNumero = Number(productoId);
    const cantidadNumero = Number(cantidad);
    const costoNumero = Number(costoUnitario);

    if (!productoNumero) {
      setError("Selecciona un producto");
      return;
    }

    if (cantidadNumero <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }

    if (costoNumero <= 0) {
      setError("El costo debe ser mayor a 0");
      return;
    }

    const existente = detalles.find(
      (detalle) => detalle.productoId === productoNumero,
    );

    if (existente) {
      setDetalles((actuales) =>
        actuales.map((detalle) =>
          detalle.productoId === productoNumero
            ? {
                ...detalle,
                cantidad: detalle.cantidad + cantidadNumero,
                costoUnitario: costoNumero,
              }
            : detalle,
        ),
      );
    } else {
      setDetalles((actuales) => [
        ...actuales,
        {
          productoId: productoNumero,
          cantidad: cantidadNumero,
          costoUnitario: costoNumero,
        },
      ]);
    }

    setProductoId("");
    setCantidad("1");
    setCostoUnitario("");
    setError("");
  };

  const eliminarDetalle = (productoId: number) => {
    setDetalles((actuales) =>
      actuales.filter((detalle) => detalle.productoId !== productoId),
    );
  };

  const total = useMemo(() => {
    return detalles.reduce(
      (acumulado, detalle) =>
        acumulado + detalle.costoUnitario * detalle.cantidad,
      0,
    );
  }, [detalles]);

  const registrarCompra = async () => {
    if (!proveedorId) {
      setError("Selecciona un proveedor");
      return;
    }

    if (detalles.length === 0) {
      setError("Agrega al menos un producto");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await crearCompra({
        proveedorId: Number(proveedorId),
        productos: detalles,
      });

      setMensaje("Compra registrada correctamente");

      setProveedorId("");
      setDetalles([]);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudo registrar la compra");
      }
    } finally {
      setGuardando(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nueva compra</h1>

        <p className="mt-1 text-muted-foreground">
          Registra mercancía comprada a un proveedor.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
          <p className="text-sm font-medium text-danger">{error}</p>
        </div>
      )}

      {mensaje && (
        <div className="rounded-lg border border-success/20 bg-success/5 p-4">
          <p className="text-sm font-medium text-success">{mensaje}</p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <label className="mb-1.5 block text-sm font-medium">
              Proveedor
            </label>

            <select
              value={proveedorId}
              onChange={(e) => setProveedorId(e.target.value)}
              className={inputClass}
            >
              <option value="">Selecciona un proveedor</option>

              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <select
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                className={inputClass}
              >
                <option value="">Selecciona un producto</option>

                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                placeholder="Cantidad"
                className={inputClass}
              />

              <input
                type="number"
                min="0"
                step="0.01"
                value={costoUnitario}
                onChange={(e) => setCostoUnitario(e.target.value)}
                placeholder="Costo unitario"
                className={inputClass}
              />
            </div>

            <button
              type="button"
              onClick={agregarProducto}
              className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Agregar producto
            </button>
          </section>

          <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3">Producto</th>
                  <th className="px-6 py-3">Cantidad</th>
                  <th className="px-6 py-3">Costo</th>
                  <th className="px-6 py-3">Subtotal</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {detalles.map((detalle) => {
                  const producto = productos.find(
                    (p) => p.id === detalle.productoId,
                  );

                  if (!producto) return null;

                  const subtotal = detalle.costoUnitario * detalle.cantidad;

                  return (
                    <tr
                      key={detalle.productoId}
                      className="border-t border-border"
                    >
                      <td className="px-6 py-4">{producto.nombre}</td>

                      <td className="px-6 py-4">{detalle.cantidad}</td>

                      <td className="px-6 py-4">
                        ${detalle.costoUnitario.toFixed(2)}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        ${subtotal.toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => eliminarDetalle(detalle.productoId)}
                          className="text-danger"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Resumen de compra</h2>

          <div className="mt-5 rounded-xl bg-muted p-5">
            <p className="text-sm text-muted-foreground">Total</p>

            <p className="mt-2 text-3xl font-bold">
              $
              {total.toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <button
            type="button"
            disabled={guardando || !proveedorId || detalles.length === 0}
            onClick={registrarCompra}
            className="mt-5 w-full rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-50"
          >
            {guardando ? "Registrando..." : "Registrar compra"}
          </button>
        </aside>
      </div>
    </div>
  );
}
