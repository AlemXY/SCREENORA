import { useReducer, useRef, type FormEvent } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ==========================================
// TIPOS
// ==========================================

type Contenido = {
  _id?: string;
  id?: number | string;
  titulo: string;
  tipo: string;
  genero: string;
  año: number;
  duracion_minutos: number;
  clasificacion: string;
  puntuacion: string | number;
};

type DatosContenido = {
  titulo: string;
  tipo: string;
  genero: string;
  año: number;
  duracion_minutos: number;
  clasificacion: string;
  puntuacion: number;
};

type CamposFormulario = {
  titulo: string;
  tipo: string;
  genero: string;
  año: string;
  duracion_minutos: string;
  clasificacion: string;
  puntuacion: string;
};

type EstadoFormulario = {
  abierto: boolean;
  editandoId: string | null;
  campos: CamposFormulario;
  error: string;
  mensaje: string;
  errorGeneral: string;
};

type AccionFormulario =
  | { type: "CREAR" }
  | { type: "EDITAR"; contenido: Contenido }
  | {
      type: "CAMBIAR_CAMPO";
      campo: keyof CamposFormulario;
      valor: string;
    }
  | { type: "ERROR"; mensaje: string }
  | { type: "GUARDADO"; mensaje: string }
  | { type: "ELIMINADO"; mensaje: string }
  | { type: "ERROR_ELIMINAR"; mensaje: string }
  | { type: "CERRAR" };

type EstadoSesion = {
  abierto: boolean;
  correo: string;
  password: string;
  token: string | null;
  administrador: string;
  error: string;
};

type AccionSesion =
  | { type: "ABRIR" }
  | { type: "CERRAR" }
  | { type: "CORREO"; valor: string }
  | { type: "PASSWORD"; valor: string }
  | {
      type: "ENTRAR";
      token: string;
      correo: string;
    }
  | { type: "ERROR"; mensaje: string }
  | { type: "SALIR" };

type RespuestaLogin = {
  token: string;
  administrador: {
    correo: string;
  };
};

// ==========================================
// CONFIGURACIÓN DE API
// ==========================================

const modoDesarrollo = import.meta.env.DEV;

const API_BASE = modoDesarrollo
  ? "http://localhost:3000"
  : "https://screenora-backend.onrender.com";

const API_CONTENIDOS = `${API_BASE}/api/contenidos`;

// ==========================================
// ESTADO DEL FORMULARIO
// ==========================================

const camposIniciales: CamposFormulario = {
  titulo: "",
  tipo: "Película",
  genero: "",
  año: "",
  duracion_minutos: "",
  clasificacion: "",
  puntuacion: "",
};

const estadoFormularioInicial: EstadoFormulario = {
  abierto: false,
  editandoId: null,
  campos: camposIniciales,
  error: "",
  mensaje: "",
  errorGeneral: "",
};

const reducerFormulario = (
  estado: EstadoFormulario,
  accion: AccionFormulario,
): EstadoFormulario => {
  switch (accion.type) {
    case "CREAR":
      return {
        ...estadoFormularioInicial,
        abierto: true,
        campos: { ...camposIniciales },
      };

    case "EDITAR":
      return {
        ...estadoFormularioInicial,
        abierto: true,
        editandoId: accion.contenido._id ?? null,
        campos: {
          titulo: accion.contenido.titulo,
          tipo: accion.contenido.tipo,
          genero: accion.contenido.genero,
          año: String(accion.contenido.año),
          duracion_minutos: String(accion.contenido.duracion_minutos),
          clasificacion: accion.contenido.clasificacion,
          puntuacion: String(accion.contenido.puntuacion),
        },
      };

    case "CAMBIAR_CAMPO":
      return {
        ...estado,
        error: "",
        campos: {
          ...estado.campos,
          [accion.campo]: accion.valor,
        },
      };

    case "ERROR":
      return {
        ...estado,
        error: accion.mensaje,
      };

    case "GUARDADO":
    case "ELIMINADO":
      return {
        ...estadoFormularioInicial,
        mensaje: accion.mensaje,
      };

    case "ERROR_ELIMINAR":
      return {
        ...estado,
        mensaje: "",
        errorGeneral: accion.mensaje,
      };

    case "CERRAR":
      return {
        ...estadoFormularioInicial,
      };

    default:
      return estado;
  }
};

