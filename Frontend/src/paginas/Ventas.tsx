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
      (item) => item.id === productoNumero
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
      (detalle) => detalle.productoId === productoNumero
    );

    if (existente) {
      const nuevaCantidad =
        existente.cantidad + cantidadNumero;

      if (nuevaCantidad > producto.stock) {
        setError("La cantidad total supera el stock disponible");
        return;
      }

      setDetalles(
        detalles.map((detalle) =>
          detalle.productoId === productoNumero
            ? {
                ...detalle,
                cantidad: nuevaCantidad,
              }
            : detalle
        )
      );
    } else {
      setDetalles([
        ...detalles,
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
    setDetalles(
      detalles.filter(
        (detalle) => detalle.productoId !== productoId
      )
    );
  };

  const total = useMemo(() => {
    return detalles.reduce((acumulado, detalle) => {
      const producto = productos.find(
        (item) => item.id === detalle.productoId
      );

      if (!producto) {
        return acumulado;
      }

      return (
        acumulado +
        Number(producto.precio) * detalle.cantidad
      );
    }, 0);
  }, [detalles, productos]);

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
      setDetalles([]);

      // Volvemos a consultar productos para obtener
      // el stock actualizado después de la venta.
      const productosActualizados =
        await obtenerProductos();

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

  return (
    <section>
      <h1>Ventas</h1>
      <p>Registra una nueva venta.</p>

      {error && <p>{error}</p>}
      {mensaje && <p>{mensaje}</p>}

      <div>
        <label htmlFor="cliente">
          Cliente
        </label>

        <select
          id="cliente"
          value={clienteId}
          onChange={(event) =>
            setClienteId(event.target.value)
          }
        >
          <option value="">
            Selecciona un cliente
          </option>

          {clientes.map((cliente) => (
            <option
              key={cliente.id}
              value={cliente.id}
            >
              {cliente.nombre}
            </option>
          ))}
        </select>
      </div>

      <hr />

      <div>
        <label htmlFor="producto">
          Producto
        </label>

        <select
          id="producto"
          value={productoId}
          onChange={(event) =>
            setProductoId(event.target.value)
          }
        >
          <option value="">
            Selecciona un producto
          </option>

          {productos.map((producto) => (
            <option
              key={producto.id}
              value={producto.id}
              disabled={producto.stock === 0}
            >
              {producto.nombre}
              {" - "}
              ${Number(producto.precio).toFixed(2)}
              {" - Stock: "}
              {producto.stock}
            </option>
          ))}
        </select>

        <label htmlFor="cantidad">
          Cantidad
        </label>

        <input
          id="cantidad"
          type="number"
          min="1"
          value={cantidad}
          onChange={(event) =>
            setCantidad(event.target.value)
          }
        />

        <button
          type="button"
          onClick={agregarProducto}
        >
          Agregar
        </button>
      </div>

      <hr />

      {detalles.length === 0 ? (
        <p>No hay productos agregados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {detalles.map((detalle) => {
              const producto = productos.find(
                (item) =>
                  item.id === detalle.productoId
              );

              if (!producto) {
                return null;
              }

              const subtotal =
                Number(producto.precio) *
                detalle.cantidad;

              return (
                <tr key={detalle.productoId}>
                  <td>{producto.nombre}</td>

                  <td>
                    $
                    {Number(
                      producto.precio
                    ).toFixed(2)}
                  </td>

                  <td>
                    {detalle.cantidad}
                  </td>

                  <td>
                    ${subtotal.toFixed(2)}
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        eliminarDetalle(
                          detalle.productoId
                        )
                      }
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <h2>
        Total: $
        {total.toLocaleString("es-MX", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </h2>

      <button
        type="button"
        disabled={
          guardando ||
          !clienteId ||
          detalles.length === 0
        }
        onClick={registrarVenta}
      >
        {guardando
          ? "Registrando..."
          : "Registrar venta"}
      </button>
    </section>
  );
}