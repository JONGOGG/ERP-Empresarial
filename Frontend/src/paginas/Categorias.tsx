import { useState } from "react";

type Categoria = {
  id: number;
  nombre: string;
  descripcion: string;
};

export function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const agregarCategoria = (event: React.FormEvent) => {
    event.preventDefault();

    if (!nombre.trim()) return;

    const nuevaCategoria: Categoria = {
      id: Date.now(),
      nombre,
      descripcion,
    };

    setCategorias([...categorias, nuevaCategoria]);

    setNombre("");
    setDescripcion("");
  };

  const eliminarCategoria = (id: number) => {
    setCategorias(categorias.filter((categoria) => categoria.id !== id));
  };

  return (
    <section>
      <h1>Categorías</h1>
      <p>Administra las categorías de productos.</p>

      <form onSubmit={agregarCategoria}>
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

        <button type="submit">Agregar categoría</button>
      </form>

      <hr />

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
                <button onClick={() => eliminarCategoria(categoria.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}