// ==========================================
// ESTADO DEL ADMINISTRADOR
// ==========================================

const estadoSesionInicial: EstadoSesion = {
  abierto: false,
  correo: "",
  password: "",
  token: null,
  administrador: "",
  error: "",
};

const reducerSesion = (
  estado: EstadoSesion,
  accion: AccionSesion,
): EstadoSesion => {
  switch (accion.type) {
    case "ABRIR":
      return {
        ...estado,
        abierto: true,
        error: "",
      };

    case "CERRAR":
      return {
        ...estadoSesionInicial,
      };

    case "CORREO":
      return {
        ...estado,
        correo: accion.valor,
        error: "",
      };

    case "PASSWORD":
      return {
        ...estado,
        password: accion.valor,
        error: "",
      };

    case "ENTRAR":
      return {
        ...estadoSesionInicial,
        token: accion.token,
        administrador: accion.correo,
      };

    case "ERROR":
      return {
        ...estado,
        error: accion.mensaje,
      };

    case "SALIR":
      return {
        ...estadoSesionInicial,
      };

    default:
      return estado;
  }
};

// ==========================================
// FUNCIONES AUXILIARES DE API
// ==========================================

const esObjetoJSON = (valor: unknown): valor is Record<string, unknown> => {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
};

const obtenerMensajeError = async (respuesta: Response): Promise<string> => {
  const resultado: unknown = await respuesta.json().catch(() => null);

  if (esObjetoJSON(resultado) && typeof resultado.error === "string") {
    return resultado.error;
  }

  return `Error del servidor (${respuesta.status})`;
};

// ==========================================
// LOGIN
// ==========================================

const iniciarSesion = async ({
  correo,
  password,
}: {
  correo: string;
  password: string;
}): Promise<RespuestaLogin> => {
  const respuesta = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      correo,
      password,
    }),
  });

  if (!respuesta.ok) {
    throw new Error(await obtenerMensajeError(respuesta));
  }

  const resultado: unknown = await respuesta.json();

  if (
    !esObjetoJSON(resultado) ||
    typeof resultado.token !== "string" ||
    !esObjetoJSON(resultado.administrador) ||
    typeof resultado.administrador.correo !== "string"
  ) {
    throw new Error("La respuesta de autenticación no es válida.");
  }

  return {
    token: resultado.token,
    administrador: {
      correo: resultado.administrador.correo,
    },
  };
};

// ==========================================
// READ
// ==========================================

const obtenerContenidos = async (): Promise<Contenido[]> => {
  const respuesta = await fetch(API_CONTENIDOS);

  if (!respuesta.ok) {
    throw new Error(await obtenerMensajeError(respuesta));
  }

  const datos: unknown = await respuesta.json();

  if (!Array.isArray(datos)) {
    throw new Error("La API no devolvió una lista válida.");
  }

  return datos as Contenido[];
};

// ==========================================
// CREATE / UPDATE
// ==========================================

const guardarContenido = async ({
  id,
  datos,
  token,
}: {
  id: string | null;
  datos: DatosContenido;
  token: string;
}): Promise<void> => {
  const url = id
    ? `${API_CONTENIDOS}/${encodeURIComponent(id)}`
    : API_CONTENIDOS;

  const respuesta = await fetch(url, {
    method: id ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });

  if (respuesta.status === 401) {
    throw new Error(
      "Tu sesión expiró o es inválida. Cierra sesión e inicia nuevamente.",
    );
  }

  if (!respuesta.ok) {
    throw new Error(await obtenerMensajeError(respuesta));
  }
};

// ==========================================
// DELETE
// ==========================================

