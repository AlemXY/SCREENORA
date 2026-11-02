import { useReducer, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  obtenerMiLista,
  agregarAMiLista,
  actualizarMiLista,
  eliminarDeMiLista,
  type DatosNuevoItem,
} from "../services/miListaApi";

type Propiedades = {
  token: string;
  usuarioId: string;
};

type Estado = {
  titulo: string;
  tipo: "Película" | "Serie";
  mensaje: string;
  error: string;
};

type Accion =
  | { type: "TITULO"; valor: string }
  | { type: "TIPO"; valor: "Película" | "Serie" }
  | { type: "EXITO"; mensaje: string }
  | { type: "ERROR"; mensaje: string };

const estadoInicial: Estado = {
  titulo: "",
  tipo: "Película",
  mensaje: "",
  error: "",
};

const reducer = (estado: Estado, accion: Accion): Estado => {
  switch (accion.type) {
    case "TITULO":
      return {
        ...estado,
        titulo: accion.valor,
        error: "",
        mensaje: "",
      };

    case "TIPO":
      return {
        ...estado,
        tipo: accion.valor,
        error: "",
        mensaje: "",
      };

    case "EXITO":
      return {
        ...estado,
        titulo: "",
        mensaje: accion.mensaje,
        error: "",
      };

    case "ERROR":
      return {
        ...estado,
        mensaje: "",
        error: accion.mensaje,
      };

    default:
      return estado;
  }
};

