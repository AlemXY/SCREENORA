import { useReducer, useRef, type TransitionEvent } from "react";

import obsession from "../assets/banner/obsession.jpg";
import whiplash from "../assets/banner/whiplash.jpg";
import betterCallSaul from "../assets/banner/better-call-saul.jpg";

import obsessionVideo from "../assets/banner/videos/obsession.mp4";
import whiplashVideo from "../assets/banner/videos/whiplash.mp4";
import betterCallSaulVideo from "../assets/banner/videos/better-call-saul.mp4";

const contenidos = [
  {
    titulo: "Obsession",
    generos: "SUSPENSO, DRAMA, MISTERIO",
    puntuacion: "9.4",
    año: "2026",
    duracion: "108 min",
    clasificacion: "R",
    descripcion:
      "Un deseo convierte el amor de Bear en realidad, pero pronto descubre que algunas obsesiones tienen un precio aterrador.",
    imagen: obsession,
    video: obsessionVideo,
  },
  {
    titulo: "Whiplash",
    generos: "DRAMA, MÚSICA",
    puntuacion: "8.5",
    año: "2014",
    duracion: "106 min",
    clasificacion: "R",
    descripcion:
      "Un joven baterista lleva su talento y resistencia al límite bajo la exigente enseñanza de un instructor implacable.",
    imagen: whiplash,
    video: whiplashVideo,
  },
  {
    titulo: "Better Call Saul",
    generos: "DRAMA, CRIMEN",
    puntuacion: "9.0",
    año: "2015",
    duracion: "46 min",
    clasificacion: "TV-MA",
    descripcion:
      "La historia de Jimmy McGill y el camino de decisiones que terminará convirtiéndolo en el abogado Saul Goodman.",
    imagen: betterCallSaul,
    video: betterCallSaulVideo,
  },
];

type FaseTransicion = "visible" | "saliendo" | "entrando";

type EtapaVideo = "esperando" | "cargando" | "reproduciendo";

type EstadoBanner = {
  actual: number;
  destino: number;
  fase: FaseTransicion;
  etapaVideo: EtapaVideo;
  silenciado: boolean;
  errorVideo: boolean;
};

type AccionBanner =
  | { type: "CAMBIAR"; direccion: number }
  | { type: "SALIDA_TERMINADA" }
  | { type: "ENTRADA_TERMINADA" }
  | { type: "CARGAR_VIDEO" }
  | { type: "VIDEO_REPRODUCIENDO" }
  | { type: "CAMBIAR_SONIDO" }
  | { type: "ERROR_VIDEO" };

const estadoInicial: EstadoBanner = {
  actual: 0,
  destino: 0,
  fase: "visible",
  etapaVideo: "esperando",
  silenciado: true,
  errorVideo: false,
};

const reducerBanner = (
  estado: EstadoBanner,
  accion: AccionBanner,
): EstadoBanner => {
  switch (accion.type) {
    case "CAMBIAR":
      if (estado.fase !== "visible") {
        return estado;
      }

      return {
        ...estado,
        destino:
          (estado.actual + accion.direccion + contenidos.length) %
          contenidos.length,
        fase: "saliendo",
      };

    case "SALIDA_TERMINADA":
      if (estado.fase !== "saliendo") {
        return estado;
      }

      return {
        ...estado,
        actual: estado.destino,
        fase: "entrando",
        etapaVideo: "esperando",
        silenciado: true,
        errorVideo: false,
      };

    case "ENTRADA_TERMINADA":
      return {
        ...estado,
        fase: "visible",
      };

    case "CARGAR_VIDEO":
      if (
        estado.etapaVideo !== "esperando" ||
        estado.errorVideo ||
        estado.fase === "saliendo"
      ) {
        return estado;
      }

      return {
        ...estado,
        etapaVideo: "cargando",
      };

    case "VIDEO_REPRODUCIENDO":
      if (estado.etapaVideo !== "cargando") {
        return estado;
      }

      return {
        ...estado,
        etapaVideo: "reproduciendo",
      };

    case "CAMBIAR_SONIDO":
      return {
        ...estado,
        silenciado: !estado.silenciado,
      };

    case "ERROR_VIDEO":
      return {
        ...estado,
        etapaVideo: "esperando",
        errorVideo: true,
      };

    default:
      return estado;
  }
};

const PlayIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="m10 8 6 4-6 4z" />
  </svg>
);

const BookmarkIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 4h12v16l-6-4-6 4z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const VolumeOnIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 9v6h4l5 4V5L9 9H5z" />
    <path d="M17 8a6 6 0 0 1 0 8" />
    <path d="M19 5a10 10 0 0 1 0 14" />
  </svg>
);

const VolumeOffIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 9v6h4l5 4V5L9 9H5z" />
    <path d="m18 9 4 4" />
    <path d="m22 9-4 4" />
  </svg>
);