const eliminarContenido = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}): Promise<void> => {
  const respuesta = await fetch(`${API_CONTENIDOS}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (respuesta.status === 401) {
    throw new Error(
      "Tu sesión expiró o es inválida. Cierra sesión e inicia nuevamente.",
    );
  }

  if (!respuesta.ok) {
    throw new Error(await obtenerMensajeError(respuesta));
  }
};

// ==========================================
// VALIDACIONES
// ==========================================

const validarFormulario = (campos: CamposFormulario): string | null => {
  if (campos.titulo.trim().length < 2) {
    return "El título debe tener al menos 2 caracteres.";
  }

  if (campos.tipo !== "Película" && campos.tipo !== "Serie") {
    return "Selecciona un tipo válido.";
  }

  if (!campos.genero.trim()) {
    return "El género es obligatorio.";
  }

  const año = Number(campos.año);

  if (
    !campos.año.trim() ||
    !Number.isInteger(año) ||
    año < 1888 ||
    año > 2100
  ) {
    return "Ingresa un año válido entre 1888 y 2100.";
  }

  const duracion = Number(campos.duracion_minutos);

  if (
    !campos.duracion_minutos.trim() ||
    !Number.isInteger(duracion) ||
    duracion < 1
  ) {
    return "La duración debe ser un número entero mayor que cero.";
  }

  if (!campos.clasificacion.trim()) {
    return "La clasificación es obligatoria.";
  }

  const puntuacion = Number(campos.puntuacion);

  if (
    !campos.puntuacion.trim() ||
    !Number.isFinite(puntuacion) ||
    puntuacion < 0 ||
    puntuacion > 10
  ) {
    return "La puntuación debe estar entre 0 y 10.";
  }

  return null;
};

// ==========================================
// CONFIGURACIÓN DE CAMPOS
// ==========================================

type ConfiguracionCampo = {
  nombre: keyof CamposFormulario;
  etiqueta: string;
  tipo: "text" | "number";
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
};

const camposConfigurados: ConfiguracionCampo[] = [
  {
    nombre: "titulo",
    etiqueta: "Título",
    tipo: "text",
    placeholder: "Nombre de la película o serie",
    maxLength: 150,
  },
  {
    nombre: "genero",
    etiqueta: "Género",
    tipo: "text",
    placeholder: "Drama · Acción",
  },
  {
    nombre: "año",
    etiqueta: "Año",
    tipo: "number",
    min: 1888,
    max: 2100,
    step: 1,
  },
  {
    nombre: "duracion_minutos",
    etiqueta: "Duración (minutos)",
    tipo: "number",
    min: 1,
    step: 1,
  },
  {
    nombre: "clasificacion",
    etiqueta: "Clasificación",
    tipo: "text",
    placeholder: "PG, R, TV-MA...",
  },
  {
    nombre: "puntuacion",
    etiqueta: "Puntuación",
    tipo: "number",
    min: 0,
    max: 10,
    step: 0.1,
  },
];

// ==========================================
// ICONOS Y UTILIDADES VISUALES
// ==========================================

const StarIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-yellow-400 text-yellow-400">
    <path d="m12 2.5 2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.31l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94L12 2.5Z" />
  </svg>
);

const obtenerIdVisible = (contenido: Contenido): string => {
  if (contenido._id) {
    return contenido._id.slice(-6).toUpperCase();
  }

  return String(contenido.id ?? "—").padStart(2, "0");
};

const esPelicula = (tipo: string): boolean => {
  return (
    tipo
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase() === "pelicula"
  );
};

const EtiquetaTipo = ({ tipo }: { tipo: string }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
      esPelicula(tipo)
        ? "bg-screenora-purple/15 text-screenora-violet"
        : "bg-cyan-400/10 text-cyan-300"
    }`}
  >
    {tipo}
  </span>
);

const Puntuacion = ({ valor }: { valor: string | number }) => (
  <div className="flex items-center gap-2">
    <StarIcon />
    <span className="text-sm font-bold text-white">
      {Number(valor).toFixed(1)}
    </span>
  </div>
);

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

