import { useEffect, useState } from "react";
import type { Categoria } from "../tipos/Categoria";

import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../servicios/categoriasServicio";

export function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(
    null,
  );

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        setError("");

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

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setCategoriaEditando(null);
  };

  const guardarCategoria = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      setError("");

      if (categoriaEditando) {
        const categoriaActualizada = await actualizarCategoria(
          categoriaEditando.id,
          {
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
          },
        );

        setCategorias((categoriasActuales) =>
          categoriasActuales.map((categoria) =>
            categoria.id === categoriaActualizada.id
              ? categoriaActualizada
              : categoria,
          ),
        );
      } else {
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

      setError("Ocurrió un error al guardar la categoría");
    }
  };

  const seleccionarCategoria = (categoria: Categoria) => {
    setCategoriaEditando(categoria);

    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion ?? "");

    setError("");
  };

  const manejarEliminarCategoria = async (id: number) => {
    try {
      setError("");

      await eliminarCategoria(id);

      setCategorias((categoriasActuales) =>
        categoriasActuales.filter((categoria) => categoria.id !== id),
      );

      if (categoriaEditando?.id === id) {
        limpiarFormulario();
      }
    } catch (error) {
      console.error(error);

      setError("No se pudo eliminar la categoría");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>

        <p className="mt-1 text-muted-foreground">
          Administra las categorías de productos.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
          <p className="text-sm font-medium text-danger">{error}</p>
        </div>
      )}

      <section className="rounded-xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">
            {categoriaEditando ? "Editar categoría" : "Nueva categoría"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {categoriaEditando
              ? "Modifica los datos de la categoría seleccionada."
              : "Registra una nueva categoría para tus productos."}
          </p>
        </div>

        <form onSubmit={guardarCategoria} className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="nombre" className={labelClass}>
                Nombre
              </label>

              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                placeholder="Ej. Electrónica"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="descripcion" className={labelClass}>
                Descripción
              </label>

              <input
                id="descripcion"
                type="text"
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)}
                placeholder="Descripción de la categoría"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {categoriaEditando ? "Guardar cambios" : "Agregar categoría"}
            </button>

            {categoriaEditando && (
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

      <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Categorías registradas</h2>

            <p className="text-sm text-muted-foreground">
              {categorias.length} categorías
            </p>
          </div>
        </div>

        {cargando ? (
          <div className="p-8 text-center text-muted-foreground">
            Cargando categorías...
          </div>
        ) : categorias.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No hay categorías registradas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 font-medium">Nombre</th>

                  <th className="px-6 py-3 font-medium">Descripción</th>

                  <th className="px-6 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {categorias.map((categoria) => (
                  <tr
                    key={categoria.id}
                    className="border-t border-border transition hover:bg-muted/50"
                  >
                    <td className="px-6 py-4 font-medium">
                      {categoria.nombre}
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {categoria.descripcion || "Sin descripción"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => seleccionarCategoria(categoria)}
                          className="rounded-lg border border-border px-3 py-2 text-xs font-medium transition hover:bg-muted"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => manejarEliminarCategoria(categoria.id)}
                          className="rounded-lg px-3 py-2 text-xs font-medium text-danger transition hover:bg-danger/10"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
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