const MiLista = ({ token, usuarioId }: Propiedades) => {
  const queryClient = useQueryClient();

  const [formulario, dispatch] = useReducer(reducer, estadoInicial);

  const claveLista = ["mi-lista", usuarioId];

  // CONSULTAR
  const {
    data: contenidos = [],
    isPending: cargando,
    isError,
    error,
  } = useQuery({
    queryKey: claveLista,
    queryFn: () => obtenerMiLista(token),
    retry: 1,
  });

  // AGREGAR
  const mutacionAgregar = useMutation({
    mutationFn: (datos: DatosNuevoItem) => agregarAMiLista(token, datos),

    onSuccess: async () => {
      dispatch({
        type: "EXITO",
        mensaje: "Contenido agregado correctamente.",
      });

      await queryClient.invalidateQueries({
        queryKey: claveLista,
      });
    },

    onError: (error) => {
      dispatch({
        type: "ERROR",
        mensaje: error.message,
      });
    },
  });

  // ACTUALIZAR
  const mutacionActualizar = useMutation({
    mutationFn: ({
      id,
      estado,
    }: {
      id: string;
      estado: "Pendiente" | "Visto";
    }) => actualizarMiLista(token, id, estado),

    onSuccess: async () => {
      dispatch({
        type: "EXITO",
        mensaje: "Estado actualizado correctamente.",
      });

      await queryClient.invalidateQueries({
        queryKey: claveLista,
      });
    },

    onError: (error) => {
      dispatch({
        type: "ERROR",
        mensaje: error.message,
      });
    },
  });

  // ELIMINAR
  const mutacionEliminar = useMutation({
    mutationFn: (id: string) => eliminarDeMiLista(token, id),

    onSuccess: async () => {
      dispatch({
        type: "EXITO",
        mensaje: "Contenido eliminado correctamente.",
      });

      await queryClient.invalidateQueries({
        queryKey: claveLista,
      });
    },

    onError: (error) => {
      dispatch({
        type: "ERROR",
        mensaje: error.message,
      });
    },
  });

  const ocupado =
    mutacionAgregar.isPending ||
    mutacionActualizar.isPending ||
    mutacionEliminar.isPending;

  const enviarFormulario = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (ocupado) return;

    const titulo = formulario.titulo.trim();

    if (titulo.length < 2 || titulo.length > 150) {
      dispatch({
        type: "ERROR",
        mensaje: "El título debe tener entre 2 y 150 caracteres.",
      });
      return;
    }

    mutacionAgregar.mutate({
      titulo,
      tipo: formulario.tipo,
    });
  };

  const cambiarEstado = (id: string, estadoActual: "Pendiente" | "Visto") => {
    if (ocupado) return;

    mutacionActualizar.mutate({
      id,
      estado: estadoActual === "Pendiente" ? "Visto" : "Pendiente",
    });
  };

  const eliminar = (id: string, titulo: string) => {
    if (ocupado) return;

    const confirmado = window.confirm(`¿Eliminar "${titulo}" de tu lista?`);

    if (!confirmado) return;

    mutacionEliminar.mutate(id);
  };

  return (
    <section className="mt-6 border-t border-white/10 pt-6">
      <h3 className="text-xl font-extrabold text-white">Mi lista</h3>

      <p className="mt-2 text-sm text-white/50">
        Organiza tus películas y series favoritas.
      </p>

      {/* FORMULARIO */}
      <form onSubmit={enviarFormulario} className="mt-5 space-y-3">
        <input
          type="text"
          aria-label="Título del contenido"
          placeholder="Nombre de la película o serie"
          required
          minLength={2}
          maxLength={150}
          value={formulario.titulo}
          disabled={ocupado}
          onChange={(evento) =>
            dispatch({
              type: "TITULO",
              valor: evento.target.value,
            })
          }
          className="h-12 w-full rounded-xl border border-white/15 bg-[#1d2142] px-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-screenora-violet"
        />

        <div className="flex flex-wrap gap-3">
          <select
            aria-label="Tipo de contenido"
            value={formulario.tipo}
            disabled={ocupado}
            onChange={(evento) =>
              dispatch({
                type: "TIPO",
                valor: evento.target.value as "Película" | "Serie",
              })
            }
            className="h-12 min-w-32 flex-1 rounded-xl border border-white/15 bg-[#1d2142] px-3 text-sm text-white outline-none focus:border-screenora-violet"
          >
            <option value="Película">Película</option>
            <option value="Serie">Serie</option>
          </select>

          <button
            type="submit"
            disabled={ocupado}
            className="cursor-pointer rounded-xl bg-linear-to-r from-screenora-purple to-screenora-violet px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {mutacionAgregar.isPending ? "Agregando..." : "+ Agregar"}
          </button>
        </div>
      </form>

      {/* MENSAJES */}
      {formulario.error && (
        <p role="alert" className="mt-4 text-sm text-red-300">
          {formulario.error}
        </p>
      )}

      {formulario.mensaje && (
        <p role="status" className="mt-4 text-sm text-green-300">
          {formulario.mensaje}
        </p>
      )}

      {/* CONTENIDOS */}
      <div className="mt-6 space-y-3">
        {cargando && (
          <p className="text-sm text-white/50">Cargando tu lista...</p>
        )}

        {isError && (
          <p role="alert" className="text-sm text-red-300">
            {error.message}
          </p>
        )}

        {!cargando && !isError && contenidos.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-center text-sm text-white/50">
            Tu lista está vacía. Agrega tu primera película o serie.
          </p>
        )}

        {contenidos.map((contenido) => (
          <article
            key={contenido._id}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="break-words font-bold text-white">
                  {contenido.titulo}
                </h4>

                <p className="mt-1 text-xs text-white/50">{contenido.tipo}</p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  contenido.estado === "Visto"
                    ? "bg-green-400/10 text-green-300"
                    : "bg-screenora-purple/20 text-screenora-violet"
                }`}
              >
                {contenido.estado}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={ocupado}
                onClick={() => cambiarEstado(contenido._id, contenido.estado)}
                className="cursor-pointer rounded-lg border border-screenora-violet/40 px-3 py-2 text-xs font-bold text-screenora-violet hover:bg-screenora-violet/10 disabled:opacity-50"
              >
                {contenido.estado === "Pendiente"
                  ? "Marcar como visto"
                  : "Marcar pendiente"}
              </button>

              <button
                type="button"
                disabled={ocupado}
                onClick={() => eliminar(contenido._id, contenido.titulo)}
                className="cursor-pointer rounded-lg border border-red-400/30 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-400/10 disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MiLista;