const Catalogo = () => {
  const queryClient = useQueryClient();

  const [formulario, dispatchFormulario] = useReducer(
    reducerFormulario,
    estadoFormularioInicial,
  );

  const [sesion, dispatchSesion] = useReducer(
    reducerSesion,
    estadoSesionInicial,
  );

  const formularioRef = useRef<HTMLDivElement>(null);

  const autenticado = sesion.token !== null;

  // CONSULTAR
  const {
    data: contenidos = [],
    isPending: cargando,
    isError,
    error,
  } = useQuery<Contenido[], Error>({
    queryKey: ["contenidos"],
    queryFn: obtenerContenidos,
    staleTime: 60_000,
    retry: 1,
  });

  // LOGIN
  const mutacionLogin = useMutation({
    mutationFn: iniciarSesion,
  });

  // REGISTRAR / EDITAR
  const mutacionGuardar = useMutation({
    mutationFn: guardarContenido,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["contenidos"],
      });
    },
  });

  // ELIMINAR
  const mutacionEliminar = useMutation({
    mutationFn: eliminarContenido,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["contenidos"],
      });
    },
  });

  const guardando = mutacionGuardar.isPending;
  const eliminando = mutacionEliminar.isPending;
  const ocupado = guardando || eliminando;

  // ======================================
  // ACCIONES DE AUTENTICACIÓN
  // ======================================

  const enviarLogin = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (mutacionLogin.isPending) {
      return;
    }
    const correo = sesion.correo.trim().toLowerCase();
    const password = sesion.password;

    if (!correo || !password) {
      dispatchSesion({
        type: "ERROR",
        mensaje: "Ingresa tu correo y contraseña.",
      });

      return;
    }

    try {
      const resultado = await mutacionLogin.mutateAsync({
        correo,
        password,
      });

      dispatchSesion({
        type: "ENTRAR",
        token: resultado.token,
        correo: resultado.administrador.correo,
      });
    } catch (error) {
      dispatchSesion({
        type: "ERROR",
        mensaje:
          error instanceof Error ? error.message : "No se pudo iniciar sesión.",
      });
    }
  };

  const cerrarSesion = () => {
    if (ocupado) return;

    dispatchSesion({ type: "SALIR" });
    dispatchFormulario({ type: "CERRAR" });
  };

  // ======================================
  // ACCIONES DEL FORMULARIO
  // ======================================

  const desplazarAlFormulario = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        formularioRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    });
  };

  const abrirCrear = () => {
    if (!autenticado || ocupado) return;

    dispatchFormulario({ type: "CREAR" });
    desplazarAlFormulario();
  };

  const abrirEditar = (contenido: Contenido) => {
    if (!autenticado || ocupado || !contenido._id) {
      return;
    }

    dispatchFormulario({
      type: "EDITAR",
      contenido,
    });

    desplazarAlFormulario();
  };

  const cambiarCampo = (campo: keyof CamposFormulario, valor: string) => {
    dispatchFormulario({
      type: "CAMBIAR_CAMPO",
      campo,
      valor,
    });
  };

  const enviarFormulario = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (!autenticado || !sesion.token || ocupado) {
      return;
    }

    const campos = formulario.campos;
    const mensajeError = validarFormulario(campos);

    if (mensajeError) {
      dispatchFormulario({
        type: "ERROR",
        mensaje: mensajeError,
      });

      return;
    }

    const datos: DatosContenido = {
      titulo: campos.titulo.trim(),
      tipo: campos.tipo,
      genero: campos.genero.trim(),
      año: Number(campos.año),
      duracion_minutos: Number(campos.duracion_minutos),
      clasificacion: campos.clasificacion.trim(),
      puntuacion: Number(campos.puntuacion),
    };

    try {
      await mutacionGuardar.mutateAsync({
        id: formulario.editandoId,
        datos,
        token: sesion.token,
      });

      dispatchFormulario({
        type: "GUARDADO",
        mensaje: formulario.editandoId
          ? "Contenido actualizado correctamente."
          : "Contenido registrado correctamente.",
      });
    } catch (error) {
      dispatchFormulario({
        type: "ERROR",
        mensaje:
          error instanceof Error
            ? error.message
            : "No se pudo guardar el contenido.",
      });
    }
  };

  // ======================================
  // ACCIÓN DE ELIMINACIÓN
  // ======================================

  const confirmarEliminacion = async (contenido: Contenido) => {
    if (!autenticado || !sesion.token || ocupado || !contenido._id) {
      return;
    }

    const confirmado = window.confirm(
      `¿Seguro que deseas eliminar "${contenido.titulo}"?\n\nEsta acción no se puede deshacer.`,
    );

    if (!confirmado) return;

    try {
      await mutacionEliminar.mutateAsync({
        id: contenido._id,
        token: sesion.token,
      });

      dispatchFormulario({
        type: "ELIMINADO",
        mensaje: `"${contenido.titulo}" se eliminó correctamente.`,
      });
    } catch (error) {
      dispatchFormulario({
        type: "ERROR_ELIMINAR",
        mensaje:
          error instanceof Error
            ? error.message
            : "No se pudo eliminar el contenido.",
      });
    }
  };

  // ======================================
  // INTERFAZ
  // ======================================

  return (
    <section
      id="catalogo"
      className="bg-screenora-bg px-6 py-20 lg:px-10 xl:px-12"
    >
      <div className="mx-auto max-w-375">
        {/* ENCABEZADO */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-screenora-violet">
              Explora nuestro contenido
            </p>

            <h2 className="text-3xl font-extrabold text-white md:text-4xl">
              Catálogo de Screenora
            </h2>

            <p className="mt-4 max-w-2xl text-[16px] leading-7 text-white/60">
              Descubre las películas y series disponibles en nuestra plataforma,
              junto con su información principal.
            </p>
          </div>

          {/* CONTROLES DE ADMINISTRACIÓN */}
          {
            <div className="flex flex-wrap items-center gap-3">
              {autenticado ? (
                <>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-bold text-green-300">
                      Administrador conectado
                    </span>

                    <span className="max-w-55 truncate text-xs text-white/50">
                      {sesion.administrador}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={abrirCrear}
                    disabled={ocupado}
                    className="cursor-pointer rounded-xl bg-linear-to-r from-screenora-purple to-screenora-violet px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    + Agregar contenido
                  </button>

                  <button
                    type="button"
                    onClick={cerrarSesion}
                    disabled={ocupado}
                    className="cursor-pointer rounded-xl border border-white/20 px-4 py-3 text-sm font-bold text-white/75 transition-colors hover:bg-white/10 disabled:opacity-50"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => dispatchSesion({ type: "ABRIR" })}
                  className="cursor-pointer rounded-xl border border-screenora-violet/40 px-5 py-3 text-sm font-bold text-screenora-violet transition-colors hover:bg-screenora-violet/10"
                >
                  Acceso administrador
                </button>
              )}
            </div>
          }
        </div>

        {/* INICIO DE SESIÓN */}
        {!autenticado && sesion.abierto && (
          <div className="mb-8 rounded-2xl border border-screenora-violet/30 bg-[#11152e] p-5 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-screenora-violet">
                  Administración
                </p>

                <h3 className="text-xl font-extrabold text-white sm:text-2xl">
                  Iniciar sesión
                </h3>

                <p className="mt-2 text-sm text-white/50">
                  Ingresa con tu cuenta de administrador de SCREENORA.
                </p>
              </div>

              <button
                type="button"
                aria-label="Cerrar inicio de sesión"
                disabled={mutacionLogin.isPending}
                onClick={() => dispatchSesion({ type: "CERRAR" })}
                className="cursor-pointer rounded-lg px-3 py-1 text-2xl text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={enviarLogin} className="max-w-xl">
              <div className="grid gap-5">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="admin-correo"
                    className="text-sm font-semibold text-white/80"
                  >
                    Correo electrónico
                  </label>

                  <input
                    id="admin-correo"
                    type="email"
                    autoComplete="username"
                    required
                    value={sesion.correo}
                    disabled={mutacionLogin.isPending}
                    onChange={(evento) =>
                      dispatchSesion({
                        type: "CORREO",
                        valor: evento.target.value,
                      })
                    }
                    placeholder="correo@ejemplo.com"
                    className="h-12 w-full rounded-xl border border-white/15 bg-[#1d2142] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-screenora-violet disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="admin-password"
                    className="text-sm font-semibold text-white/80"
                  >
                    Contraseña
                  </label>

                  <input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={sesion.password}
                    disabled={mutacionLogin.isPending}
                    onChange={(evento) =>
                      dispatchSesion({
                        type: "PASSWORD",
                        valor: evento.target.value,
                      })
                    }
                    placeholder="Tu contraseña"
                    className="h-12 w-full rounded-xl border border-white/15 bg-[#1d2142] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-screenora-violet disabled:opacity-50"
                  />
                </div>
              </div>

              {sesion.error && (
                <p
                  role="alert"
                  className="mt-5 rounded-lg border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300"
                >
                  {sesion.error}
                </p>
              )}

              <div className="mt-7">
                <button
                  type="submit"
                  disabled={mutacionLogin.isPending}
                  className="cursor-pointer rounded-xl bg-linear-to-r from-screenora-purple to-screenora-violet px-7 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {mutacionLogin.isPending
                    ? "Verificando..."
                    : "Iniciar sesión"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MENSAJES */}
        {formulario.mensaje && (
          <p
            role="status"
            className="mb-6 rounded-xl border border-green-400/20 bg-green-400/10 px-5 py-4 text-sm font-semibold text-green-300"
          >
            {formulario.mensaje}
          </p>
        )}

        {formulario.errorGeneral && (
          <p
            role="alert"
            className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm font-semibold text-red-300"
          >
            {formulario.errorGeneral}
          </p>
        )}

        {/* FORMULARIO PARA CREAR / EDITAR */}
        {autenticado && formulario.abierto && (
          <div
            ref={formularioRef}
            className="mb-8 rounded-2xl border border-screenora-violet/30 bg-[#11152e] p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-screenora-violet">
                  Administración de contenidos
                </p>

                <h3 className="text-xl font-extrabold text-white sm:text-2xl">
                  {formulario.editandoId
                    ? "Editar contenido"
                    : "Registrar contenido"}
                </h3>
              </div>

              <button
                type="button"
                aria-label="Cerrar formulario"
                disabled={ocupado}
                onClick={() => dispatchFormulario({ type: "CERRAR" })}
                className="cursor-pointer rounded-lg px-3 py-1 text-2xl text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={enviarFormulario}>
              <div className="grid gap-5 sm:grid-cols-2">
                {/* TIPO */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contenido-tipo"
                    className="text-sm font-semibold text-white/80"
                  >
                    Tipo
                  </label>

                  <select
                    id="contenido-tipo"
                    required
                    disabled={ocupado}
                    value={formulario.campos.tipo}
                    onChange={(evento) =>
                      cambiarCampo("tipo", evento.target.value)
                    }
                    className="h-12 rounded-xl border border-white/15 bg-[#1d2142] px-4 text-sm text-white outline-none transition-colors focus:border-screenora-violet disabled:opacity-50"
                  >
                    <option value="Película">Película</option>

                    <option value="Serie">Serie</option>
                  </select>
                </div>

                {/* RESTO DE CAMPOS */}
                {camposConfigurados.map((campo) => (
                  <div key={campo.nombre} className="flex flex-col gap-2">
                    <label
                      htmlFor={`contenido-${campo.nombre}`}
                      className="text-sm font-semibold text-white/80"
                    >
                      {campo.etiqueta}
                    </label>

                    <input
                      id={`contenido-${campo.nombre}`}
                      type={campo.tipo}
                      required
                      disabled={ocupado}
                      value={formulario.campos[campo.nombre]}
                      onChange={(evento) =>
                        cambiarCampo(campo.nombre, evento.target.value)
                      }
                      placeholder={campo.placeholder}
                      min={campo.min}
                      max={campo.max}
                      step={campo.step}
                      maxLength={campo.maxLength}
                      className="h-12 w-full rounded-xl border border-white/15 bg-[#1d2142] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-screenora-violet disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>

              {formulario.error && (
                <p
                  role="alert"
                  className="mt-5 rounded-lg border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300"
                >
                  {formulario.error}
                </p>
              )}

              <div className="mt-8 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  disabled={ocupado}
                  onClick={() => dispatchFormulario({ type: "CERRAR" })}
                  className="cursor-pointer rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={ocupado}
                  className="cursor-pointer rounded-xl bg-linear-to-r from-screenora-purple to-screenora-violet px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {guardando
                    ? "Guardando..."
                    : formulario.editandoId
                      ? "Guardar cambios"
                      : "Registrar contenido"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CATÁLOGO */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#11152e] shadow-2xl">
          {cargando && (
            <div className="flex min-h-75 items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/15 border-t-screenora-violet" />
                <p className="text-sm font-semibold text-white/60">
                  Cargando catálogo...
                </p>
              </div>
            </div>
          )}

          {isError && (
            <div className="flex min-h-75 flex-col items-center justify-center gap-3 px-6 text-center">
              <p className="text-base font-semibold text-red-400">
                No se pudo cargar el catálogo de Screenora.
              </p>

              {modoDesarrollo && (
                <p className="text-sm text-white/45">{error.message}</p>
              )}
            </div>
          )}

          {!cargando && !isError && contenidos.length === 0 && (
            <div className="flex min-h-75 items-center justify-center px-6 text-center">
              <p className="text-sm font-semibold text-white/60">
                Todavía no hay contenidos registrados.
              </p>
            </div>
          )}

          {!cargando && !isError && contenidos.length > 0 && (
            <>
              {/* VISTA MÓVIL */}
              <div className="grid gap-4 p-4 md:hidden">
                {contenidos.map((contenido, indice) => (
                  <article
                    key={contenido._id ?? String(contenido.id ?? indice)}
                    className="rounded-xl border border-white/10 bg-white/3 p-5 transition-colors duration-300 hover:bg-white/5"
                  >
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <span className="text-sm font-bold text-white/35">
                        {obtenerIdVisible(contenido)}
                      </span>

                      <EtiquetaTipo tipo={contenido.tipo} />
                    </div>

                    <h3 className="text-lg font-extrabold text-white">
                      {contenido.titulo}
                    </h3>

                    <p className="mt-1 text-sm text-white/55">
                      {contenido.genero}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-white/30">
                          Año
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white/75">
                          {contenido.año}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-white/30">
                          Duración
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white/75">
                          {contenido.duracion_minutos} min
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-white/30">
                          Clasificación
                        </p>
                        <span className="mt-2 inline-flex rounded-md border border-white/15 px-2.5 py-1 text-xs font-bold text-white/75">
                          {contenido.clasificacion}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-white/30">
                          Puntuación
                        </p>

                        <div className="mt-2">
                          <Puntuacion valor={contenido.puntuacion} />
                        </div>
                      </div>
                    </div>

                    {autenticado && contenido._id && (
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={ocupado}
                          onClick={() => abrirEditar(contenido)}
                          className="cursor-pointer rounded-lg border border-screenora-violet/40 px-4 py-2 text-sm font-bold text-screenora-violet transition-colors hover:bg-screenora-violet/10 disabled:opacity-50"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          disabled={ocupado}
                          onClick={() => void confirmarEliminacion(contenido)}
                          className="cursor-pointer rounded-lg border border-red-400/40 px-4 py-2 text-sm font-bold text-red-300 transition-colors hover:bg-red-400/10 disabled:opacity-50"
                        >
                          {eliminando &&
                          mutacionEliminar.variables?.id === contenido._id
                            ? "Eliminando..."
                            : "Eliminar"}
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>

              {/* VISTA ESCRITORIO */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-262.5 border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/4">
                      {[
                        "ID",
                        "Título",
                        "Tipo",
                        "Género",
                        "Año",
                        "Duración",
                        "Clasificación",
                        "Puntuación",
                      ].map((columna) => (
                        <th
                          key={columna}
                          className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-white/45"
                        >
                          {columna}
                        </th>
                      ))}

                      {autenticado && (
                        <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-white/45">
                          Acciones
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {contenidos.map((contenido, indice) => (
                      <tr
                        key={contenido._id ?? String(contenido.id ?? indice)}
                        className="border-b border-white/6 transition-colors duration-300 last:border-b-0 hover:bg-white/4"
                      >
                        <td className="px-6 py-5 text-sm font-semibold text-white/35">
                          {obtenerIdVisible(contenido)}
                        </td>

                        <td className="px-6 py-5">
                          <span className="text-[15px] font-bold text-white">
                            {contenido.titulo}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <EtiquetaTipo tipo={contenido.tipo} />
                        </td>

                        <td className="px-6 py-5 text-sm text-white/60">
                          {contenido.genero}
                        </td>

                        <td className="px-6 py-5 text-sm text-white/60">
                          {contenido.año}
                        </td>

                        <td className="px-6 py-5 text-sm text-white/60">
                          {contenido.duracion_minutos} min
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-md border border-white/15 px-2.5 py-1 text-xs font-bold text-white/75">
                            {contenido.clasificacion}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <Puntuacion valor={contenido.puntuacion} />
                        </td>

                        {autenticado && (
                          <td className="px-6 py-5">
                            {contenido._id && (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={ocupado}
                                  onClick={() => abrirEditar(contenido)}
                                  className="cursor-pointer rounded-lg border border-screenora-violet/40 px-4 py-2 text-sm font-bold text-screenora-violet transition-colors hover:bg-screenora-violet/10 disabled:opacity-50"
                                >
                                  Editar
                                </button>

                                <button
                                  type="button"
                                  disabled={ocupado}
                                  onClick={() =>
                                    void confirmarEliminacion(contenido)
                                  }
                                  className="cursor-pointer rounded-lg border border-red-400/40 px-4 py-2 text-sm font-bold text-red-300 transition-colors hover:bg-red-400/10 disabled:opacity-50"
                                >
                                  {eliminando &&
                                  mutacionEliminar.variables?.id ===
                                    contenido._id
                                    ? "Eliminando..."
                                    : "Eliminar"}
                                </button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Catalogo;
