import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Categoria } from "../tipos/Categoria";
import type { Producto } from "../tipos/Productos";

interface DatosContextoTipo {
  categorias: Categoria[];
  setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;

  productos: Producto[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
}

const DatosContexto = createContext<DatosContextoTipo | undefined>(undefined);

export function DatosProvider({ children }: { children: ReactNode }) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  return (
    <DatosContexto.Provider
      value={{
        categorias,
        setCategorias,
        productos,
        setProductos,
      }}
    >
      {children}
    </DatosContexto.Provider>
  );
}

export function useDatos() {
  const contexto = useContext(DatosContexto);

  if (!contexto) {
    throw new Error("useDatos debe usarse dentro de DatosProvider");
  }

  return contexto;
}