import { useEffect, useState } from "react";
import type { Categoria } from "../tipos/Categoria";

import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../servicios/categoriasServicio";

export function Categorias() {
  // Categorías obtenidas desde PostgreSQL
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Categoría que estamos editando
  const [categoriaEditando, setCategoriaEditando] =
    useState<Categoria | null>(null);

  // Estados de la petición
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // CARGAR CATEGORÍAS DESDE EL BACKEND
  // ==========================================

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const datos = await obtenerCategorias();

        setCategorias(datos);
      } catch (error) {
        console.error(error);

        setError("No se pudieron cargar las categorías");
      } finally {
        setCargando(false);
      }
    };

    cargarCategorias();
  }, []);

  // ==========================================
  // LIMPIAR FORMULARIO
  // ==========================================

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setCategoriaEditando(null);
  };

  // ==========================================
  // CREAR O ACTUALIZAR CATEGORÍA
  // ==========================================

  const guardarCategoria = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      setError("");

      // Si existe categoriaEditando, actualizamos
      if (categoriaEditando) {
        const categoriaActualizada =
          await actualizarCategoria(
            categoriaEditando.id,
            {
              nombre: nombre.trim(),
              descripcion: descripcion.trim(),
            }
          );

        setCategorias((categoriasActuales) =>
          categoriasActuales.map((categoria) =>
            categoria.id === categoriaActualizada.id
              ? categoriaActualizada
              : categoria
          )
        );
      } else {
        // Si no estamos editando, creamos
        const nuevaCategoria = await crearCategoria({
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
        });

        setCategorias((categoriasActuales) => [
          ...categoriasActuales,
          nuevaCategoria,
        ]);
      }

      limpiarFormulario();
    } catch (error) {
      console.error(error);

      setError(
        "Ocurrió un error al guardar la categoría"
      );
    }
  };

  // ==========================================
  // SELECCIONAR CATEGORÍA PARA EDITAR
  // ==========================================

  const seleccionarCategoria = (
    categoria: Categoria
  ) => {
    setCategoriaEditando(categoria);

    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion ?? "");

    setError("");
  };

  // ==========================================
  // ELIMINAR CATEGORÍA
  // ==========================================

  const manejarEliminarCategoria = async (
    id: number
  ) => {
    try {
      setError("");

      await eliminarCategoria(id);

      setCategorias((categoriasActuales) =>
        categoriasActuales.filter(
          (categoria) => categoria.id !== id
        )
      );

      // Si eliminamos la categoría que estábamos
      // editando, limpiamos el formulario
      if (categoriaEditando?.id === id) {
        limpiarFormulario();
      }
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo eliminar la categoría"
      );
    }
  };

  // ==========================================
  // VISTA
  // ==========================================

  return (
    <section>
      <h1>Categorías</h1>

      <p>
        Administra las categorías de productos.
      </p>

      {/* FORMULARIO */}

      <form onSubmit={guardarCategoria}>
        <div>
          <label htmlFor="nombre">
            Nombre
          </label>

          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(event) =>
              setNombre(event.target.value)
            }
            placeholder="Ej. Electrónica"
          />
        </div>

        <div>
          <label htmlFor="descripcion">
            Descripción
          </label>

          <input
            id="descripcion"
            type="text"
            value={descripcion}
            onChange={(event) =>
              setDescripcion(event.target.value)
            }
            placeholder="Descripción de la categoría"
          />
        </div>

        <button type="submit">
          {categoriaEditando
            ? "Guardar cambios"
            : "Agregar categoría"}
        </button>

        {categoriaEditando && (
          <button
            type="button"
            onClick={limpiarFormulario}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* ERRORES */}

      {error && (
        <p>
          {error}
        </p>
      )}

      <hr />

      {/* CARGANDO */}

      {cargando ? (
        <p>Cargando categorías...</p>
      ) : categorias.length === 0 ? (
        <p>
          No hay categorías registradas.
        </p>
      ) : (
        // TABLA

        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>
                  {categoria.nombre}
                </td>

                <td>
                  {categoria.descripcion ||
                    "Sin descripción"}
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() =>
                      seleccionarCategoria(
                        categoria
                      )
                    }
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      manejarEliminarCategoria(
                        categoria.id
                      )
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