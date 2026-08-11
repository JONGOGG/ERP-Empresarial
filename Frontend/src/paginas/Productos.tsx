import { useEffect, useState } from "react";
import type { Producto } from "../tipos/Productos";
import type { Categoria } from "../tipos/Categoria";

import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../servicios/productosServicio";

import { obtenerCategorias } from "../servicios/categoriasServicio";

export function Productos() {
  const usuarioGuardado = localStorage.getItem("usuario");

  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  const esAdmin = usuario?.rol === "ADMIN";

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [nombre, setNombre] = useState("");
  const [sku, setSku] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const [productoEditando, setProductoEditando] = useState<Producto | null>(
    null,
  );

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setError("");

        const [productosDB, categoriasDB] = await Promise.all([
          obtenerProductos(),
          obtenerCategorias(),
        ]);

        setProductos(productosDB);
        setCategorias(categoriasDB);
      } catch (error) {
        console.error(error);

        setError("No se pudieron cargar los productos");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setSku("");
    setPrecio("");
    setStock("");
    setCategoriaId("");
    setProductoEditando(null);
  };

  const guardarProducto = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nombre.trim() || !sku.trim() || !precio || !stock || !categoriaId) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const precioNumero = Number(precio);
    const stockNumero = Number(stock);
    const categoriaNumero = Number(categoriaId);

    if (precioNumero < 0) {
      setError("El precio no puede ser negativo");
      return;
    }

    if (stockNumero < 0) {
      setError("El stock no puede ser negativo");
      return;
    }

    const datosProducto = {
      nombre: nombre.trim(),
      sku: sku.trim(),
      precio: precioNumero,
      stock: stockNumero,
      categoriaId: categoriaNumero,
    };

    try {
      setError("");

      if (productoEditando) {
        const productoActualizado = await actualizarProducto(
          productoEditando.id,
          datosProducto,
        );

        setProductos((productosActuales) =>
          productosActuales.map((producto) =>
            producto.id === productoActualizado.id
              ? productoActualizado
              : producto,
          ),
        );
      } else {
        const nuevoProducto = await crearProducto(datosProducto);

        setProductos((productosActuales) => [
          ...productosActuales,
          nuevoProducto,
        ]);
      }

      limpiarFormulario();
    } catch (error) {
      console.error(error);
      setError("No se pudo guardar el producto");
    }
  };

  const seleccionarProducto = (producto: Producto) => {
    setProductoEditando(producto);

    setNombre(producto.nombre);
    setSku(producto.sku);
    setPrecio(String(producto.precio));
    setStock(String(producto.stock));
    setCategoriaId(String(producto.categoriaId));

    setError("");
  };

  const manejarEliminarProducto = async (id: number) => {
    try {
      setError("");

      await eliminarProducto(id);

      setProductos((productosActuales) =>
        productosActuales.filter((producto) => producto.id !== id),
      );

      if (productoEditando?.id === id) {
        limpiarFormulario();
      }
    } catch (error) {
      console.error(error);
      setError("No se pudo eliminar el producto");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

  return (
    <div className="space-y-6">
      {/* Encabezado */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Productos</h1>

        <p className="mt-1 text-muted-foreground">
          Administra el inventario de productos.
        </p>
      </div>

      {/* Aviso */}

      {esAdmin && categorias.length === 0 && (
        <div className="rounded-lg border border-accent/30 bg-accent/10 p-4">
          <p className="text-sm font-medium">
            Primero debes crear al menos una categoría.
          </p>
        </div>
      )}

      {/* Error */}

      {error && (
        <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
          <p className="text-sm font-medium text-danger">{error}</p>
        </div>
      )}

      {/* Formulario */}
      {esAdmin && (
        <section className="rounded-xl border border-border bg-surface shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold">
              {productoEditando ? "Editar producto" : "Nuevo producto"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {productoEditando
                ? "Modifica la información del producto seleccionado."
                : "Registra un nuevo producto en el inventario."}
            </p>
          </div>

          <form onSubmit={guardarProducto} className="p-6">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              <div>
                <label htmlFor="nombre" className={labelClass}>
                  Nombre
                </label>

                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  placeholder="Ej. Laptop Lenovo"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="sku" className={labelClass}>
                  SKU
                </label>

                <input
                  id="sku"
                  type="text"
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  placeholder="PROD-001"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="precio" className={labelClass}>
                  Precio
                </label>

                <input
                  id="precio"
                  type="number"
                  min="0"
                  step="0.01"
                  value={precio}
                  onChange={(event) => setPrecio(event.target.value)}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="stock" className={labelClass}>
                  Stock
                </label>

                <input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="categoria" className={labelClass}>
                  Categoría
                </label>

                <select
                  id="categoria"
                  value={categoriaId}
                  onChange={(event) => setCategoriaId(event.target.value)}
                  className={inputClass}
                >
                  <option value="">Selecciona una categoría</option>

                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={categorias.length === 0}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {productoEditando ? "Guardar cambios" : "Agregar producto"}
              </button>

              {productoEditando && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>
      )}
      {/* Tabla */}

      <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Inventario</h2>

            <p className="text-sm text-muted-foreground">
              {productos.length} productos registrados
            </p>
          </div>
        </div>

        {cargando ? (
          <div className="p-8 text-center text-muted-foreground">
            Cargando productos...
          </div>
        ) : productos.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No hay productos registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 font-medium">Nombre</th>

                  <th className="px-6 py-3 font-medium">SKU</th>

                  <th className="px-6 py-3 font-medium">Precio</th>

                  <th className="px-6 py-3 font-medium">Stock</th>

                  <th className="px-6 py-3 font-medium">Categoría</th>
                  {esAdmin && (
                    <th className="px-6 py-3 text-right font-medium">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {productos.map((producto) => (
                  <tr
                    key={producto.id}
                    className="border-t border-border transition hover:bg-muted/50"
                  >
                    <td className="px-6 py-4 font-medium">{producto.nombre}</td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {producto.sku}
                    </td>

                    <td className="px-6 py-4">
                      $
                      {Number(producto.precio).toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          producto.stock === 0
                            ? "bg-danger/10 text-danger"
                            : producto.stock <= 5
                              ? "bg-accent/20 text-accent-foreground"
                              : "bg-success/10 text-success"
                        }`}
                      >
                        {producto.stock === 0
                          ? "Sin stock"
                          : producto.stock <= 5
                            ? `${producto.stock} - Bajo`
                            : producto.stock}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {producto.categoria?.nombre ?? "Sin categoría"}
                    </td>

                    {esAdmin && (
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => seleccionarProducto(producto)}
                            className="rounded-lg border border-border px-3 py-2 text-xs font-medium transition hover:bg-muted"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => manejarEliminarProducto(producto.id)}
                            className="rounded-lg px-3 py-2 text-xs font-medium text-danger transition hover:bg-danger/10"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    )}
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
