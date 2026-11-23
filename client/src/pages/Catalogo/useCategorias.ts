import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { fetchCategorias } from "../../services/categorias.service";

export const useCategorias = () => {
  const [idCategoriaSeleccionada, setIdCategoriaSeleccionada] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["categorias"],
    queryFn: ({ signal }) => fetchCategorias(signal),
  });

  const categorias = Array.isArray(data) ? data : [];
  const hasCategorias = categorias.length > 0;

  const categoriaSeleccionada =
    categorias.find((categoria) => categoria._id === idCategoriaSeleccionada) ??
    categorias[0] ??
    null;

  const seleccionarCategoria = useCallback((id: string) => {
    setIdCategoriaSeleccionada(id);
  }, []);

  return {
    categorias,
    cargando: isLoading,
    error: error ? error.message : null,
    hasCategorias,
    refetch,
    seleccionarCategoria,
    idCategoriaSeleccionada: categoriaSeleccionada?._id ?? "",
    nombreCategoriaSeleccionada: categoriaSeleccionada?.nombre ?? "",
    totalCategoriaSeleccionada: categoriaSeleccionada?.total ?? 0,
  };
};
