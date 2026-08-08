import { useEffect, useState } from "react";
import type { Producto } from "../tipos/Productos";
import type { Categoria } from "../tipos/Categoria";

import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../servicios/productosServicio";

import {
  obtenerCategorias,
} from "../servicios/categoriasServicio";

export function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [nombre, setNombre] = useState("");
  const [sku, setSku] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const [productoEditando, setProductoEditando] =
    useState<Producto | null>(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setError("");

        const [productosDB, categoriasDB] =
          await Promise.all([
            obtenerProductos(),
            obtenerCategorias(),
          ]);

        setProductos(productosDB);
        setCategorias(categoriasDB);
      } catch (error) {
        console.error(error);

        setError(
          "No se pudieron cargar los productos"
        );
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

  const guardarProducto = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !nombre.trim() ||
      !sku.trim() ||
      !precio ||
      !stock ||
      !categoriaId
    ) {
      setError(
        "Todos los campos son obligatorios"
      );

      return;
    }

    const precioNumero = Number(precio);
    const stockNumero = Number(stock);
    const categoriaNumero = Number(categoriaId);

    if (precioNumero < 0) {
      setError(
        "El precio no puede ser negativo"
      );

      return;
    }

    if (stockNumero < 0) {
      setError(
        "El stock no puede ser negativo"
      );

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
        const productoActualizado =
          await actualizarProducto(
            productoEditando.id,
            datosProducto
          );

        setProductos((productosActuales) =>
          productosActuales.map(
            (producto) =>
              producto.id ===
              productoActualizado.id
                ? productoActualizado
                : producto
          )
        );
      } else {
        const nuevoProducto =
          await crearProducto(
            datosProducto
          );

        setProductos(
          (productosActuales) => [
            ...productosActuales,
            nuevoProducto,
          ]
        );
      }

      limpiarFormulario();
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo guardar el producto"
      );
    }
  };

  const seleccionarProducto = (
    producto: Producto
  ) => {
    setProductoEditando(producto);

    setNombre(producto.nombre);
    setSku(producto.sku);
    setPrecio(
      String(producto.precio)
    );
    setStock(
      String(producto.stock)
    );
    setCategoriaId(
      String(producto.categoriaId)
    );

    setError("");
  };

  const manejarEliminarProducto =
    async (id: number) => {
      try {
        setError("");

        await eliminarProducto(id);

        setProductos(
          (productosActuales) =>
            productosActuales.filter(
              (producto) =>
                producto.id !== id
            )
        );

        if (
          productoEditando?.id === id
        ) {
          limpiarFormulario();
        }
      } catch (error) {
        console.error(error);

        setError(
          "No se pudo eliminar el producto"
        );
      }
    };

  return (
    <section>
      <h1>Productos</h1>

      <p>
        Administra el inventario de
        productos.
      </p>

      {categorias.length === 0 && (
        <p>
          Primero debes crear al menos
          una categoría.
        </p>
      )}

      <form onSubmit={guardarProducto}>
        <div>
          <label htmlFor="nombre">
            Nombre
          </label>

          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(event) =>
              setNombre(
                event.target.value
              )
            }
            placeholder="Ej. Laptop Lenovo"
          />
        </div>

        <div>
          <label htmlFor="sku">
            SKU
          </label>

          <input
            id="sku"
            type="text"
            value={sku}
            onChange={(event) =>
              setSku(
                event.target.value
              )
            }
            placeholder="PROD-001"
          />
        </div>

        <div>
          <label htmlFor="precio">
            Precio
          </label>

          <input
            id="precio"
            type="number"
            min="0"
            step="0.01"
            value={precio}
            onChange={(event) =>
              setPrecio(
                event.target.value
              )
            }
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="stock">
            Stock
          </label>

          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(event) =>
              setStock(
                event.target.value
              )
            }
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="categoria">
            Categoría
          </label>

          <select
            id="categoria"
            value={categoriaId}
            onChange={(event) =>
              setCategoriaId(
                event.target.value
              )
            }
          >
            <option value="">
              Selecciona una categoría
            </option>

            {categorias.map(
              (categoria) => (
                <option
                  key={
                    categoria.id
                  }
                  value={
                    categoria.id
                  }
                >
                  {
                    categoria.nombre
                  }
                </option>
              )
            )}
          </select>
        </div>

        <button
          type="submit"
          disabled={
            categorias.length === 0
          }
        >
          {productoEditando
            ? "Guardar cambios"
            : "Agregar producto"}
        </button>

        {productoEditando && (
          <button
            type="button"
            onClick={
              limpiarFormulario
            }
          >
            Cancelar
          </button>
        )}
      </form>

      {error && (
        <p>{error}</p>
      )}

      <hr />

      {cargando ? (
        <p>
          Cargando productos...
        </p>
      ) : productos.length === 0 ? (
        <p>
          No hay productos registrados.
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>SKU</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map(
              (producto) => (
                <tr
                  key={
                    producto.id
                  }
                >
                  <td>
                    {
                      producto.nombre
                    }
                  </td>

                  <td>
                    {
                      producto.sku
                    }
                  </td>

                  <td>
                    $
                    {Number(
                      producto.precio
                    ).toFixed(2)}
                  </td>

                  <td>
                    {
                      producto.stock
                    }
                  </td>

                  <td>
                    {producto
                      .categoria
                      ?.nombre ??
                      "Sin categoría"}
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        seleccionarProducto(
                          producto
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        manejarEliminarProducto(
                          producto.id
                        )
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}