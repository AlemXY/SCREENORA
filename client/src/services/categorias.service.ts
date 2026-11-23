import { CONFIG } from "../config";
import type { Categoria, RespuestaCategorias } from "../types/Categoria";

const API_URL = CONFIG.API_URL + CONFIG.ENDPOINTS.CATEGORIAS;

export const fetchCategorias = async (
  signal?: AbortSignal,
): Promise<Categoria[]> => {
  const response = await fetch(API_URL, { signal });

  const jsonData: RespuestaCategorias = await response.json();

  if (!response.ok) {
    throw new Error(
      `Error al obtener categorías: ${response.status} ${response.statusText}`,
    );
  }

  return jsonData.data;
};
