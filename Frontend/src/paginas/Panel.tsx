import { useDatos } from "../contexto/DatosContexto";

export function Panel() {
  const { productos, categorias, clientes } = useDatos();

  const productosConStockBajo = productos.filter(
    (producto) => producto.stock <= 5
  ).length;

  const valorInventario = productos.reduce(
    (total, producto) => total + producto.precio * producto.stock,
    0
  );

  return (
    <section>
      <h1>Dashboard</h1>
      <p>Resumen general del sistema</p>

      <div>
        <article>
          <h3>Productos</h3>
          <strong>{productos.length}</strong>
        </article>

        <article>
          <h3>Categorías</h3>
          <strong>{categorias.length}</strong>
        </article>

        <article>
          <h3>Clientes</h3>
          <strong>{clientes.length}</strong>
        </article>

        <article>
          <h3>Stock bajo</h3>
          <strong>{productosConStockBajo}</strong>
        </article>

        <article>
          <h3>Valor del inventario</h3>
          <strong>
            $
            {valorInventario.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
        </article>
      </div>
    </section>
  );
}