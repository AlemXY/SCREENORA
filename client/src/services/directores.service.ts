import { CONFIG } from "../config";
import type { Director, RespuestaDirectores } from "../types/Director";

const API_URL = CONFIG.API_URL + CONFIG.ENDPOINTS.DIRECTORES;

export const fetchDirectores = async (
  signal?: AbortSignal,
): Promise<Director[]> => {
  const response = await fetch(API_URL, { signal });

  const jsonData: RespuestaDirectores = await response.json();

  if (!response.ok) {
    throw new Error(
      `Error al obtener directores: ${response.status} ${response.statusText}`,
    );
  }

  return jsonData.data;
};
