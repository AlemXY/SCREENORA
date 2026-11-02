const API_BASE = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://screenora-api.onrender.com";

const API_MI_LISTA = `${API_BASE}/api/mi-lista`;

// ==========================================
// TIPOS
// ==========================================

export type ItemMiLista = {
  _id: string;
  titulo: string;
  tipo: "Película" | "Serie";
  estado: "Pendiente" | "Visto";
  createdAt: string;
};

export type DatosNuevoItem = {
  titulo: string;
  tipo: "Película" | "Serie";
};

type RespuestaItem = {
  mensaje: string;
  contenido: ItemMiLista;
};

// ==========================================
// ERRORES
// ==========================================

const comprobarRespuesta = async (respuesta: Response): Promise<void> => {
  if (respuesta.ok) return;

  const datos: unknown = await respuesta.json().catch(() => null);

  if (
    typeof datos === "object" &&
    datos !== null &&
    "error" in datos &&
    typeof datos.error === "string"
  ) {
    throw new Error(datos.error);
  }

  throw new Error(`Error del servidor (${respuesta.status})`);
};

// ==========================================
// GET - CONSULTAR MI LISTA
// ==========================================

export const obtenerMiLista = async (token: string): Promise<ItemMiLista[]> => {
  const respuesta = await fetch(API_MI_LISTA, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  await comprobarRespuesta(respuesta);

  const datos: unknown = await respuesta.json();

  if (!Array.isArray(datos)) {
    throw new Error("La lista recibida no es válida.");
  }

  return datos as ItemMiLista[];
};

// ==========================================
// POST - AGREGAR CONTENIDO
// ==========================================

export const agregarAMiLista = async (
  token: string,
  datos: DatosNuevoItem,
): Promise<RespuestaItem> => {
  const respuesta = await fetch(API_MI_LISTA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });

  await comprobarRespuesta(respuesta);

  return (await respuesta.json()) as RespuestaItem;
};

// ==========================================
// PUT - ACTUALIZAR ESTADO
// ==========================================

export const actualizarMiLista = async (
  token: string,
  id: string,
  estado: "Pendiente" | "Visto",
): Promise<RespuestaItem> => {
  const respuesta = await fetch(`${API_MI_LISTA}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado }),
  });

  await comprobarRespuesta(respuesta);

  return (await respuesta.json()) as RespuestaItem;
};

// ==========================================
// DELETE - ELIMINAR CONTENIDO
// ==========================================

export const eliminarDeMiLista = async (
  token: string,
  id: string,
): Promise<RespuestaItem> => {
  const respuesta = await fetch(`${API_MI_LISTA}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  await comprobarRespuesta(respuesta);

  return (await respuesta.json()) as RespuestaItem;
};
