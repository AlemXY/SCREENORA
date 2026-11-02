const API_BASE = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://screenora-backend.onrender.com";

// ==========================================
// TIPOS
// ==========================================

export type Usuario = {
  id: string;
  nombre: string;
  correo: string;
};

export type DatosRegistro = {
  nombre: string;
  correo: string;
  password: string;
};

export type DatosLogin = {
  correo: string;
  password: string;
};

export type RespuestaRegistro = {
  mensaje: string;
  usuario: Usuario;
};

export type RespuestaLoginUsuario = {
  mensaje: string;
  token: string;
  tipo: string;
  expiraEn: string;
  usuario: Usuario;
};

export type RespuestaSesionUsuario = {
  autenticado: boolean;
  rol: string;
  usuario: Usuario;
};

// ==========================================
// MANEJO DE ERRORES
// ==========================================

const obtenerMensajeError = async (respuesta: Response): Promise<string> => {
  const datos: unknown = await respuesta.json().catch(() => null);

  if (
    typeof datos === "object" &&
    datos !== null &&
    "error" in datos &&
    typeof datos.error === "string"
  ) {
    return datos.error;
  }

  return `Error del servidor (${respuesta.status})`;
};

// ==========================================
// REGISTRAR USUARIO
// ==========================================

export const registrarUsuario = async (
  datos: DatosRegistro,
): Promise<RespuestaRegistro> => {
  const respuesta = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error(await obtenerMensajeError(respuesta));
  }

  return (await respuesta.json()) as RespuestaRegistro;
};

// ==========================================
// INICIAR SESIÓN
// ==========================================

export const iniciarSesionUsuario = async (
  datos: DatosLogin,
): Promise<RespuestaLoginUsuario> => {
  const respuesta = await fetch(`${API_BASE}/api/auth/login-usuario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error(await obtenerMensajeError(respuesta));
  }

  return (await respuesta.json()) as RespuestaLoginUsuario;
};

// ==========================================
// VERIFICAR SESIÓN
// ==========================================

export const verificarSesionUsuario = async (
  token: string,
): Promise<RespuestaSesionUsuario> => {
  const respuesta = await fetch(`${API_BASE}/api/auth/me-usuario`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!respuesta.ok) {
    throw new Error(await obtenerMensajeError(respuesta));
  }

  return (await respuesta.json()) as RespuestaSesionUsuario;
};
