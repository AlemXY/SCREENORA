import { useQuery } from "@tanstack/react-query";
import { fetchProductos } from "../../../services/productos.service";

export const useProductos = (idCategoria: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["productos", idCategoria],
    queryFn: ({ signal }) => fetchProductos(idCategoria, signal),
    enabled: Boolean(idCategoria),
  });

  const productos = Array.isArray(data) ? data : [];
  const hasProductos = productos.length > 0;

  return {
    productos,
    cargando: isLoading,
    error: error ? error.message : null,
    hasProductos,
    refetch,
  };
};
