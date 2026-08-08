import { useState } from "react";
import type { Categoria } from "../tipos/Categoria";
import { useDatos } from "../contexto/DatosContexto";

export function Categorias() {
  const { categorias, setCategorias } = useDatos();
  
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(
    null,
  );

  const guardarCategoria = (event: React.FormEvent) => {
    event.preventDefault();

    if (!nombre.trim()) return;

    if (categoriaEditando) {
      setCategorias(
        categorias.map((categoria) =>
          categoria.id === categoriaEditando.id
            ? {
                ...categoria,
                nombre,
                descripcion,
              }
            : categoria,
        ),
      );

      setCategoriaEditando(null);
    } else {
      const nuevaCategoria: Categoria = {
        id: Date.now(),
        nombre,
        descripcion,
      };

      setCategorias([...categorias, nuevaCategoria]);
    }

    setNombre("");
    setDescripcion("");
  };

  const seleccionarCategoria = (categoria: Categoria) => {
    setCategoriaEditando(categoria);
    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion);
  };

  const eliminarCategoria = (id: number) => {
    setCategorias(categorias.filter((categoria) => categoria.id !== id));

    if (categoriaEditando?.id === id) {
      setCategoriaEditando(null);
      setNombre("");
      setDescripcion("");
    }
  };

  const cancelarEdicion = () => {
    setCategoriaEditando(null);
    setNombre("");
    setDescripcion("");
  };

  return (
    <section>
      <h1>Categorías</h1>
      <p>Administra las categorías de productos.</p>

      <form onSubmit={guardarCategoria}>
        <div>
          <label htmlFor="nombre">Nombre</label>

          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            placeholder="Ej. Electrónica"
          />
        </div>

        <div>
          <label htmlFor="descripcion">Descripción</label>

          <input
            id="descripcion"
            type="text"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            placeholder="Descripción de la categoría"
          />
        </div>

        <button type="submit">
          {categoriaEditando ? "Guardar cambios" : "Agregar categoría"}
        </button>

        {categoriaEditando && (
          <button type="button" onClick={cancelarEdicion}>
            Cancelar
          </button>
        )}
      </form>

      <hr />

      {categorias.length === 0 ? (
        <p>No hay categorías registradas.</p>
      ) : (
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
                <td>{categoria.nombre}</td>
                <td>{categoria.descripcion}</td>

                <td>
                  <button onClick={() => seleccionarCategoria(categoria)}>
                    Editar
                  </button>

                  <button onClick={() => eliminarCategoria(categoria.id)}>
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
