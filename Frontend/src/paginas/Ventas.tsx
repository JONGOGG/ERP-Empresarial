import { useEffect, useMemo, useState } from "react";

import type { Cliente } from "../tipos/Cliente";
import type { Producto } from "../tipos/Productos";

import { obtenerClientes } from "../servicios/clientesServicios";
import { obtenerProductos } from "../servicios/productosServicio";
import { crearVenta } from "../servicios/ventasServicio";

interface DetalleTemporal {
  productoId: number;
  cantidad: number;
}

export function Ventas() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("1");

  const [detalles, setDetalles] = useState<DetalleTemporal[]>([]);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [clientesDB, productosDB] = await Promise.all([
          obtenerClientes(),
          obtenerProductos(),
        ]);

        setClientes(clientesDB);
        setProductos(productosDB);
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

    if (!productoNumero || cantidadNumero <= 0) {
      setError("Selecciona un producto y una cantidad válida");
      return;
    }

    const producto = productos.find(
      (item) => Number(item.id) === productoNumero,
    );

    if (!producto) {
      setError("Producto no encontrado");
      return;
    }

    if (cantidadNumero > producto.stock) {
      setError("La cantidad supera el stock disponible");
      return;
    }

    const existente = detalles.find(
      (detalle) => Number(detalle.productoId) === productoNumero,
    );

    if (existente) {
      const nuevaCantidad = Number(existente.cantidad) + cantidadNumero;

      if (nuevaCantidad > producto.stock) {
        setError("La cantidad total supera el stock disponible");
        return;
      }

      setDetalles((detallesActuales) =>
        detallesActuales.map((detalle) =>
          Number(detalle.productoId) === productoNumero
            ? {
                ...detalle,
                cantidad: nuevaCantidad,
              }
            : detalle,
        ),
      );
    } else {
      setDetalles((detallesActuales) => [
        ...detallesActuales,
        {
          productoId: productoNumero,
          cantidad: cantidadNumero,
        },
      ]);
    }

    setProductoId("");
    setCantidad("1");
    setError("");
  };

  const eliminarDetalle = (productoId: number) => {
    setDetalles((detallesActuales) =>
      detallesActuales.filter(
        (detalle) => Number(detalle.productoId) !== Number(productoId),
      ),
    );
  };

  // ==========================================
  // OBTENER SUBTOTAL
  // ==========================================

  const obtenerSubtotal = (productoId: number, cantidad: number) => {
    const producto = productos.find(
      (producto) => Number(producto.id) === Number(productoId),
    );

    if (!producto) {
      return 0;
    }

    const precioNumero = Number(producto.precio);
    const cantidadNumero = Number(cantidad);

    if (Number.isNaN(precioNumero) || Number.isNaN(cantidadNumero)) {
      return 0;
    }

    return precioNumero * cantidadNumero;
  };

  // ==========================================
  // TOTAL DE LA VENTA
  // ==========================================

  const total = useMemo(() => {
    return detalles.reduce(
      (acumulado, detalle) =>
        acumulado + obtenerSubtotal(detalle.productoId, detalle.cantidad),
      0,
    );
  }, [detalles, productos]);

  const totalUnidades = useMemo(() => {
    return detalles.reduce(
      (acumulado, detalle) => acumulado + Number(detalle.cantidad),
      0,
    );
  }, [detalles]);

  const registrarVenta = async () => {
    if (!clienteId) {
      setError("Selecciona un cliente");
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

      await crearVenta({
        clienteId: Number(clienteId),
        productos: detalles,
      });

      setMensaje("Venta registrada correctamente");

      setClienteId("");
      setProductoId("");
      setCantidad("1");
      setDetalles([]);

      const productosActualizados = await obtenerProductos();

      setProductos(productosActualizados);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudo registrar la venta");
      }
    } finally {
      setGuardando(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

  return (
    <div className="space-y-6">
      {/* ENCABEZADO */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nueva venta</h1>

        <p className="mt-1 text-muted-foreground">
          Registra productos y genera una nueva venta.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
          <p className="text-sm font-medium text-danger">{error}</p>
        </div>
      )}

      {/* MENSAJE */}

      {mensaje && (
        <div className="rounded-lg border border-success/20 bg-success/5 p-4">
          <p className="text-sm font-medium text-success">{mensaje}</p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* COLUMNA IZQUIERDA */}

        <div className="space-y-6">
          {/* CLIENTE */}

          <section className="rounded-xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold">Cliente</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Selecciona el cliente de la venta.
              </p>
            </div>

            <div className="p-6">
              <label htmlFor="cliente" className={labelClass}>
                Cliente
              </label>

              <select
                id="cliente"
                value={clienteId}
                onChange={(event) => setClienteId(event.target.value)}
                className={inputClass}
              >
                <option value="">Selecciona un cliente</option>

                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* AGREGAR PRODUCTO */}

          <section className="rounded-xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold">Agregar producto</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Selecciona un producto y la cantidad.
              </p>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-[1fr_140px_auto] md:items-end">
              <div>
                <label htmlFor="producto" className={labelClass}>
                  Producto
                </label>

                <select
                  id="producto"
                  value={productoId}
                  onChange={(event) => setProductoId(event.target.value)}
                  className={inputClass}
                >
                  <option value="">Selecciona un producto</option>

                  {productos.map((producto) => (
                    <option
                      key={producto.id}
                      value={producto.id}
                      disabled={producto.stock === 0}
                    >
                      {producto.nombre}
                      {" - $"}
                      {Number(producto.precio).toFixed(2)}
                      {" - Stock: "}
                      {producto.stock}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="cantidad" className={labelClass}>
                  Cantidad
                </label>

                <input
                  id="cantidad"
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(event) => setCantidad(event.target.value)}
                  className={inputClass}
                />
              </div>

              <button
                type="button"
                onClick={agregarProducto}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Agregar
              </button>
            </div>
          </section>

          {/* PRODUCTOS DE LA VENTA */}

          <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold">Productos de la venta</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {detalles.length} productos distintos
              </p>
            </div>

            {detalles.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No hay productos agregados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 font-medium">Producto</th>

                      <th className="px-6 py-3 font-medium">Precio</th>

                      <th className="px-6 py-3 text-center font-medium">
                        Cantidad
                      </th>

                      <th className="px-6 py-3 text-right font-medium">
                        Total parcial
                      </th>

                      <th className="px-6 py-3 text-right font-medium">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {detalles.map((detalle) => {
                      const producto = productos.find(
                        (item) =>
                          Number(item.id) === Number(detalle.productoId),
                      );

                      if (!producto) {
                        return null;
                      }

                      const subtotal = obtenerSubtotal(
                        detalle.productoId,
                        detalle.cantidad,
                      );

                      return (
                        <tr
                          key={detalle.productoId}
                          className="border-t border-border"
                        >
                          <td className="px-6 py-4 font-medium">
                            {producto.nombre}
                          </td>

                          <td className="px-6 py-4 text-muted-foreground">
                            $
                            {Number(producto.precio).toLocaleString("es-MX", {
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

                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                eliminarDetalle(detalle.productoId)
                              }
                              className="rounded-lg px-3 py-2 text-xs font-medium text-danger transition hover:bg-danger/10"
                            >
                              Eliminar
                            </button>
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

        {/* RESUMEN */}

        <aside className="h-fit rounded-xl border border-border bg-surface shadow-sm xl:sticky xl:top-24">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Resumen de venta</h2>
          </div>

          <div className="space-y-5 p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Productos distintos
                </span>

                <span className="font-semibold">{detalles.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Unidades</span>

                <span className="font-semibold">{totalUnidades}</span>
              </div>
            </div>

            <div className="rounded-xl bg-muted p-5">
              <p className="text-sm font-medium text-muted-foreground">
                Total de la venta
              </p>

              <p className="mt-2 text-3xl font-bold text-foreground">
                $
                {Number(total).toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <button
              type="button"
              disabled={guardando || !clienteId || detalles.length === 0}
              onClick={registrarVenta}
              className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {guardando ? "Registrando..." : "Registrar venta"}
            </button>

            {!clienteId && (
              <p className="text-center text-xs text-muted-foreground">
                Selecciona un cliente para continuar.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