const Banner = () => {
  const [estado, dispatch] = useReducer(reducerBanner, estadoInicial);

  const temporizadorRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const contenido = contenidos[estado.actual];

  const limpiarTemporizador = () => {
    if (temporizadorRef.current !== null) {
      clearTimeout(temporizadorRef.current);
      temporizadorRef.current = null;
    }
  };

  const programarTrailer = () => {
    limpiarTemporizador();

    if (estado.fase === "saliendo") {
      return;
    }

    temporizadorRef.current = setTimeout(() => {
      temporizadorRef.current = null;
      dispatch({ type: "CARGAR_VIDEO" });
    }, 2000);
  };

  const cambiarPelicula = (direccion: number) => {
    if (estado.fase !== "visible") {
      return;
    }

    limpiarTemporizador();

    dispatch({
      type: "CAMBIAR",
      direccion,
    });
  };

  const siguiente = () => {
    cambiarPelicula(1);
  };

  const anterior = () => {
    cambiarPelicula(-1);
  };

  const manejarFinTransicion = (evento: TransitionEvent<HTMLDivElement>) => {
    if (
      evento.target !== evento.currentTarget ||
      evento.propertyName !== "opacity"
    ) {
      return;
    }

    if (estado.fase === "saliendo") {
      dispatch({ type: "SALIDA_TERMINADA" });
    }

    if (estado.fase === "entrando") {
      dispatch({ type: "ENTRADA_TERMINADA" });
    }
  };

  const videoReproduciendo = () => {
    dispatch({ type: "VIDEO_REPRODUCIENDO" });
  };

  const cambiarSonido = () => {
    dispatch({ type: "CAMBIAR_SONIDO" });
  };

  const manejarErrorVideo = () => {
    dispatch({ type: "ERROR_VIDEO" });
  };

  const videoVisible = estado.etapaVideo === "reproduciendo";

  const videoMontado =
    estado.etapaVideo === "cargando" || estado.etapaVideo === "reproduciendo";

  return (
    <section
      id="inicio"
      className="relative isolate min-h-screen overflow-hidden bg-[#080b1d]"
    >
      <div
        onTransitionEnd={manejarFinTransicion}
        className={`relative min-h-screen transition-opacity duration-500 ease-in-out ${
          estado.fase === "saliendo" ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          key={contenido.titulo}
          src={contenido.imagen}
          alt=""
          onLoad={programarTrailer}
          fetchPriority={estado.actual === 0 ? "high" : "auto"}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
            videoVisible ? "opacity-0" : "opacity-100"
          }`}
        />

        {videoMontado && (
          <video
            key={contenido.titulo}
            src={contenido.video}
            poster={contenido.imagen}
            autoPlay
            muted={estado.silenciado}
            playsInline
            preload="none"
            onPlaying={videoReproduciendo}
            onEnded={siguiente}
            onError={manejarErrorVideo}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              videoVisible ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#080b1d] via-[#080b1d]/85 to-[#080b1d]/15" />

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#080b1d] via-transparent to-[#080b1d]/35" />

        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#080b1d]/30" />

        <div className="relative z-10 flex min-h-screen items-center px-5 pb-32 pt-28 sm:px-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-screenora-purple/30 bg-screenora-purple/10 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-screenora-violet shadow-[0_0_10px_currentColor]" />

              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white sm:text-xs">
                Destacado en Screenora
              </span>
            </div>

            <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.2em] text-screenora-violet sm:text-sm">
              {contenido.generos}
            </p>

            <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              {contenido.titulo}
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/80 sm:gap-4 sm:text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-screenora-purple/30 bg-screenora-purple/10 px-3 py-2 text-white">
                <span className="text-screenora-violet">★</span>
                {contenido.puntuacion}
              </span>

              <span>{contenido.año}</span>

              <span className="h-1 w-1 rounded-full bg-white/40" />

              <span>{contenido.duracion}</span>

              <span className="rounded-md border border-white/20 bg-white/10 px-2.5 py-1">
                {contenido.clasificacion}
              </span>
            </div>

            <p className="mt-7 max-w-xl text-sm leading-7 text-white/75 sm:text-base lg:text-lg">
              {contenido.descripcion}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-5">
              <button
                type="button"
                title="Próximamente: ver película completa"
                className="flex cursor-pointer items-center gap-3 rounded-full bg-linear-to-r from-screenora-purple to-screenora-violet px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-screenora-purple/20 transition-all duration-300 hover:-translate-y-1 hover:brightness-110 sm:px-8 sm:py-4"
              >
                Ver ahora
                <PlayIcon />
              </button>

              <button
                type="button"
                title="Próximamente: añadir a mi lista"
                className="flex cursor-pointer items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-screenora-purple/60 hover:bg-white/10 sm:py-4"
              >
                <BookmarkIcon />
                Mi lista
              </button>
            </div>

            {estado.errorVideo && (
              <p role="alert" className="mt-5 text-sm text-red-300">
                No se pudo reproducir el tráiler.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-[#080b1d]/60 p-2 shadow-xl backdrop-blur-xl sm:bottom-8 sm:right-8 lg:right-12">
        <button
          type="button"
          onClick={anterior}
          aria-label="Contenido anterior"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-white/10 sm:h-10 sm:w-10"
        >
          <ArrowLeftIcon />
        </button>

        <div className="flex min-w-24 items-center gap-2 sm:min-w-36 sm:gap-3">
          <span className="text-xs font-bold text-white">
            {estado.actual + 1}
          </span>

          <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-screenora-violet transition-all duration-500"
              style={{
                width: `${((estado.actual + 1) / contenidos.length) * 100}%`,
              }}
            />
          </div>

          <span className="text-xs font-bold text-white/50">
            {contenidos.length}
          </span>
        </div>

        <button
          type="button"
          onClick={siguiente}
          aria-label="Siguiente contenido"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-white/10 sm:h-10 sm:w-10"
        >
          <ArrowRightIcon />
        </button>

        <div className="mx-1 h-6 w-px bg-white/10" />

        <button
          type="button"
          onClick={cambiarSonido}
          disabled={!videoVisible}
          aria-label={estado.silenciado ? "Activar sonido" : "Silenciar video"}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors duration-300 sm:h-10 sm:w-10 ${
            videoVisible
              ? "cursor-pointer hover:bg-white/10"
              : "cursor-not-allowed opacity-40"
          }`}
        >
          {videoVisible && !estado.silenciado ? (
            <VolumeOnIcon />
          ) : (
            <VolumeOffIcon />
          )}
        </button>
      </div>
    </section>
  );
};

export default Banner;
