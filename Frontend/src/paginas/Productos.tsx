import { useState } from "react";
import { useDatos } from "../contexto/DatosContexto";
import type { Producto } from "../tipos/Productos";

export function Productos() {
  const { productos, setProductos, categorias } = useDatos();

  const [nombre, setNombre] = useState("");
  const [sku, setSku] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [productoEditando, setProductoEditando] =
    useState<Producto | null>(null);

  const guardarProducto = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !nombre.trim() ||
      !sku.trim() ||
      !precio ||
      !stock ||
      !categoriaId
    ) {
      return;
    }

    if (productoEditando) {
      setProductos(
        productos.map((producto) =>
          producto.id === productoEditando.id
            ? {
                ...producto,
                nombre,
                sku,
                precio: Number(precio),
                stock: Number(stock),
                categoriaId: Number(categoriaId),
              }
            : producto
        )
      );

      setProductoEditando(null);
    } else {
      const nuevoProducto: Producto = {
        id: Date.now(),
        nombre,
        sku,
        precio: Number(precio),
        stock: Number(stock),
        categoriaId: Number(categoriaId),
      };

      setProductos([...productos, nuevoProducto]);
    }

    limpiarFormulario();
  };

  const seleccionarProducto = (producto: Producto) => {
    setProductoEditando(producto);
    setNombre(producto.nombre);
    setSku(producto.sku);
    setPrecio(producto.precio.toString());
    setStock(producto.stock.toString());
    setCategoriaId(producto.categoriaId.toString());
  };

  const eliminarProducto = (id: number) => {
    setProductos(
      productos.filter((producto) => producto.id !== id)
    );
  };

  const limpiarFormulario = () => {
    setNombre("");
    setSku("");
    setPrecio("");
    setStock("");
    setCategoriaId("");
    setProductoEditando(null);
  };

  const obtenerNombreCategoria = (id: number) => {
    return categorias.find((categoria) => categoria.id === id)?.nombre
      ?? "Sin categoría";
  };

  return (
    <section>
      <h1>Productos</h1>
      <p>Administra el inventario de productos.</p>

      {categorias.length === 0 && (
        <p>
          Primero debes crear al menos una categoría.
        </p>
      )}

      <form onSubmit={guardarProducto}>
        <div>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="sku">SKU</label>
          <input
            id="sku"
            type="text"
            value={sku}
            onChange={(event) => setSku(event.target.value)}
            placeholder="PROD-001"
          />
        </div>

        <div>
          <label htmlFor="precio">Precio</label>
          <input
            id="precio"
            type="number"
            min="0"
            step="0.01"
            value={precio}
            onChange={(event) => setPrecio(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            type="number"
            min="0"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="categoria">Categoría</label>

          <select
            id="categoria"
            value={categoriaId}
            onChange={(event) => setCategoriaId(event.target.value)}
          >
            <option value="">Selecciona una categoría</option>

            {categorias.map((categoria) => (
              <option
                key={categoria.id}
                value={categoria.id}
              >
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={categorias.length === 0}
        >
          {productoEditando
            ? "Guardar cambios"
            : "Agregar producto"}
        </button>

        {productoEditando && (
          <button
            type="button"
            onClick={limpiarFormulario}
          >
            Cancelar
          </button>
        )}
      </form>

      <hr />

      {productos.length === 0 ? (
        <p>No hay productos registrados.</p>
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
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.sku}</td>
                <td>${producto.precio.toFixed(2)}</td>
                <td>{producto.stock}</td>
                <td>
                  {obtenerNombreCategoria(producto.categoriaId)}
                </td>

                <td>
                  <button
                    onClick={() =>
                      seleccionarProducto(producto)
                    }
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      eliminarProducto(producto.id)
                    }
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}