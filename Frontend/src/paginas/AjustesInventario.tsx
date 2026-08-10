import { useEffect, useState } from "react";

import type { Producto } from "../tipos/Productos";

import { obtenerProductos } from "../servicios/productosServicio";

import { ajustarInventario } from "../servicios/inventarioServicio";

export function AjustesInventario() {
  const [productos, setProductos] = useState<Producto[]>([]);

  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setError("");

        const datos = await obtenerProductos();

        setProductos(datos);
      } catch (error) {
        console.error(error);

        setError("No se pudieron cargar los productos");
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  const productoSeleccionado = productos.find(
    (producto) => Number(producto.id) === Number(productoId),
  );

  const cantidadNumero = Number(cantidad || 0);

  const stockProyectado = productoSeleccionado
    ? productoSeleccionado.stock + cantidadNumero
    : 0;

  const guardarAjuste = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!productoId) {
      setError("Selecciona un producto");
      return;
    }

    if (!cantidadNumero) {
      setError("La cantidad debe ser diferente de 0");
      return;
    }

    if (!motivo.trim()) {
      setError("Escribe el motivo del ajuste");
      return;
    }

    if (stockProyectado < 0) {
      setError("El ajuste dejaría el stock en negativo");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await ajustarInventario({
        productoId: Number(productoId),
        cantidad: cantidadNumero,
        motivo: motivo.trim(),
      });

      setMensaje("Inventario ajustado correctamente");

      const productosActualizados = await obtenerProductos();

      setProductos(productosActualizados);

      setProductoId("");
      setCantidad("");
      setMotivo("");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudo realizar el ajuste");
      }
    } finally {
      setGuardando(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  if (cargando) {
    return <p className="text-muted-foreground">Cargando productos...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Ajustes de inventario
        </h1>

        <p className="mt-1 text-muted-foreground">
          Corrige existencias y registra el motivo del movimiento.
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

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-xl border border-border bg-surface shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">Nuevo ajuste</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Usa cantidades positivas para entradas y negativas para salidas.
            </p>
          </div>

          <form onSubmit={guardarAjuste} className="space-y-5 p-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Producto
              </label>

              <select
                value={productoId}
                onChange={(event) => setProductoId(event.target.value)}
                className={inputClass}
              >
                <option value="">Selecciona un producto</option>

                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} - Stock: {producto.stock}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Cantidad del ajuste
              </label>

              <input
                type="number"
                value={cantidad}
                onChange={(event) => setCantidad(event.target.value)}
                placeholder="Ej. 5 o -3"
                className={inputClass}
              />

              <p className="mt-1 text-xs text-muted-foreground">
                Ejemplo: +5 por conteo físico o -3 por producto dañado.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Motivo</label>

              <textarea
                value={motivo}
                onChange={(event) => setMotivo(event.target.value)}
                placeholder="Ej. Producto dañado durante traslado"
                rows={4}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={guardando}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "Registrar ajuste"}
            </button>
          </form>
        </section>

        <aside className="h-fit rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Resumen</h2>

          {!productoSeleccionado ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Selecciona un producto para ver el stock.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Producto</p>

                <p className="font-semibold">{productoSeleccionado.nombre}</p>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Stock actual
                </span>

                <strong>{productoSeleccionado.stock}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ajuste</span>

                <strong
                  className={
                    cantidadNumero > 0
                      ? "text-success"
                      : cantidadNumero < 0
                        ? "text-danger"
                        : ""
                  }
                >
                  {cantidadNumero > 0 ? "+" : ""}
                  {cantidadNumero}
                </strong>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  Stock resultante
                </p>

                <p
                  className={`mt-1 text-3xl font-bold ${
                    stockProyectado < 0 ? "text-danger" : ""
                  }`}
                >
                  {stockProyectado}
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
